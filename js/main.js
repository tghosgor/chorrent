/*!
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

var peerId = "";
var torrentMgr = new TorrentMgr();
var torrents = ["test1", "test2", "test3"];

/* generate random peer id */
for(var i = 0; i < 20; ++i)
{
  var randomIdx = (parseInt(Math.random() * 1000) % 256).toString(16);
  peerId = peerId + "%" + (randomIdx.length == 1 ? "0" + randomIdx : randomIdx);
};

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("html/mainWnd.html", {
    id: "mainWnd",
    "bounds": {
      "width": 1024,
      "height": 720
    }
  });
});
