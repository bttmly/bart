# bart

A small Node wrapper around the [BART XML API](http://api.bart.gov/docs/overview/index.aspx).

## Why isn't this on `npm`?

Because the shape of responses is going to change. Specifically, nested responses are going to be flattened for a more ergonomic API. This will be resolved soon and published to `npm` at that point.

## API
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

