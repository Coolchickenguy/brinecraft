const https = require("https");
const fs = require("fs");
const path = require("path");
module.exports.writeFile = function writeFile(inputStream, location, callback) {
  const outputStream = fs.createWriteStream(location);
  inputStream.pipe(outputStream);
  inputStream.on("end", function onEnd() {
    outputStream.end();
    callback();
  });
};
module.exports.getHttps = function getHttps(url, callback) {
  let location = url;
  function get() {
    https.get(location, function onMessage(res) {
      if (res.headers.location && res.statusCode.toString()[0] === "3") {
        location = res.headers.location;
        get();
      } else {
        callback(res);
      }
    });
  }
  get();
};
module.exports.streamToBuffer = function streamToBuffer(input, callback) {
  const chunks = [];

  input.on("data", function (chunk) {
    chunks.push(chunk);
  });

  input.on("end", function () {
    callback(Buffer.concat(chunks));
  });
};
module.exports.cache = new Map();
module.exports.requireJson = function requireJson(...filepath) {
  const location = path.join(__dirname, ...filepath);
  const contents = fs.readFileSync(location).toString();
  if (module.exports.cache.has(location)) {
    // console.log("Hit: " + location);
    return module.exports.cache.get(location);
  } else {
    // console.log("Miss: " + location);
    if (path.extname(location) === ".json") {
      const parsed = JSON.parse(contents);
      module.exports.cache.set(location, parsed);
      return parsed;
    } else {
      module.exports.cache.set(location, contents);
      return contents;
    }
  }
};
