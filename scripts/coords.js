const path = require("path");
const fs = require("fs");

const Bart = require("../");
const client = new Bart("MW9S-E7SL-26DU-VV8V");
const keys = Object.keys(Bart.stations);

Promise.all(keys.map(k => client.stationInformation({orig: k})))
  .then(stations =>
    stations.map(s => ({
      lat: s.gtfs_latitude,
      lon: s.gtfs_longitude,
      name: s.abbr.toLowerCase(),
    }))
  )
  .then(stations => {
    const out = {};
    stations.forEach(s => out[s.name] = {lon: s.lon, lat: s.lat});
    return out;
  })
  .then(stations => {
    fs.writeFileSync(path.join(__dirname, "../data/coords.json"), JSON.stringify(stations, null, 2));
  })
  .catch(err => {
    console.log("ERROR", err);
    process.exit(1);
  });
