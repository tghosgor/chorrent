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

console.log("window.js loaded.");

var app = angular.module("mainWnd", []);
var peerId = "";
var torrentMgr = new TorrentMgr;

/* generate random peer id */
for(var i = 0; i < 20; ++i)
{
  var randomIdx = (parseInt(Math.random() * 1000) % 256).toString(16);
  peerId = peerId + "%" + (randomIdx.length == 1 ? "0" + randomIdx : randomIdx); 
}

app.controller("dlistCtrl", function($scope) {
  $scope.torrents = ["test1", "test2", "test3"];
});
