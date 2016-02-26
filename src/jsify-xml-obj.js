const isPrimitive = x => Object(x) !== x;

function maybeToNumber (str) {
  return (str == "" || isNaN(Number(str))) ? str : Number(str);
}

function deepUnXml (obj) {
  if (isPrimitive(obj)) return maybeToNumber(obj);

  const keys = Object.keys(obj);

  return Object.keys(obj).reduce((out, k) => {
    const val = maybeToNumber(obj[k]);
    
    if (k === "$") {
      return val
    } else if (Array.isArray(val) && val.length === 1 && isPrimitive(val[0])) {
      out[k] = val[0];
    } else if (Array.isArray(val)) {
      out[k] = val.map(deepUnXml);
    } else if (typeof val === "object") {
      out[k] = deepUnXml(val);
    } else {
      out[k] = val
    }

    return out;
  }, {});
}

module.exports = deepUnXml;