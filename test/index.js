const P = require("prop-types");
const S = P.string.isRequired;
const N = P.number.isRequired;

const bart = require("../src");

// BART's public API key (http://www.bart.gov/schedules/developers/api)
bart.setDefaults({key: "MW9S-E7SL-26DU-VV8V"});

function throwIfErr (data) {
  if (data == null) {
    throw new Error("No data!");
  }

  if (data instanceof Error) {
    throw data;
  }

  if (data.message && data.message[0].error) {
    throw new Error(data.message[0].error[0].details);
  }
}

const station = P.shape();


const base = {
  uri: S,
  date: S,
  time: S,
};

const schemas = {
  
  advisories: {
    ...base,
    bsa: P.arrayOf(P.shape({
      station: S,
      description: S,
      sms_text: S,
    })).isRequired,
  },

  trainCount: {
    ...base,
    traincount: N,
  },

  elevatorInformation: {
    ...base,
    bsa: P.arrayOf(P.shape({
      id: S,
      station: S,
      type: S,
      description: S,
      sms_text: S,
      posted: S,
      expires: S,
    })).isRequired,
  },

  realTimeEstimates: {
    ...base,
    station: P.arrayOf(P.shape({
      name: S,
      abbr: S,
      etd: P.arrayOf(P.shape({
        destination: S,
        abbreviation: S,
        limited: N,
        estimate: P.arrayOf(P.shape({
          minutes: N,
          platform: N,
          direction: S,
          length: N,
          color: S,
          hexcolor: S,
          bikeflag: N
        })).isRequired,
      })).isRequired
    })).isRequired,
  },

  routes: {
    uri: S,
    sched_num: N,
    routes: P.arrayOf(P.shape({
      route: P.arrayOf(P.shape({
        name: S,
        abbr: S,
        routeID: S,
        number: N,
        color: S,
      })).isRequired,
    })).isRequired,
  },

  routesInformation: {
    uri: S,
    sched_num: N,
    routes: P.arrayOf(P.shape({
      route: P.arrayOf(P.shape({
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
    })).isRequired,
  },

  quickPlanner: {
    uri: S,
    origin: S,
    destination: S,
    sched_num: N,
    schedule: P.arrayOf(P.shape({
      date: S,
      time: S,
      before: N,
      after: N,
      request: P.arrayOf(P.shape({
        trip: P.arrayOf(P.shape({
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
      })).isRequired,
    })).isRequired,
  },

  fare: {
    uri: S,
    origin: S,
    destination: S,
    sched_num: N,
    trip: P.arrayOf(P.shape({
      fare: N,
      discount: P.array,
    })).isRequired,
  },

  // TODO: unnest holiday property w/ post-transform
  holidays: {
    uri: S,
    holidays: P.arrayOf(P.shape({
      holiday: P.arrayOf(P.shape({
        name: S,
        date: S,
        schedule_type: S,
      })).isRequired,
    })).isRequired,
  },

  // no idea how to construct a valid request to this resource
  loadFactor: {
    uri: S,
    load: P.arrayOf(P.shape({
      request: P.arrayOf(P.shape({
        schedueType: S,
        scheduleID: S,
        leg: P.arrayOf(P.shape({
          id: S,
          station: S,
          route: S,
          trainId: S,
          load: S,
        })).isRequired
      })).isRequired
    })).isRequired
  },

  routeSchedule: {
    uri: S,
    date: S,
    sched_num: N,
    route: P.arrayOf(P.shape({
      train: P.arrayOf(P.shape({
        index: S,
        stop: P.arrayOf(P.shape({
          bikeflag: S,
          station: S,
          origTime: P.string, // NOT REQUIRED
        })).isRequired,
      })).isRequired,
    })).isRequired,
  },

  availableSchedules: {
    uri: S,
    // TODO unnest this
    schedules: P.arrayOf(P.shape({
      schedule: P.arrayOf(P.shape({
        id: S,
        effectivedate: S,
      })).isRequired,
    })).isRequired,
  },

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

  stationSchedule: {
    uri: S,
    date: S,
    sched_num: N,
    station: P.arrayOf(P.shape({
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
  },

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





const runMethod = (name, params, schema) => () => {
  if (schema == null) {
    throw new Error("Missing schema for " + name);
  }

  if (typeof bart[name] !== "function") {
    throw new Error("Missing method " + name);
  }
  
  return bart[name](params).then(validate(schema)).then(throwIfErr, throwIfErr);
}

// PropTypes calls out to this
console.warn = function (...args) {
  throw new Error(args.join());
}

const validate = schema => {
  if (schema == null) throw new Error("No schema!");
  return data => {
    if (Array.isArray(data)) {
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
  it("advisories", runMethod("advisories", {}, schemas.advisories))
  it("trainCount", runMethod("trainCount", {}, schemas.trainCount))
  it("elevatorInformation", runMethod("elevatorInformation", {orig: "mcar"}, schemas.elevatorInformation))
  it("realTimeEstimates", runMethod("realTimeEstimates", {orig: "mcar"}, schemas.realTimeEstimates))
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
});
