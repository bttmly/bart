const pify = require("pify");
const parseString = pify(require("xml2js").parseString);
const jsify = require("./jsify-xml-obj");
const setFnName = require("./set-fn-name");
const get = require("lodash/fp/get");

function makeEndpoint (methodName, namespace, cmd, xform) {
  const url = `http://api.bart.gov/api/${namespace}.aspx`;
  const base = {cmd};

  function makeRequest (params, { fetch, raw } = {}) {
    if (fetch == null) fetch = global.fetch;

    const qs = Object.assign({}, params,  base);

    if (typeof params.key !== "string") {
      return Promise.reject(new Error("Must pass an API key."));
    }

    return fetch(makeURL({ url, qs }))
      .then(function (r) { return r.text() })
      .then(parseString)
      .then(function (result) {
        result = jsify(result.root);
        const errData = getError(result)
        if (errData) {
          throw new BartError(errData)
        }
        if (result && xform && !raw) result = xform(result);
        return result;
      });
  }
  setFnName(makeRequest, methodName);
  return makeRequest;
}

function makeURL ({ url, qs }) {
  const query = Object.keys(qs)
    .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(qs[k]) })
    .join("&");
  return `${url}?${query}`;
}

class BartError extends Error {
  constructor (errData) {
    // TODO: multiple errors?
    super(errData[0].text)
    this.details = errData[0].details;
  }
}

const getError = get([ "message", 0, "error" ]);

module.exports = makeEndpoint;
