
var torrents = new Array();
var torrentMgr = { };

torrentMgr.chooseTorrentFile = function()
{
  chrome.fileSystem.chooseEntry({
    type: "openFile",
    accepts: [{
      description: ".torrent file",
      extensions: ["torrent"]
    }]
  }, torrentMgr.readTorrentFileData);
}

torrentMgr.readTorrentFileData = function(fileEntry)
{
  fileEntry.file(function(file) {
    var reader = new FileReader();
    reader.onload = torrentMgr.parseTorrentFileData;
    reader.readAsBinaryString(file);
  });
}

torrentMgr.parseTorrentFileData = function(e)
{
  var torrent = Bencode.decode(e.target.result);
  torrentMgr.createWindow(torrent);
}

torrentMgr.createWindow = function(torrent)
{
  
}

torrentMgr.addTorrent = function(data)
{
  
}
