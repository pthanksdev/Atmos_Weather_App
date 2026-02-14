#!/usr/bin/env node

const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const projectRoot = process.cwd();
const tmpDir = os.tmpdir();

const cacheTargets = [
  path.join(projectRoot, '.expo'),
  path.join(projectRoot, 'node_modules', '.cache', 'metro'),
  path.join(tmpDir, 'metro-cache'),
];

async function removeDir(target) {
  try {
    await fs.rm(target, { recursive: true, force: true });
    console.log(`Removed: ${target}`);
  } catch (error) {
    console.warn(`Skipped: ${target} (${error.message})`);
  }
}

async function removeTmpHasteMaps() {
  try {
    const entries = await fs.readdir(tmpDir, { withFileTypes: true });
    const hasteEntries = entries.filter((entry) => entry.name.startsWith('haste-map-'));

    await Promise.all(
      hasteEntries.map((entry) => removeDir(path.join(tmpDir, entry.name)))
    );
  } catch (error) {
    console.warn(`Could not scan temp directory: ${error.message}`);
  }
}

async function main() {
  console.log('Clearing Expo/Metro caches...');
  await Promise.all(cacheTargets.map(removeDir));
  await removeTmpHasteMaps();
  console.log('Done. Start with: npm run start:clear');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});