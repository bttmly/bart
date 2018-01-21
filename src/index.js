const makeEndpoint = require("./make-endpoint");

const _get = require("lodash.get");
const _pick = require("lodash.pick");

function get (p) {
  return function (o) {
    return _get(o, p)
  }
}

function pick (p) {
  return function (o) {
    return _pick(o, p)
  }
}

function Bart (opts) {
  if (!(this instanceof Bart)) return new Bart(opts);

  if (typeof opts === "string") {
    this._key = opts;
  } else {
    this._key = opts.key;
    this._fetch = opts.fetch;
  }
}

Bart.stations = require("../data/stations");
Bart.coords = require("../data/coords");

const methodConfigs = [
  ["advisories", "bsa", "bsa", get(["bsa"])],
  ["trainCount", "bsa", "count", pick(["traincount"])],
  ["elevatorInformation", "bsa", "elev", get(["bsa"])],
  ["realTimeEstimates", "etd", "etd", get(["station", 0, "etd"])],
  ["routes", "route", "routes", get(["routes", 0, "route"])],
  ["routesInformation", "route", "routeinfo", get(["routes", 0, "route"])],
  ["quickPlannerArrive", "sched", "arrive", get(["schedule", 0, "request", 0, "trip"])],
  ["quickPlannerDepart", "sched", "depart", get(["schedule", 0, "request", 0, "trip"])],
  ["fare", "sched", "fare", get(["trip"])],
  ["holidays", "sched", "holiday", get(["holidays", 0, "holiday"])],
  ["loadFactor", "sched", "load", get(["load", 0, "request"])],
  ["routeSchedule", "sched", "routesched", get(["route", 0, "train"])],
  ["availableSchedules", "sched", "scheds", get(["schedules", 0, "schedule"])],
  ["specialSchedules", "sched", "special", get(["special_schedules", 0, "special_schedule"])],
  ["stationSchedule", "sched", "stnsched", get(["station"])],
  ["stationList", "stn", "stns", get(["stations", 0, "station"])],
  ["stationInformation", "stn", "stninfo", get(["stations", 0, "station", 0])],
  ["stationAccessInformation", "stn", "stnaccess", get(["stations", 0, "station", 0])],
];

methodConfigs.forEach(function ([methodName, namespace, cmd, xform]) {

  Bart[methodName] = makeEndpoint(methodName, namespace, cmd, xform);

  Bart.prototype[methodName] = function (_params) {
    const params = Object.assign({}, _params, { key: this._key });
    return Bart[methodName](params, { fetch: this._fetch });
  };

});

module.exports = Bart;
