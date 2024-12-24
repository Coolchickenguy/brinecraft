const utils = require("./utils.js");
const fs = require("fs");
const path = require("path");
const requireData = function requireData(...path) {
  return utils.requireJson("minecraft-data", "data", ...path);
};
function init() {
  const dataPaths = requireData("dataPaths.json");
  // java
  module.exports.pc = function getVersion(version) {
    const versionManifest = dataPaths.pc[version];
    if (typeof versionManifest === "undefined") {
      throw new Error("Unknown minecraft java version " + version);
    }
    const attributes = Object.keys(versionManifest);
    const output = {};
    for (const attribute of attributes) {
      const location = versionManifest[attribute];
      const fileName = fs
        .readdirSync(path.join(__dirname, "minecraft-data", "data", location))
        .filter((file) => path.basename(file).split(".")[0] === attribute)[0];
      output[attribute] = requireData(location, fileName);
    }
    return output;
  };
  module.exports.pc.versions = Object.keys(dataPaths.pc);
  // bedrock
  module.exports.bedrock = function getVersion(version) {
    const versionManifest = dataPaths.bedrock[version];
    if (typeof versionManifest === "undefined") {
      throw new Error("Unknown minecraft java version " + version);
    }
    const attributes = Object.keys(versionManifest);
    const output = {};
    for (const attribute of attributes) {
      const location = versionManifest[attribute];
      const fileName = fs
        .readdirSync(path.join(__dirname, "minecraft-data", "data", location))
        .filter((file) => path.basename(file).split(".")[0] === attribute)[0];
      output[attribute] = requireData(location, fileName);
    }
    return output;
  };
  module.exports.bedrock.versions = Object.keys(dataPaths.bedrock);
}
init();
module.exports.update = function update(callback) {
  require("./download.js")(function onFinish() {
    module.exports.restart();
    if (callback) {
      callback();
    }
  });
};
module.exports.restart = function restart() {
  utils.cache = new Map();
  init();
};
