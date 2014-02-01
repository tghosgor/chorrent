/*!
  Copyright (C) 2014 Tolga HOŞGÖR

  This file is part of chorrent.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function Torrent(torrentData, peerId)
{
  var self = this;

  this.metadata = torrentData;
  this.structuredPaths = new Array;
  this.peerId = new Int8Array(20);
  this.httpTrackers = new Array;
  this.udpTrackers = new Array;
  this.peers = new Array;
  this.seeders = new Int32Array(1);
  this.leechers = new Int32Array(1);

  /* generate random peer id for this torrent if none given */
  if(peerId === undefined)
  {
    for(var i = 0; i < 20; ++i)
    {
      this.peerId[i] = Math.floor(Math.random() * 256);
    }
  }
  else
    this.peerId = peerId;

  /* percent encode peerId */
  var uPeerId = new Uint8Array(this.peerId.buffer);
  this.pePeerId = new String;
  for(var i = 0; i < 20; ++i)
  {
    var hexStr = uPeerId[i].toString(16);
    this.pePeerId = this.pePeerId + "%" + (hexStr.length > 1 ? hexStr : "0" + hexStr);
  }

  /* store trackers seperately according to protocol */
  var protocolRegex = [/^https?:\/\//, /^udp:\/\/(.+?)(?::([\d]+))?\//];

  var match;
  if(this.metadata["announce-list"] !== undefined)
  {
    this.metadata["announce-list"].forEach(function(tracker) {
      if(tracker[0].match(protocolRegex[0]))
        self.httpTrackers.push(new HttpTracker(self.metadata.announce, self));
      else if((match = tracker[0].match(protocolRegex[1])))
        self.udpTrackers.push(new UdpTracker(match[1], parseInt(match[2]), self));
    });
  } else
  {
    /* here because always the same with one in announce-list? */
    if(this.metadata.announce.match(protocolRegex[0]))
      this.httpTrackers.push(new HttpTracker(this.metadata.announce, this));
    else if((match = this.metadata.announce.match(protocolRegex[1])))
      this.udpTrackers.push(new UdpTracker(match[1], parseInt(match[2]), this));
  }

  /* if torrent has multiple files */
  if(this.metadata.info.files)
  {
    this.metadata.info.files.forEach(function(e) {
      e.path.forEach(function(e2, index, array) {
        //TODO: find a js tree checkbox lib and generate compatible structure
      });
    });
  }

  /* get sha1 of bencoded torrent metadata info */
  var sha1 = new Rusha(this.metadata.info.length);
  var infoHashStr = sha1.digest(Bencode.encode(this.metadata.info));
  this.infoHash = new Int8Array(Utility.hexStr2ab(infoHashStr));

  /* percent encode the hex string of sha1 */
  this.peInfoHash = new String;
  for(var i = 0; i < 40; i += 2)
  {
    this.peInfoHash = this.peInfoHash + "%" + infoHashStr.substr(i, 2);
  }

  this.updatePeers();
}

Torrent.prototype.updatePeers = function()
{
  var self = this;

  /* remove all current peers */
  this.peers.splice(0, this.peers.length);

  /* below here requests new peers and repopulate torrent peers */
  this.httpTrackers.forEach(function(httpTracker) {
    httpTracker.update();
  });
  this.udpTrackers.forEach(function(udpTracker) {
    udpTracker.update();
  });
}

Torrent.prototype.onPeersChanged = function()
{
  console.log(this);
}

Torrent.prototype.size = function()
{
  return (this.metadata.info.pieces.length * this.metadata.info["piece length"] / 20);
}

Torrent.prototype.start = function()
{
}

Torrent.prototype.stop = function()
{
}

Torrent.prototype.status = function()
{
}

Torrent.prototype.completionPercentage = function()
{
}
