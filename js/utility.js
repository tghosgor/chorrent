function Utility()
{ }

Utility.prototype.assign = function(obj, prop, value) {
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
};

Utility.prototype.swap16 = function(val) {
  return ((val & 0xFF) << 8)
    | ((val >> 8) & 0xFF);
}

Utility.prototype.swap32 = function(val) {
  return ((val & 0xFF) << 24)
    | ((val & 0xFF00) << 8)
    | ((val >> 8) & 0xFF00)
    | ((val >> 24) & 0xFF);
}

Utility.prototype.swap64 = function(val) {
  return ((val & 0xFF) << 56)
    | ((val & 0xFF00) << 8)
    | ((val >> 8) & 0xFF00)
    | ((val >> 24) & 0xFF)
    | ((val >> 32) & 0xFF)
    | ((val >> 48) & 0xFF)
    | ((val >> 56) & 0xFF);
}
