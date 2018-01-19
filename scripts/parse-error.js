const pify = require("pify");
const parseString = pify(require("xml2js").parseString);
const jsify = require("../src/jsify-xml-obj");

const errorXML = "<?xml version=\"1.0\" encoding=\"utf-8\"?><root><message><error><text>Invalid route</text><details>The route parameter is invalid. Valid routes are 1-8, 11-12 and 19-20.</details></error></message></root>";

(async function main () {

  let result = await parseString(errorXML);
  result = jsify(result.root);
  console.log("_____ DATA", result)

  console.log(result.message[0].error)
}())
