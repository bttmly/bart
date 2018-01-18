function maybeSetFunctionName (fn, name) {
  try {
    Object.defineProperty(fn, "name", {
      value: name,
      writable: false,
      enumerable: false,
      configurable: true,
    });
  } catch (e) {}
}

module.exports = maybeSetFunctionName;
