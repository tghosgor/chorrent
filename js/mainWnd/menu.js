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

var app = angular.module("mainWnd");

app.controller("menuCtrl", function($scope) {
  $scope.menuItems = [{
    name: "Add Torrent",
    id: "addTorrent",
    onclick: function() {torrentMgr.chooseTorrentFile();}
  }];
});

document.addEventListener("DOMContentLoaded", function () {
  angular.element(document.getElementById("menu")).scope().menuItems.forEach(function(item) {
      document.getElementById(item.id).addEventListener('click', item.onclick);
  });
});
