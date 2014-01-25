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

var app = angular.module("addTorrentWnd", []);

app.controller("mainCtrl", function($scope) {
  $scope.torrent = torrent;
  $scope.info = torrent.metadata.info;
  $scope.files = torrent.metadata.info.files;
});

document.addEventListener("DOMContentLoaded", function () {
  console.log(torrent);

  document.querySelector("#addBtn").addEventListener("click", function() {
      chrome.runtime.getBackgroundPage(function(root) {
        root.torrents.push(torrent);
        console.log(root.torrents);
      });
  });
  document.querySelector("#cancelBtn").addEventListener("click", function() { window.close(); } );
  var checkboxes = document.querySelector("#files").querySelectorAll("input[type='checkbox'][checked='checked']");
});
