// Minimal build script — copies runtime files into dist/.
// Produces a versioned artefact when zipped by the release workflow.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

copyDir(path.join(root, 'src'), path.join(dist, 'src'));

for (const f of ['package.json', 'package-lock.json', 'README.md']) {
  const s = path.join(root, f);
  if (fs.existsSync(s)) fs.copyFileSync(s, path.join(dist, f));
}

// Stamp the artefact with the build version & commit
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const meta = {
  name: pkg.name,
  version: pkg.version,
  builtAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA || 'local'
};
fs.writeFileSync(path.join(dist, 'build-info.json'), JSON.stringify(meta, null, 2));

// eslint-disable-next-line no-console
console.log('Built artefact at', dist, meta);
