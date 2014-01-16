function Torrent(torrentData)
{
  this.data = torrentData;
  this.structuredPaths = new Array();
  var self = this;
  this.data.info.files.forEach(function(e) {
    e.path.forEach(function(e2, index, array) {
      //TODO: find a js tree checkbox lib and generate compatible structure
    });
  });
  console.log(self.structuredPaths);
}

Torrent.prototype.size = function()
{
  return (this.data.info.pieces.length * this.data.info["piece length"] / 20);
}

Torrent.prototype.start = function()
{
}

Torrent.prototype.stop = function()
{
}

Torrent.prototype.status = function()
{
}

Torrent.prototype.completionPercentage = function()
{
}
