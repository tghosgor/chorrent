/*!

Copyright © 2014 Tolga HOŞGÖR

This file is part of chorrent.

    chorrent is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    chorrent is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with chorrent.  If not, see <http://www.gnu.org/licenses/>.
*/

function UdpTracker(tracker)
{
  var self = this;
  chrome.socket.create("udp", null, function(socketInfo) {
    self.socketId = socketInfo.socketId;
    self.tracker = tracker;
    chrome.socket.connect(socketInfo.socketId, tracker.hostname, tracker.port, function(result) {
      if(result !== 0)
      {
        console.log("Failed to set socket to communicate with udp://" + tracker.hostname + ":" + tracker.port);
        return;
      }
      else
      {
        console.log("Set socket to communicate to udp://" + tracker.hostname + ":" + tracker.port);
        self.connect();
      }
    });
  });
}

UdpTracker.prototype.connect = function()
{
  /* prepare handshake */
  /*
    int64_t	connection_id:
      Must be initialized to 0x41727101980 in network byte order. This will identify the protocol.
    int32_t	action:
      0 for a connection request
    int32_t	transaction_id:
      Randomized by client.
  */

  var connectPacket = new ArrayBuffer(16);
  var connectPacketView = new Uint8Array(connectPacket);

  /* connection_id */
  connectPacketView[7] = 0x80;
  connectPacketView[6] = 0x19;
  connectPacketView[5] = 0x10;
  connectPacketView[4] = 0x27;
  connectPacketView[3] = 0x17;
  connectPacketView[2] = 0x04;
  connectPacketView[1] = 0x00;
  connectPacketView[0] = 0x00;

  /* action */
  connectPacketView[8] = 0x00;
  connectPacketView[9] = 0x00;
  connectPacketView[10] = 0x00;
  connectPacketView[11] = 0x00;

  this.transactionId = new Uint32Array(connectPacket, 12, 1);

  /*
   * no need to do any endianness conversion here I guess
   */
  this.transactionId[0] = parseInt(Math.random() * 0xffffffff);

  var self = this;
  chrome.socket.write(this.socketId, connectPacket, function(writeInfo) { self.connectHandler(writeInfo); });
};

UdpTracker.prototype.connectHandler = function(writeInfo)
{
  if(writeInfo.bytesWritten < 0)
  {
    console.log("Could not send connect packet to udp://" + this.tracker.hostname + ":" + this.tracker.port);
    return;
  }
  else
  {
    console.log("Sent " + writeInfo.bytesWritten + " bytes.");

    var self = this;
    chrome.socket.read(this.socketId, function(readInfo) {
      if(readInfo.resultCode < 0)
      {
        console.log("Error reading from udp://" + this.tracker.hostname + ":" + this.tracker.port + ", RC: " + readInfo.resultCode);
        return;
      }
      else
      {
        var respAction = new Uint32Array(readInfo.data, 0, 1);
        var respTransactionId = new Uint32Array(readInfo.data, 4, 1);
        if(respAction[0] === 0 && respTransactionId[0] === self.transactionId[0])
        {
          console.log("Successfully connected to tracker.");
          var connectionId = new Uint32Array(readInfo.data, 8, 2);
        }
        else
        {
          console.log("Tracker connection transaction ids do not match; sent: " + self.transactionId[0] + ", received: " + respTransactionId[0]);
        }
      }
    });
  }
};

UdpTracker.prototype.announce = function()
{

};
