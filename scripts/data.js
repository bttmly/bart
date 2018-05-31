const path = require("path");
const fs = require("fs");

const { fetch } = require("fetch-ponyfill")();

const Bart = require("../src");
// BART's public API key (http://www.bart.gov/schedules/developers/api)
const client = new Bart({ key: "MW9S-E7SL-26DU-VV8V", fetch });

(async function main () {

  const keys = (await client.stationList()).map((s) => s.abbr);
  const stations = await Promise.all(keys.map(k => client.stationInformation({orig: k})))

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
