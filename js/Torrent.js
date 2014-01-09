function Torrent(torrentData)
{
  this.data = torrentData;
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
