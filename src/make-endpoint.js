const pify = require("pify");
const parseString = pify(require("xml2js").parseString);
const jsify = require("./jsify-xml-obj");
const setFnName = require("./set-fn-name");

function makeEndpoint (methodName, namespace, cmd, xform) {
  const url = `http://api.bart.gov/api/${namespace}.aspx`;
  const base = {cmd};

  function makeRequest (params, { fetch } = {}) {
    if (fetch == null) fetch = global.fetch;

    const qs = {...params, ...base};

    if (typeof params.key !== "string") {
      return Promise.reject(new Error("Must pass an API key."));
    }

    return fetch(makeURL({ url, qs }))
      .then((r) => r.text())
      .then(parseString)
      .then((result) => {
        result = jsify(result.root);
        if (result && xform && !params.raw) result = xform(result);
        return result;
      });
  }
  setFnName(makeRequest, methodName);
  return makeRequest;
}

function makeURL ({ url, qs }) {
  const query = Object.keys(qs)
    .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(qs[k]))
    .join("&");
  return `${url}?${query}`;
}

module.exports = makeEndpoint;
