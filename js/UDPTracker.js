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

function UdpTracker(tracker, torrent)
{
  var self = this;
  this.tracker = tracker;
  this.torrent = torrent;
  chrome.socket.create("udp", null, function(socketInfo) {
    self.socketId = socketInfo.socketId;
    chrome.socket.connect(socketInfo.socketId, tracker.hostname, tracker.port, function(result) {
      if(result !== 0)
        throw "Failed to set socket to communicate with udp://" + tracker.hostname + ":" + tracker.port;

      console.log("Set socket to communicate to udp://" + tracker.hostname + ":" + tracker.port);
      self.connect();
    });
  });
}

UdpTracker.prototype.connect = function()
{
  var self = this;

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
  var connectPacketView = new Int8Array(connectPacket);

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

  var transactionId = new Int32Array(connectPacket, 12, 1);

  /*
   * no need to do any endianness conversion here I guess
   */
  transactionId[0] = Math.ceil(Math.random() * 0xffffffff);

  chrome.socket.write(this.socketId, connectPacket, function(writeInfo) {
    if(writeInfo.bytesWritten < 0)
      throw "Could not send connect packet to udp://" + this.tracker.hostname + ":" + this.tracker.port;

    console.log("Sent " + writeInfo.bytesWritten + " bytes.");

    chrome.socket.read(self.socketId, function(readInfo) {
      self.connectHandler(readInfo, transactionId);
    });
  });
};

UdpTracker.prototype.connectHandler = function(readInfo, transactionId)
{
  var self = this;

  if(readInfo.resultCode < 0)
    throw "Error reading from udp://" + this.tracker.hostname + ":" + this.tracker.port + ", RC: " + readInfo.resultCode;

  var respAction = new Int32Array(readInfo.data, 0, 1);
  var respTransactionId = new Int32Array(readInfo.data, 4, 1);

  if(respAction[0] !== 0)
    throw "Error in tracker response; action: " + respAction[0];
  if(respTransactionId[0] !== transactionId[0])
    throw "Error in tracker response; sent tId: " + self.transactionId[0] + ", recv tId: " + respTransactionId[0];

  console.log("Successfully connected to tracker.");
  self.connectionId = new Int32Array(readInfo.data, 8, 2);
  //console.log(new Int32Array(readInfo.data));
  self.announce();
};

UdpTracker.prototype.announce = function()
{
  var self = this;
  /*
    Offset	Size                Name            Value
    0       8 (64 bit integer)	connection id	  connection id from server
    8       4 (32-bit integer)	action          1; for announce request
    12      4 (32-bit integer)	transaction id  client can make up another transaction id...
    16      20                  info_hash       the info_hash of the torrent that is being announced
    36      20                  peer id         the peer ID of the client announcing itself
    56      8 (64 bit integer)  downloaded      bytes downloaded by client this session
    64      8 (64 bit integer)	left            bytes left to complete the download
    72      8 (64 bit integer)	uploaded        bytes uploaded this session
    80      4 (32 bit integer)	event           0=None; 1=Download completed; 2=Download started; 3=Download stopped.
    84      4 (32 bit integer)	IPv4            IP address, default set to 0 (use source address)
    88      4 (32 bit integer)	key             ?
    92      4 (32 bit integer)	num want        -1 by default. number of clients to return
    96      2 (16 bit integer)	port            the client's TCP port
  */
  var annPacket = new ArrayBuffer(98);
  var annPacketConnId = new Int32Array(annPacket, 0, 2);
  var annPacketAction = new Int32Array(annPacket, 8, 1);
  var annPacketTransId = new Int32Array(annPacket, 12, 1);
  var annPacketInfoHash = new Int8Array(annPacket, 16, 20);
  var annPacketPeerId = new Int8Array(annPacket, 36, 20);
  //TODO: convert bottom 3 to int8_t for network byte ordering manipulation
  var annPacketDownloaded = new Int32Array(annPacket, 56, 2);
  var annPacketLeft = new Int32Array(annPacket, 64, 2);
  var annPacketUploaded = new Int32Array(annPacket, 72, 2);
  var annPacketEvent = new Int32Array(annPacket, 80, 1);
  var annPacketIpv4 = new Uint32Array(annPacket, 84, 1);
  var annPacketKey = new Uint32Array(annPacket, 88, 1);
  var annPacketNumWant = new Int32Array(annPacket, 92, 1);
  var annPacketPort = new Uint16Array(annPacket, 96, 1);

  annPacketConnId.set(this.connectionId);
  annPacketAction[0] = Utility.bs32(1);
  annPacketTransId[0] = Math.ceil(Math.random() * 0xffffffff);
  annPacketInfoHash.set(this.torrent.infoHash);
  annPacketPeerId.set(this.torrent.peerId);
  annPacketDownloaded[0] = 0;
  annPacketDownloaded[1] = 0;
  annPacketLeft[0] = 0;
  annPacketLeft[1] = 0;
  annPacketUploaded[0] = 0;
  annPacketUploaded[1] = 0;
  annPacketEvent[0] = 0;
  annPacketIpv4[0] = 0;
  annPacketKey[0] = Math.ceil(Math.random() * 0xffffffff);
  annPacketNumWant[0] = Utility.bs32(-1);
  annPacketPort[0] = Utility.bs32(6881);

  chrome.socket.write(this.socketId, annPacket, function(writeInfo) {
    if(writeInfo.bytesWritten < 0)
      throw "Error announcing; retval: " + writeInfo.bytesWritten;

    console.log(new Int8Array(annPacket));

    chrome.socket.read(self.socketId, function(readInfo) {
      self.announceHandler(readInfo, annPacketTransId);
    });
  });
};

UdpTracker.prototype.announceHandler = function(readInfo, transactionId)
{
  if(readInfo.resultCode < 0)
    throw "Error reading announce response; RC: " + readInfo.resultCode;

  var respAction = new Int32Array(readInfo.data, 0, 1);
  var respTransactionId = new Int32Array(readInfo.data, 4, 1);

  if(transactionId[0] !== respTransactionId[0])
    throw "Error in announce response; sent tId: " + transactionId[0] + ", recv tId: " + respTransactionId[0]
  if(respAction[0] !== Utility.bs32(0x1))
  {
    var errorStr = Utility.ab2str(new Int8Array(readInfo.data, 8));
    throw "Error in announce response; action: " + Utility.bs32(respAction[0]) + ", message: " + errorStr;
  }

  var respInterval = new Int32Array(readInfo.data, 8, 1);
  this.torrent.leechers.set(new Int32Array(
    Utility.typedArrayBS(new Int32Array(readInfo.data, 12, 1))));
  this.torrent.seeders.set(new Int32Array(
    Utility.typedArrayBS(new Int32Array(readInfo.data, 16, 1))));

  console.log(this.torrent);
};
