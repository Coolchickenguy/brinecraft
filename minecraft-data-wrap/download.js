const yauzl = require("yauzl");
const utils = require("./utils.js");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const dataUrl =
  "https://github.com/PrismarineJS/minecraft-data/archive/refs/heads/master.zip";
module.exports = function download(callback) {
  const tempZip = path.join(__dirname, "temp.zip");
  const minecraftData = path.join(__dirname, "minecraft-data");
  const tempDir = path.join(__dirname, "minecraft-data-temp");
  const lastCommit = path.join(__dirname, ".lastCommit");
  if (fs.existsSync(tempZip)) {
    fs.rmSync(tempZip);
  }
  utils.getHttps(
    {
      hostname: "api.github.com",
      path: "/repos/PrismarineJS/minecraft-data/commits/master",
      headers: {
        Accept: "application/vnd.github.VERSION.sha",
        "User-Agent": "Node"
      },
    },
    function onRes(res) {
      utils.streamToBuffer(res, function onDone(data) {
        const hash = data.toString();
        if (fs.existsSync(lastCommit) && hash === fs.readFileSync(lastCommit).toString()) {
          callback(false);
        } else {
          utils.getHttps(dataUrl, function onMessage(res) {
            utils.writeFile(res, tempZip, function onFinish() {
              // console.log("minecraft-data download finished!");
              yauzl.open(
                tempZip,
                { lazyEntries: true },
                function (err, zipfile) {
                  if (err) throw err;
                  zipfile.readEntry();
                  zipfile.on("entry", function (entry) {
                    if (/\/$/.test(entry.fileName)) {
                      // Directory file names end with '/'.
                      // Note that entries for directories themselves are optional.
                      // An entry's fileName implicitly requires its parent directories to exist.
                      zipfile.readEntry();
                    } else {
                      // file entry
                      const location = [
                        tempDir,
                        ...entry.fileName.split("/").slice(1),
                      ].join("/");
                      zipfile.openReadStream(entry, function (err, readStream) {
                        if (err) throw err;
                        readStream.on("end", function () {
                          zipfile.readEntry();
                        });
                        mkdirp.mkdirpSync(path.dirname(location));
                        readStream.pipe(fs.createWriteStream(location));
                      });
                    }
                  });
                  zipfile.once("end", function () {
                    zipfile.close();
                    if (fs.existsSync(tempZip)) {
                      fs.rmSync(tempZip);
                    }
                    if (fs.existsSync(minecraftData)) {
                      try {
                        fs.rmSync(minecraftData, { recursive: true });
                      } catch (e) {
                        fs.rmdirSync(minecraftData, { recursive: true });
                      }
                    }
                    fs.renameSync(tempDir, minecraftData);
                    fs.writeFileSync(lastCommit, hash);
                    callback(true);
                  });
                }
              );
            });
          });
        }
      });
    }
  );
};
