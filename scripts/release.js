/**
 * NurseBill release script
 *
 * Workflow:
 *   1. Load credentials from .env.local
 *   2. Build + sign the app (electron-builder --dir, no DMG yet)
 *   3. Notarize using Apple's recommended ditto + xcrun notarytool workflow
 *   4. Staple the notarization ticket to each signed .app
 *   5. Package into DMG (electron-builder --mac --prepackaged)
 *   6. Upload DMGs to GitHub Releases
 */

const path    = require('path');
const { execSync, spawnSync } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const ROOT = path.join(__dirname, '..');

function run(cmd, opts = {}) {
  console.log(`\n→ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...opts });
}

function runCapture(cmd) {
  const r = spawnSync(cmd, { shell: true, cwd: ROOT, encoding: 'utf8' });
  return (r.stdout || '') + (r.stderr || '');
}

// ── 1. Verify credentials ────────────────────────────────────────────────────
const required = ['APPLE_ID', 'APPLE_TEAM_ID', 'APPLE_APP_SPECIFIC_PASSWORD', 'GH_TOKEN'];
const missing  = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`\n❌  Missing required env vars in .env.local:\n   ${missing.join(', ')}\n`);
  process.exit(1);
}
console.log('✓  Credentials loaded from .env.local');

// ── 2. Vite build ────────────────────────────────────────────────────────────
run('npx vite build');

// ── 3. Sign the app (--dir = sign only, no DMG packaging yet) ────────────────
process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'true';
run('npx electron-builder --mac --dir --arm64');
run('npx electron-builder --mac --dir --x64');

// ── 4. Notarize each arch ────────────────────────────────────────────────────
const appPaths = [
  path.join(ROOT, 'dist/mac-arm64/NurseBill.app'),
  path.join(ROOT, 'dist/mac/NurseBill.app'),
];

for (const appPath of appPaths) {
  const zipPath = appPath.replace('.app', '-notarize.zip');
  const arch    = appPath.includes('arm64') ? 'arm64' : 'x64';

  console.log(`\n── Notarizing ${arch} build ─────────────────────────────────`);

  // Create ZIP using ditto (Apple's recommended tool)
  run(`/usr/bin/ditto -c -k --keepParent "${appPath}" "${zipPath}"`);

  // Submit and wait — no timeout, let Apple take as long as needed
  console.log('   Submitting to Apple notary service (this may take 5–15 min)…');
  run(
    `xcrun notarytool submit "${zipPath}" \
      --keychain-profile "nursebill" \
      --wait`,
  );

  // Staple the ticket to the .app
  run(`xcrun stapler staple "${appPath}"`);

  // Verify staple worked
  const check = runCapture(`xcrun stapler validate "${appPath}"`);
  if (check.includes('The validate action worked')) {
    console.log(`   ✓ Stapled and validated: ${arch}`);
  } else {
    console.error(`   ⚠️  Staple validation output: ${check}`);
  }

  // Clean up zip
  require('fs').unlinkSync(zipPath);
}

// ── 5. Package stapled apps into DMGs ────────────────────────────────────────
console.log('\n── Packaging into DMGs ──────────────────────────────────────────');
run('npx electron-builder --mac --prepackaged dist/mac-arm64/NurseBill.app --publish never');
run('npx electron-builder --mac --prepackaged dist/mac/NurseBill.app --publish never');

// ── 6. Upload to GitHub Releases ─────────────────────────────────────────────
console.log('\n── Uploading to GitHub Releases ─────────────────────────────────');
const pkg     = require('../package.json');
const version = pkg.version;
const tag     = `v${version}`;

// Create GitHub release and upload DMGs
run(
  `gh release create "${tag}" \
    "dist/NurseBill-${version}-arm64.dmg" \
    "dist/NurseBill-${version}-arm64.dmg.blockmap" \
    "dist/NurseBill-${version}.dmg" \
    "dist/NurseBill-${version}.dmg.blockmap" \
    "dist/latest-mac.yml" \
    --title "NurseBill ${tag}" \
    --notes "NurseBill ${tag}" \
    --repo Ranguana/nursebill`,
  { env: { ...process.env, GH_TOKEN: process.env.GH_TOKEN } },
);

console.log(`\n✅  NurseBill ${tag} released successfully!`);
