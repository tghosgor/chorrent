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

function TorrentMgr()
{
  this.torrents = new Array();
};

TorrentMgr.prototype.chooseTorrentFile = function()
{
  var self = this;
  chrome.fileSystem.chooseEntry({
    type: "openFile",
    accepts: [{
      description: ".torrent file",
      extensions: ["torrent"]
    }]
  }, function(fileEntry){ self.openTorrentFile(fileEntry); });
};

TorrentMgr.prototype.openTorrentFile = function(fileEntry)
{
  if(fileEntry == undefined)
  {
    console.log("User cancelled.");
    return; /* cancelled */
  }
  var self = this;
  fileEntry.file(function(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      /*! parse bencoded torrent data */
      var torrentData = Bencode.decode(e.target.result);

      /*! open an 'Add Torrent' window */
      chrome.app.window.create("html/addTorrentWnd.html", {
        "bounds": {
          "width": 600,
          "height": 400
        }
      }, function(createdWindow) {
        createdWindow.contentWindow.torrent = new Torrent(torrentData);
      });
    };
    reader.readAsBinaryString(file);
  });
};

TorrentMgr.prototype.parseTorrentFileData = function(e)
{
};

TorrentMgr.prototype.createWindow = function(torrentData)
{
};
