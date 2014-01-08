
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
  }, function(fileEntry){ self.readTorrentFileData(fileEntry); });
};

TorrentMgr.prototype.readTorrentFileData = function(fileEntry)
{
  if(fileEntry == undefined)
  {
    console.log("User cancelled.");
    return; /* cancelled */
  }
  var self = this;
  fileEntry.file(function(file) {
    var reader = new FileReader();
    reader.onload = function(e){ self.parseTorrentFileData(e); };
    reader.readAsBinaryString(file);
  });
};

TorrentMgr.prototype.parseTorrentFileData = function(e)
{
  var torrentData = Bencode.decode(e.target.result);
  this.createWindow(torrentData);
};

TorrentMgr.prototype.createWindow = function(torrentData)
{
  chrome.app.window.create("html/addTorrentWnd.html", {
    "bounds": {
      "width": 600,
      "height": 400
    }
  }, function(createdWindow) {
    createdWindow.contentWindow.torrentData = torrentData;
  });
};

TorrentMgr.prototype.addTorrent = function(data)
{
  
};
