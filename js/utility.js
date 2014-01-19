
var Utility =
{

assign: function(obj, prop, value) {
    if (typeof prop === "string")
        prop = prop.split(".");

    if (prop.length > 1) {
        var e = prop.shift();
        assign(obj[e] =
                 Object.prototype.toString.call(obj[e]) === "[object Object]"
                 ? obj[e]
                 : {},
               prop,
               value);
    } else
        obj[prop[0]] = value;
},

swap16: function(val) {
  return ((val & 0xFF) << 8)
    | ((val >> 8) & 0xFF);
},

swap32: function(val) {
  return ((val & 0xFF) << 24)
    | ((val & 0xFF00) << 8)
    | ((val >> 8) & 0xFF00)
    | ((val >> 24) & 0xFF);
},

ab2str: function(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
},

str2ab: function(str) {
  var buf = new ArrayBuffer(str.length); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen = str.length; i < strLen; i++)
  {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
},

hexstr2ab: function(str) {
  var buf = new ArrayBuffer(str.length / 2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  var strLen = str.length / 2
  var i = 0;
  if(strLen%2 === 1)
    bufView[i++] = 0;
  for (; i < strLen; ++i)
  {
    bufView[i] = parseInt(str.substr(i * 2, 2), 16);
  }
  return buf;
}

};
