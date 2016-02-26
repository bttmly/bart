const request = require("request");
const parseString = require("xml2js").parseString;
const HttpStatus = require("http-status");

const R = require("ramda");

let defaults = {};

module.exports = {
  setDefaults (_defaults) {
    defaults = {...defaults, ..._defaults};
  },
}

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

function makeEndpoint (methodName, namespace, cmd, xform) {
  const url = `http://api.bart.gov/api/${namespace}.aspx`
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

    const qs = {...defaults, ...params, ...base};

    function handle (err, result) {
      if (result) result = deepUnXml(result.root);
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
        return handle(new Error(HttpStatus[resp.statusCode]))
      }

      parseString(body, handle);
    });

    if (promise) return promise;
  }

  maybeSetFunctionName(makeRequest, methodName);

  return makeRequest;
}

const methodConfigs = [
  ["advisories", "bsa", "bsa", R.path(["bsa"])],
  ["trainCount", "bsa", "count", R.pick(["traincount"])],
  ["elevatorInformation", "bsa", "elev", R.path(["bsa"])],
  ["realTimeEstimates", "etd", "etd", R.path(["station", 0, "etd"])],
  ["routes", "route", "routes", R.path(["routes", 0, "route"])],
  ["routesInformation", "route", "routeinfo", R.path(["routes", 0, "route"])],
  ["quickPlannerArrive", "sched", "arrive", R.path(["schedule", 0, "request", 0, "trip"])],
  ["quickPlannerDepart", "sched", "depart", R.path(["schedule", 0, "request", 0, "trip"])],
  ["fare", "sched", "fare", R.path(["trip"])],
  ["holidays", "sched", "holiday", R.path(["holidays", 0, "holiday"])],
  ["loadFactor", "sched", "load", R.path(["load", 0, "request"])],
  ["routeSchedule", "sched", "routesched", R.path(["route", 0, "train"])],
  ["availableSchedules", "sched", "scheds", R.path(["schedules", 0, "schedule"])],
  ["specialSchedules", "sched", "special", R.path(["special_schedules", 0, "special_schedule"])],
  ["stationSchedule", "sched", "stnsched", R.path(["station"])],
  ["stationList", "stn", "stns", R.path(["stations", 0, "station"])],
  ["stationInformation", "stn", "stninfo", R.path(["stations", 0, "station", 0])],
  ["stationAccessInformation", "stn", "stnaccess", R.path(["stations", 0, "station", 0])],
];

methodConfigs.forEach(function ([methodName, namespace, cmd, xform]) {
  module.exports[methodName] = makeEndpoint(methodName, namespace, cmd, xform);
});

module.exports.stations = require("./stations.json");

