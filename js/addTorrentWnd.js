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

var app = angular.module("addTorrentWnd", []);

app.controller("mainCtrl", function($scope) {
  $scope.files = torrentData.info.files;
});

document.addEventListener("DOMContentLoaded", function () {
  console.log(torrentData);

  document.querySelector("#addBtn").addEventListener("click", function() { });
  document.querySelector("#cancelBtn").addEventListener("click", function() { window.close(); } );
  var checkboxes = document.querySelector("#files").querySelectorAll("input[type='checkbox'][checked='checked']");
  console.log(checkboxes);
});
