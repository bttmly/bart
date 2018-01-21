function jsifyXmlObj (obj) {
  if (isPrimitive(obj)) return maybeToNumber(obj);

  return Object.keys(obj).reduce(function (out, k) {
    const val = maybeToNumber(obj[k]);

    if (k === "$") {
      return val;
    } else if (Array.isArray(val) && val.length === 1 && isPrimitive(val[0])) {
      out[k] = val[0];
    } else if (Array.isArray(val)) {
      out[k] = val.map(jsifyXmlObj);
    } else if (typeof val === "object") {
      out[k] = jsifyXmlObj(val);
    } else {
      out[k] = val;
    }

    return out;
  }, {});
}

module.exports = jsifyXmlObj;

function isPrimitive (x) {
  return Object(x) !== x;
}

function maybeToNumber (str) {
  return (str == "" || isNaN(Number(str))) ? str : Number(str);
}
