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

console.log("linkgrab.js loaded.");

chrome.contextMenus.create({
  id: "linkGrab",
  title: "Download with Chorrent",
  contexts: ["all"]});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if(info.menuItemId != "linkGrab")
    return;
  var magnetInfo = parseMagnet(info.linkUrl);
  console.log(magnetInfo);
  if(magnetInfo.status)
  {
    return;
  }
});

function parseMagnet(magnet)
{
  var parseRegex = /(?:\?|&)([^=&\?#]+)=?([^&#]*)/g;
  var match;
  var torrentInfo = { };
  while(match = parseRegex.exec(magnet))
  {
    if(!torrentInfo[match[1]])
      torrentInfo[match[1]] = new Array;
    torrentInfo[match[1]].push(match[2]);
  }

  /* test magnet for correct hash type */
  var bittorrentTest = /^urn:btih:/;
  if(!bittorrentTest.test(torrentInfo["xt"][0]))
    return {status: 1, text: "No hash BitTorrent hash found in this magnet link."};
  else /* extrach the sha1 hash */
    torrentInfo["xt"][0] = torrentInfo["xt"][0].substr(9, torrentInfo["xt"][0].length - 9);

  /* remove non-http(s) trackers */
  torrentInfo["tr"].forEach(function(tracker) {
    var idx = 0;
  });

  if(torrentInfo["tr"].length == 0)
    return {status: 2, text: "No trackers fonud in this magnet link."};

  torrentInfo.udpTrackerRequests = new Array;
  torrentInfo.httpTrackerRequests = new Array;

  torrentInfo["tr"].forEach(function(tracker) {
    var httpTest = /^https?:\/\//;
    var udpTest = /^udp:\/\//;
    if(httpTest.test(tracker))
    {
      /* url-encode the binary encoded hash */
      for(var i = torrentInfo["xt"][0].length - 2; i >= 0; i-=2)
      {
        torrentInfo["xt"][0] = torrentInfo["xt"][0].substr(0, i) + "%" + torrentInfo["xt"][0].substr(i, torrentInfo["xt"][0].length - i);
      }
      torrentInfo.httpTrackerRequests.push(tracker + "?info_hash=" + torrentInfo["xt"][0] + "&peer_id=" + peer_id
       + "&port=" + parseInt(Math.random() * 1000 + 8000) + "&event=started&numwant=150");
    } else

    /*
     * TODO: UDP Tracker Support
     */
    if(udpTest.test(tracker))
    {
    }
  });

  if(torrentInfo.httpTrackerRequests.length === 0 && torrentInfo.udpTrackerRequests.length === 0)
    return {status: 3, text: "No trackers found in the magnet link."};

  torrentInfo.status = 0;
  torrentInfo.text = "Magnet link successfully parsed.";

  return torrentInfo;
}
