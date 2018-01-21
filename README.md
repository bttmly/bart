# bart

A small JavaScript wrapper around the [BART XML API](http://api.bart.gov/docs/overview/index.aspx). Works in web browsers and Node.js.

## Installation & Usage

The name `bart` was taken, so...

`npm install --save bay-area-rapid-transit`

#### Basic usage
```js
const Bart = require("bay-area-rapid-transit")
const client = new Bart("MY_API_KEY")
```

#### Configuring `fetch`
When using this module in Node.js, you must either provide a global `fetch` that is compatible with the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), or pass a fetch function to the client at initialization time.

```js
const { fetch } = require("fetch-ponyfill")() // https://github.com/qubyte/fetch-ponyfill
const Bart = require("bay-area-rapid-transit")
const client = new Bart({ key: "MY_API_KEY", fetch })
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
