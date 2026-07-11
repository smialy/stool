#!/usr/bin/env node
// Publish workspace packages whose local version differs from the registry.
//
//   node scripts/publish-if-changed.mjs           # publish what changed
//   node scripts/publish-if-changed.mjs --dry-run # only report, no publish
//
// For each package in packages/*:
//   1. read name + version from its package.json
//   2. query the registry for the latest published version of that name
//   3. if the local version !== registry version (or not yet published),
//      run `npm publish --access public --tag <dist-tag>`
//
// Exits non-zero if any publish fails.

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const PACKAGES_DIR = join(ROOT, "packages");
const DRY_RUN = process.argv.includes("--dry-run");

// Determine publish tag from package version: prereleases -> beta/rc/etc,
// otherwise "latest".
function distTag(version) {
  const match = version.match(/-([a-zA-Z]+)/);
  return match ? match[1] : "latest";
}

function npmConfig(key) {
  const res = spawnSync("npm", ["config", "get", key], { encoding: "utf8" });
  if (res.status !== 0) return null;
  return res.stdout.trim() || null;
}

function npmViewVersion(name) {
  // `npm view <name> version` prints the "latest" dist-tag version, or fails
  // when the package was never published.
  const res = spawnSync("npm", ["view", name, "version"], {
    encoding: "utf8",
  });
  if (res.status !== 0) {
    const stderr = res.stderr || "";
    if (/E404|not found|no matches/i.test(stderr)) return null; // never published
    throw new Error(`npm view failed for ${name}:\n${stderr}`);
  }
  return res.stdout.trim() || null;
}

function npmPublish(pkgDir, tag) {
  const args = ["publish", "--access", "public", "--tag", tag];
  if (DRY_RUN) args.push("--dry-run");
  const res = spawnSync("npm", args, {
    cwd: pkgDir,
    stdio: "inherit",
    encoding: "utf8",
  });
  return res.status === 0;
}

if (!existsSync(PACKAGES_DIR)) {
  console.error(`No packages/ directory found at ${PACKAGES_DIR}`);
  process.exit(1);
}

const registry = npmConfig("registry");
console.log(`Registry: ${registry}${DRY_RUN ? " (dry-run)" : ""}\n`);

const dirs = readdirSync(PACKAGES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => join(PACKAGES_DIR, d.name));

let published = 0;
let skipped = 0;
let failed = 0;

for (const dir of dirs) {
  const pkgPath = join(dir, "package.json");
  if (!existsSync(pkgPath)) continue;

  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  } catch (err) {
    console.error(`✗ ${dir}: invalid package.json (${err.message})`);
    failed++;
    continue;
  }

  const { name, version } = pkg;
  if (!name || !version) {
    console.warn(`→ ${dir}: missing name/version, skipping`);
    skipped++;
    continue;
  }

  let registryVersion;
  try {
    registryVersion = npmViewVersion(name);
  } catch (err) {
    console.error(err.message);
    failed++;
    continue;
  }

  if (registryVersion === version) {
    console.log(`= ${name}@${version} already published, skipping`);
    skipped++;
    continue;
  }

  const tag = distTag(version);
  if (registryVersion === null) {
    console.log(`+ ${name}@${version} (new package) → publish --tag ${tag}`);
  } else {
    console.log(
      `↑ ${name}@${version} (registry: ${registryVersion}) → publish --tag ${tag}`,
    );
  }

  if (DRY_RUN) {
    console.log(`  (dry-run) would run \`npm publish\` in ${dir}`);
    published++;
    continue;
  }

  const ok = npmPublish(dir, tag);
  if (ok) {
    published++;
  } else {
    console.error(`✗ ${name}: publish failed`);
    failed++;
  }
}

console.log(
  `\nDone. published=${published} skipped=${skipped} failed=${failed}` +
    (DRY_RUN ? " (dry-run)" : ""),
);

process.exit(failed > 0 ? 1 : 0);