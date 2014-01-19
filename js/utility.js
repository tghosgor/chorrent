
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

bs16: function(val) {
  return ((val & 0xFF) << 8)
    | ((val >> 8) & 0xFF);
},

bs32: function(val) {
  return ((val & 0xFF) << 24)
    | ((val & 0xFF00) << 8)
    | ((val >> 8) & 0xFF00)
    | ((val >> 24) & 0xFF);
},

typedArrayBS: function(val) {
  //console.log("raw input:");
  //console.log(val);
  var byteReader = new Uint8Array(val.buffer, val.byteOffset, val.length * val.BYTES_PER_ELEMENT);
  var newVal = new Uint8Array(val.length * val.BYTES_PER_ELEMENT);
  for(var i = 0; i < byteReader.length; i += val.BYTES_PER_ELEMENT)
  {
    for(var i2 = 0; i2 < val.BYTES_PER_ELEMENT; ++i2)
      newVal[i + i2] = byteReader[i + (val.BYTES_PER_ELEMENT - 1 - i2)];
  }

  //console.log("input:");
  //console.log(byteReader);
  //console.log("output:");
  //console.log(newVal);

  return newVal.buffer;
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

hexStr2ab: function(str) {
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
