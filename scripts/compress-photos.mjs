import sharp from 'sharp';
import { readdir, stat, mkdir, rm, rename } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = 'public/assets/images/photos';
const OUT = 'public/assets/images/photos_compressed';
const MAX_WIDTH = 900;
const QUALITY = 78;

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /^photo-\d+\.webp$/.test(f));

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const srcPath = join(SRC, file);
  const outPath = join(OUT, file);
  const before = (await stat(srcPath)).size;
  await sharp(srcPath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(outPath);
  const after = (await stat(outPath)).size;
  totalBefore += before;
  totalAfter += after;
  const pct = ((1 - after / before) * 100).toFixed(0);
  console.log(`${file}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (-${pct}%)`);
}

console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB`);
console.log(`\nCompressed files in: ${OUT}`);
console.log('Next: swap the directories.');
