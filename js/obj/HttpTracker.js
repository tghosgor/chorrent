function HttpTracker(uri, torrent)
{
  this.torrent = torrent;
  this.uri = uri;
}

HttpTracker.prototype.update = function()
{
  var self = this;
  var requestUri = this.uri + "?info_hash=" + this.torrent.peInfoHash + "&peer_id="
    + this.torrent.pePeerId + "&port=6881&uploaded=0&downloaded=0&left=" + this.torrent.size();
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4)
    {
      var correctedResponse = xhr.responseText.toString();
      var regexList = [/5:peers/, /([^d])2\:ip/g, /porti([\d]{2,5})[^e](.+?):/g];
      var replacementList = ["5:peersl", "$1d2:ip", "porti$1e$2:"];
      for(var i = 0; i < regexList.length; ++i)
      {
        correctedResponse = correctedResponse.replace(regexList[i], replacementList[i]);
      }
      correctedResponse = correctedResponse.replace(/( )?$/, "e$1");

      var response = Bencode.decode(correctedResponse);

      self.interval = response.interval;

      response.peers.forEach(function(peer) {
        self.torrent.peers.push(peer);
      });

      self.torrent.onPeersChanged();
    }
  };
  xhr.open("GET", requestUri, true);
  xhr.send();
}
