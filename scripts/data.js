const path = require("path");
const fs = require("fs");

global.fetch = require("fetch-ponyfill")().fetch;

const Bart = require("../");
const client = new Bart("MW9S-E7SL-26DU-VV8V");
const keys = Object.keys(Bart.stations);

(async function main () {

  const stations = await Promise.all(keys.map(k => client.stationInformation({orig: k})))

  console.log("s[0]", stations[0])

  const coords = {};
  const abbrevs = {};

  stations.forEach((s) => {
    const name = s.abbr.toLowerCase();
    coords[name] = { lat: s.gtfs_latitude, lon: s.gtfs_longitude }
    abbrevs[name] = s.name;
  })

  fs.writeFileSync(path.join(__dirname, "../data/coords.json"), JSON.stringify(coords, null, 2));
  fs.writeFileSync(path.join(__dirname, "../data/stations.json"), JSON.stringify(abbrevs, null, 2));
}())

process.on("unhandledRejection", err => { throw err })
