# bart

A small Node wrapper around the [BART XML API](http://api.bart.gov/docs/overview/index.aspx).

## Installation & Usage

```js
var Bart = require("bay-area-rapid-trasit") // "bart" was taken
var client = new Bart(/* api key */) // new optional
```

Alternately, you can call methods directly on the `Bart` object if you provide the API key as `key` in params. Each method takes an object of params as the first argument and an optional callback as the second. If no callback is provided, a promise is returned.

Supports the following methods, which map directly to the BART API endpoints:

- `advisories`
- `trainCount`
- `elevatorInformation`
- `realTimeEstimates`
- `routes`
- `routesInformation`
- `quickPlannerArrive`
- `quickPlannerDepart`
- `fare`
- `holidays`
- `loadFactor`
- `routeSchedule`
- `availableSchedules`
- `specialSchedules`
- `stationSchedule`
- `stationList`
- `stationInformation`
- `stationAccessInformation`

`test/index.js` has integration tests for each method and schemas against which the responses are validated. More documentation may eventually be added to this readme but the test file should suffice for most uses.

