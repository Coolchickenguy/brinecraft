# Minecraft data wrap - Just another wrapper for [minecraft-data](https://github.com/PrismarineJS/minecraft-data)

<small>Note: some files are reused between versions, so mutating a attribute may affect more than one version</small>

# Use:

## Get information on latest minecraft java and bedrock release

```javascript
const minecraftDataWrap = require("minecraft-data-wrap");
// Java edition
const javaVersions = minecraftDataWrap.pc.versions;
const javaVersion = javaVersions[javaVersions.length - 1];
console.log(
  "Avalible minecraft java versions are " +
    javaVersions.join(",") +
    " using latest version " +
    javaVersion
);
// Get all data about minecraft java edition that minecraft-data has
console.log(minecraftDataWrap.pc(javaVersion));
// Bedrock edition
const bedrockVersions = minecraftDataWrap.bedrock.versions;
const bedrockVersion = bedrockVersions[bedrockVersions.length - 1];
console.log(
  "Avalible minecraft bedrock versions are " +
    bedrockVersions.join(",") +
    " using latest version " +
    bedrockVersion
);
// Get all data about minecraft bedrock edition that minecraft-data has
console.log(minecraftDataWrap.bedrock(bedrockVersion));
```

## Update minecraft-data (To latest version on github)

```javascript
const minecraftDataWrap = require("minecraft-data-wrap");
minecraftDataWrap.update(function onFinish(isNew) {
  if (isNew) {
    console.log("Finished updating minecraft-data");
  } else {
    console.log("minecraft-data is already latest version");
  }
});
```
