#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const V1_DIR = path.join(DIST_DIR, 'v1');

function minifyCss(css) {
  const licenseMatch = css.match(/^\/\*![\s\S]*?\*\/|^\/\*\*[\s\S]*?Version:[\s\S]*?\*\//);
  const header = licenseMatch ? licenseMatch[0].trim() + '\n' : '';
  let content = css.replace(/\/\*[\s\S]*?\*\//g, '');
  content = content.replace(/\s+/g, ' ');
  content = content.replace(/\s*([\{\}\:\;\,\>])\s*/g, '$1');
  content = content.replace(/;\}/g, '}');
  return (header + content).trim();
}

function minifyJs(js) {
  let content = js.replace(/\/\*[\s\S]*?\*\//g, '');
  const lines = content.split('\n').filter(line => !line.trim().startsWith('//'));
  content = lines.join('\n').replace(/\n\s*\n/g, '\n');
  return content.trim();
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function compressAndWrite(name, buffer) {
  const filePath = path.join(DIST_DIR, name);
  fs.writeFileSync(filePath, buffer);

  const gz = zlib.gzipSync(buffer, { level: 9 });
  fs.writeFileSync(path.join(DIST_DIR, `${name}.gz`), gz);

  const br = zlib.brotliCompressSync(buffer, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      [zlib.constants.BROTLI_PARAM_LGWIN]: 22,
    }
  });
  fs.writeFileSync(path.join(DIST_DIR, `${name}.br`), br);

  const gzRatio = ((1 - gz.length / buffer.length) * 100).toFixed(1);
  const brRatio = ((1 - br.length / buffer.length) * 100).toFixed(1);
  console.log(`  ✓ ${name.padEnd(20)} ${buffer.length.toLocaleString().padStart(7)} B`);
  console.log(`    ↳ ${(name + '.gz').padEnd(18)} ${gz.length.toLocaleString().padStart(7)} B (-${gzRatio}%)`);
  console.log(`    ↳ ${(name + '.br').padEnd(18)} ${br.length.toLocaleString().padStart(7)} B (-${brRatio}%)`);
}

function main() {
  console.log('='.repeat(60));
  console.log('OAOA Style Framework - Build & Dist Generator (Node.js)');
  console.log('='.repeat(60));

  ensureDir(DIST_DIR);
  ensureDir(V1_DIR);

  const cssRaw = fs.readFileSync(path.join(ROOT_DIR, 'framework.css'), 'utf8');
  const jsRaw = fs.readFileSync(path.join(ROOT_DIR, 'framework.js'), 'utf8');
  const htmlRaw = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

  const cssMin = minifyCss(cssRaw);
  const jsMin = minifyJs(jsRaw);

  const artifacts = {
    'framework.css': Buffer.from(cssRaw, 'utf8'),
    'framework.min.css': Buffer.from(cssMin, 'utf8'),
    'framework.js': Buffer.from(jsRaw, 'utf8'),
    'framework.min.js': Buffer.from(jsMin, 'utf8'),
    'index.html': Buffer.from(htmlRaw, 'utf8'),
  };

  console.log('\n[Writing Distribution Files]');
  for (const [name, buf] of Object.entries(artifacts)) {
    compressAndWrite(name, buf);
  }

  console.log('\n[Creating v1/ Pinned Version Distribution]');
  const items = ['framework.css', 'framework.min.css', 'framework.js', 'framework.min.js'];
  for (const item of items) {
    for (const suffix of ['', '.gz', '.br']) {
      const filename = `${item}${suffix}`;
      const src = path.join(DIST_DIR, filename);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(V1_DIR, filename));
      }
    }
  }
  console.log(`  ✓ v1 assets mirrored in ${V1_DIR}`);

  const headersSrc = path.join(ROOT_DIR, '_headers');
  if (fs.existsSync(headersSrc)) {
    fs.copyFileSync(headersSrc, path.join(DIST_DIR, '_headers'));
    console.log(`  ✓ Cloudflare _headers copied to dist/_headers`);
  }

  const srcDir = path.join(ROOT_DIR, 'src');
  if (fs.existsSync(srcDir)) {
    fs.writeFileSync(path.join(srcDir, 'framework.css'), cssRaw);
    fs.writeFileSync(path.join(srcDir, 'framework.js'), jsRaw);
    console.log(`  ✓ Source assets mirrored to ${srcDir}`);
  }

  console.log(`\nBuild complete. All dist files ready in:\n  ${DIST_DIR}\n`);
}

main();
