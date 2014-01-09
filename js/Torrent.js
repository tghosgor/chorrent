function Torrent(torrentData)
{
  this.data = torrentData;
}

Torrent.prototype.size = function()
{
  return (this.data.info.pieces.length * this.data.info["piece length"] / 20);
}
