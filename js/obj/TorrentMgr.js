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

function TorrentMgr()
{
  this.torrents = new Array;
};

//TODO: Rename to UiMgr and make TorrentMgr seperate to run as main js in manifest.

TorrentMgr.prototype.openTorrentFile = function(fileEntry)
{
  if(fileEntry === undefined)
  {
    console.log("User cancelled.");
    return; /* cancelled */
  }
  var self = this;
  fileEntry.file(function(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      //console.log(e.target.result);

      /* parse bencoded torrent data */
      var torrentData = Bencode.decode(e.target.result);

      /* open an 'Add Torrent' window */
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
