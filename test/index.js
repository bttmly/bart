const assert = require("assert");
const P = require("prop-types");
const S = P.string.isRequired;
const N = P.number.isRequired;
const { fetch } = require("fetch-ponyfill")();
const Bart = require("../src");

// BART's public API key (http://www.bart.gov/schedules/developers/api)
const client = new Bart({ key: "MW9S-E7SL-26DU-VV8V", fetch });

const schemas = {

  advisories: P.arrayOf(P.shape({
    station: S,
    description: S,
    sms_text: S,
  })).isRequired,

  trainCount: {
    traincount: N,
  },

  elevatorInformation: P.arrayOf(P.shape({
    id: P.string,
    station: S,
    type: P.string,
    description: S,
    sms_text: S,
    posted: P.string,
    expires: P.string,
  })).isRequired,

  realTimeEstimates: P.arrayOf(P.shape({
    destination: S,
    abbreviation: S,
    limited: N,
    estimate: P.arrayOf(P.shape({
      minutes: P.oneOfType([P.string, P.number]).isRequired, // number or "Leaving"
      platform: N,
      direction: S,
      length: N,
      color: S,
      hexcolor: S,
      bikeflag: N,
    })).isRequired,
  })).isRequired,

  routes: P.arrayOf(P.shape({
    name: S,
    abbr: S,
    routeID: S,
    number: N,
    color: S,
  })).isRequired,

  routesInformation: P.arrayOf(P.shape({
    name: S,
    abbr: S,
    routeID: S,
    number: N,
    origin: S,
    destination: S,
    direction: S,
    color: S,
    holidays: N,
    num_stns: N,
    config: P.arrayOf(P.shape({
      station: P.arrayOf(S).isRequired,
    })).isRequired,
  })).isRequired,

  quickPlanner: P.arrayOf(P.shape({
    origin: S,
    destination: S,
    fare: S,
    origTimeMin: S,
    origTimeDate: S,
    destTimeMin: S,
    destTimeDate: S,
    clipper: S,
    leg: P.arrayOf(P.shape({
      order: S,
      transfercode: S,
      origin: S,
      destination: S,
      origTimeMin: S,
      origTimeDate: S,
      destTimeMin: S,
      destTimeDate: S,
      line: S,
      bikeflag: S,
      trainHeadStation: S,
      trainIdx: S,
    })).isRequired,
  })).isRequired,

  fare: P.arrayOf(P.shape({
    fare: N,
    discount: P.array,
  })).isRequired,

  holidays: P.arrayOf(P.shape({
    name: S,
    date: S,
    schedule_type: S,
  })).isRequired,

  loadFactor: P.arrayOf(P.shape({
    schedueType: S,
    scheduleID: S,
    leg: P.arrayOf(P.shape({
      id: S,
      station: S,
      route: S,
      trainId: S,
      load: S,
    })).isRequired,
  })).isRequired,

  routeSchedule: P.arrayOf(P.shape({
    index: S,
    stop: P.arrayOf(P.shape({
      bikeflag: S,
      station: S,
      origTime: P.string, // not always present
    })).isRequired,
  })).isRequired,

  availableSchedules: P.arrayOf(P.shape({
    id: S,
    effectivedate: S,
  })).isRequired,

  specialSchedules: P.arrayOf(P.shape({
    start_date: S,
    end_date: S,
    start_time: S,
    end_time: S,
    text: S,
    link: S,
    orig: S,
    dest: S,
    day_of_week: S,
    routes_affected: S,
  })).isRequired,

  stationSchedule: P.arrayOf(P.shape({
    name: S,
    abbr: S,
    item: P.arrayOf(P.shape({
      line: S,
      trainHeadStation: S,
      origTime: S,
      destTime: S,
      trainIdx: S,
      bikeflag: S,
    })).isRequired,
  })).isRequired,

  stationList: P.arrayOf(P.shape({
    name: S,
    abbr: S,
    gtfs_latitude: N,
    gtfs_longitude: N,
    address: S,
    city: S,
    county: S,
    state: S,
    zipcode: N,
  })),

  stationInformation: {
    name: S,
    abbr: S,
    gtfs_latitude: N,
    gtfs_longitude: N,
    address: S,
    city: S,
    county: S,
    state: S,
    zipcode: N,
    north_platforms: P.array,
    south_platforms: P.array,
    north_routes: P.array,
    south_routes: P.array,
    platform_info: P.string, // not sure if required
    intro: P.string, // not sure if required
    cross_street: P.string, // not sure if required
    food: P.string, // not sure if required
    shopping: P.string, // not sure if required
    attraction: P.string, // not sure if required
    link: P.string, // not sure if required
  },

  stationAccessInformation: {
    parking_flag: S,
    bike_flag: S,
    bike_station_flag: S,
    locker_flag: S,
    name: S,
    abbr: S,
    entering: S,
    exiting: S,
    parking: S,
    fill_time: S,
    car_share: S,
    lockers: S,
    bike_station_text: S,
    destinations: S,
    transit_info: S,
    link: S,
  },
};

const runMethod = (name, params, schema) => async () => {
  if (schema == null) {
    throw new Error("Missing schema for " + name);
  }

  if (typeof client[name] !== "function") {
    throw new Error("Missing method " + name);
  }

  const result = await client[name](params);
  await validate(schema)(result);
};

// const runAndLog = (name, params, schema) => async () => {
//   const d = await runMethod(name, params, schema)()
//   console.log(JSON.stringify(d, null, 2));
// }

// PropTypes calls out to this
console.warn = function (...args) {
  throw new Error(args.join(" "));
};

function validate (schema) {
  if (schema == null) throw new Error("No schema!");
  return data => {
    if (Array.isArray(data) || typeof schema === "function") {
      schema = {items: schema};
      data = {items: data};
    }
    try {
      P.validate(schema, data);
    } catch (err) {
      console.log(JSON.stringify(data, null, 2));
      throw err;
    }
    return data;
  };
}

describe("bart api", () => {
  describe("valid requests", () =>  {
    it("advisories", runMethod("advisories", {}, schemas.advisories));
    it("trainCount", runMethod("trainCount", {}, schemas.trainCount));
    it("elevatorInformation", runMethod("elevatorInformation", {orig: "mcar"}, schemas.elevatorInformation));
    it("realTimeEstimates", runMethod("realTimeEstimates", {orig: "mcar"}, schemas.realTimeEstimates));
    it("routes", runMethod("routes", {}, schemas.routes));
    it("routesInformation", runMethod("routesInformation", {route: 1}, schemas.routesInformation));
    it("quickPlannerArrive", runMethod("quickPlannerArrive", {orig: "mcar", dest: "19th"}, schemas.quickPlanner));
    it("quickPlannerDepart", runMethod("quickPlannerDepart", {orig: "mcar", dest: "19th"}, schemas.quickPlanner));
    it("fare", runMethod("fare", {orig: "mcar", dest: "19th"}, schemas.fare));
    it("holidays", runMethod("holidays", {}, schemas.holidays));
    it("loadFactor", runMethod("loadFactor", {ld1: "mcar0101"}, schemas.loadFactor));
    it("routeSchedule", runMethod("routeSchedule", {route: 1}, schemas.routeSchedule));
    it("availableSchedules", runMethod("availableSchedules", {}, schemas.availableSchedules));
    it("specialSchedules", runMethod("specialSchedules", {}, schemas.specialSchedules));
    it("stationSchedule", runMethod("stationSchedule", {orig: "mcar"}, schemas.stationSchedule));
    it("stationList", runMethod("stationList", {}, schemas.stationList));
    it("stationInformation", runMethod("stationInformation", {orig: "mcar"}, schemas.stationInformation));
    it("stationAccessInformation", runMethod("stationAccessInformation", {orig: "mcar"}, schemas.stationAccessInformation));
  })

  describe("invalid requests", () => {
    it("throws an informative error", async () => {
      const f = runMethod("realTimeEstimates", { /* 'orig' field is missing */ }, schemas.realTimeEstimates);
      const err = await getRejection(f())
      assert.equal(err.message, "Invalid orig");
      assert.equal(err.details, "The orig station parameter  is missing or invalid.");
    })
  })
});

async function getRejection (p) {
  try {
    await p
  } catch (err) {
    return err;
  }
  throw new Error("Expected promise to reject, but it fulfilled")
}
