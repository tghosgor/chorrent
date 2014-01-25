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

console.log("window.js loaded.");

var app = angular.module("mainWnd", []);

app.controller("dlistCtrl", function($scope) {
  chrome.runtime.getBackgroundPage(function(root) {
    $scope.$apply(function(){ $scope.torrents = root.torrents; });
  });
});

app.controller("menuCtrl", function($scope) {
  $scope.menuItems = [{
    name: "Add Torrent",
    id: "addTorrent",
    onclick: function() {
      chrome.runtime.getBackgroundPage(function(root) {
        chrome.fileSystem.chooseEntry({
        type: "openFile",
        accepts: [{
          description: ".torrent file",
          extensions: ["torrent"]
        }]
      }, function(fileEntry){ root.torrentMgr.openTorrentFile(fileEntry); }); });
    }
  }];
});

document.addEventListener("DOMContentLoaded", function () {
  angular.element(document.getElementById("menu")).scope().menuItems.forEach(function(item) {
      document.getElementById(item.id).addEventListener('click', item.onclick);
  });
});
