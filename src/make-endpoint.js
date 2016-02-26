const request = require("request");
const parseString = require("xml2js").parseString;
const HttpStatus = require("http-status");

const jsify = require("./jsify-xml-obj");
const setFnName = require("./set-fn-name");

function makeEndpoint (methodName, namespace, cmd, xform) {
  const url = `http://api.bart.gov/api/${namespace}.aspx`;
  const base = {cmd};

  function makeRequest (params, cb) {
    let resolve, reject, promise;

    if (params == null) {
      cb = params;
      params = {};
    }

    if (typeof cb !== "function") {
      promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve; reject = _reject;
      });
    }

    const qs = {...params, ...base};

    function handle (err, result) {
      if (result) result = jsify(result.root);
      if (result && xform && !params.raw) result = xform(result); // TODO test raw
      promise ?
        (err ? reject(err) : resolve(result)) :
        (err ? cb(err) : cb(null, result));
    }

    request({url, qs}, function (err, resp, body) {
      if (err) {
        return handle(err);
      }

      if (resp.statusCode > 299) {
        return handle(new Error(HttpStatus[resp.statusCode]));
      }

      parseString(body, handle);
    });

    if (promise) return promise;
  }

  setFnName(makeRequest, methodName);

  return makeRequest;
}

module.exports = makeEndpoint;