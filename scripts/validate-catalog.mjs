import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const brandFiles = [
  'src/data/brands/asics.json',
  'src/data/brands/nike.json',
  'src/data/brands/adidas.json',
];

const validCategories = new Set(['daily', 'super-trainer', 'racing']);
const validSubcategories = new Set([
  'entry',
  'max-cushion',
  'stability',
  'all-rounder',
  'lightweight',
  'no-plate',
  'light-plate',
  'carbon-plate',
  'half',
  'full',
]);

const hardErrors = [];
const softWarnings = [];
const seenIds = new Map();
const seenSlugs = new Map();

function readJson(relativePath) {
  const filePath = path.join(root, relativePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

for (const file of brandFiles) {
  const data = readJson(file);
  const brandId = data.brand?.id;
  const fileBrand = path.basename(file, '.json');

  if (brandId !== fileBrand) {
    hardErrors.push(`[brand-id] ${file}: brand.id=${brandId}, expected=${fileBrand}`);
  }

  const logoPath = data.brand?.logo ? path.join(root, 'public', data.brand.logo.replace(/^\//, '')) : null;
  if (!logoPath || !fs.existsSync(logoPath)) {
    softWarnings.push(`[logo-missing] ${brandId}: ${data.brand?.logo || '(none)'}`);
  }

  for (const shoe of data.shoes || []) {
    if (shoe.brandId !== brandId) {
      hardErrors.push(`[brand-mismatch] ${shoe.id}: shoe.brandId=${shoe.brandId}, expected=${brandId}`);
    }

    if (!validCategories.has(shoe.categoryId)) {
      hardErrors.push(`[category-invalid] ${shoe.id}: ${shoe.categoryId}`);
    }

    if (!validSubcategories.has(shoe.subcategoryId)) {
      hardErrors.push(`[subcategory-invalid] ${shoe.id}: ${shoe.subcategoryId}`);
    }

    if (seenIds.has(shoe.id)) {
      hardErrors.push(`[id-duplicate] ${shoe.id}: ${seenIds.get(shoe.id)} and ${brandId}`);
    } else {
      seenIds.set(shoe.id, brandId);
    }

    if (seenSlugs.has(shoe.slug)) {
      hardErrors.push(`[slug-duplicate] ${shoe.slug}: ${seenSlugs.get(shoe.slug)} and ${brandId}`);
    } else {
      seenSlugs.set(shoe.slug, brandId);
    }

    const imagePath = shoe.imageUrl
      ? path.join(root, 'public', shoe.imageUrl.replace(/^\//, ''))
      : null;
    if (!imagePath || !fs.existsSync(imagePath)) {
      softWarnings.push(`[image-missing] ${shoe.id}: ${shoe.imageUrl || '(none)'}`);
    }
  }
}

console.log(`Catalog validation finished: ${seenIds.size} shoes checked`);
if (softWarnings.length) {
  console.log(`Warnings (${softWarnings.length}):`);
  for (const warning of softWarnings) console.log(`  - ${warning}`);
}

if (hardErrors.length) {
  console.error(`Errors (${hardErrors.length}):`);
  for (const error of hardErrors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('No hard data errors found.');
