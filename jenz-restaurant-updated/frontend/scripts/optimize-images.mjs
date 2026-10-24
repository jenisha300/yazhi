// One-off build helper: compress and resize the raw photos supplied for the
// Yāzhi redesign so they're reasonable to ship on the web. Run with:
//   node scripts/optimize-images.mjs
// Safe to re-run; it overwrites in place with resized/compressed versions.
import sharp from "sharp";
import { globSync } from "glob";
import fs from "fs";

const targets = [
  { pattern: "src/assets/images/hero/*.jpg", maxWidth: 1920, quality: 78 },
  { pattern: "src/assets/images/interior/*.jpg", maxWidth: 1400, quality: 76 },
  { pattern: "src/assets/images/about/*.jpg", maxWidth: 1400, quality: 76 },
  { pattern: "src/assets/images/food/*.jpg", maxWidth: 1000, quality: 76 },
  { pattern: "src/assets/images/moments/**/*.jpg", maxWidth: 1000, quality: 74 },
];

let totalBefore = 0;
let totalAfter = 0;

for (const { pattern, maxWidth, quality } of targets) {
  const files = globSync(pattern);
  for (const file of files) {
    const before = fs.statSync(file).size;
    const buffer = await sharp(file)
      .rotate() // respect EXIF orientation, then strip metadata
      .resize({ width: maxWidth, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(file, buffer);
    const after = buffer.length;
    totalBefore += before;
    totalAfter += after;
    console.log(
      `${file}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
    );
  }
}

console.log(
  `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`
);
