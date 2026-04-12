import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const svgPath = resolve(root, 'app/icon.svg');
const svg = await readFile(svgPath);

async function renderPng(size, outPath) {
  const buf = await sharp(svg, { density: 512 })
    .resize(size, size)
    .png()
    .toBuffer();
  await writeFile(outPath, buf);
  console.log(`wrote ${outPath} (${buf.length} bytes)`);
  return buf;
}

function buildIco(pngBuffers) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngBuffers.length, 4);

  const dirEntries = [];
  const images = [];
  let offset = 6 + 16 * pngBuffers.length;

  for (const { size, buf } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    images.push(buf);
    offset += buf.length;
  }

  return Buffer.concat([header, ...dirEntries, ...images]);
}

// Main PNG icons (Next.js conventions)
await renderPng(512, resolve(root, 'app/icon.png'));
await renderPng(180, resolve(root, 'app/apple-icon.png'));

// Multi-size favicon.ico (16, 32, 48)
const ico16 = await sharp(svg, { density: 512 }).resize(16, 16).png().toBuffer();
const ico32 = await sharp(svg, { density: 512 }).resize(32, 32).png().toBuffer();
const ico48 = await sharp(svg, { density: 512 }).resize(48, 48).png().toBuffer();
const ico = buildIco([
  { size: 16, buf: ico16 },
  { size: 32, buf: ico32 },
  { size: 48, buf: ico48 },
]);
await writeFile(resolve(root, 'app/favicon.ico'), ico);
console.log(`wrote app/favicon.ico (${ico.length} bytes)`);
