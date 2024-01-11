import { readFileSync, writeFileSync } from "fs";

const targetVersion = process.env.npm_package_version;

const manifestPath = `${process.cwd()}/manifest.json`
const versionsPath = `${process.cwd()}/versions.json`

let manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
let versions = JSON.parse(readFileSync(versionsPath, "utf8"));

// check the versions of package.json and manifest.json are the same
if (process.env.GITHUB_ACTIONS === "true")
  if (manifest.version !== targetVersion) throw new Error("Run `npm run version` and commit the changes.")

// read minAppVersion from manifest.json and bump version to target version
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync(manifestPath, JSON.stringify(manifest, null, "\t"));

// update versions.json with target version and minAppVersion from manifest.json
versions[targetVersion] = minAppVersion;
writeFileSync(versionsPath, JSON.stringify(versions, null, "\t"));
