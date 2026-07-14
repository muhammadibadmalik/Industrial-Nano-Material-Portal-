// fix-images.js
// Run ONCE:  node fix-images.js
// Fixes image filenames from "product 1.png" (space) to "product-1.png" (hyphen)
// Does NOT delete or touch any other product data.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const fixes = [
  { match: 'product 1.png', fix: 'product-1.png' },
  { match: 'product 2.png', fix: 'product-2.png' },
  { match: 'product 3.png', fix: 'product-3.png' },
  { match: 'product 4.png', fix: 'product-4.png' },
  { match: 'product 5.png', fix: 'product-5.png' },
  { match: 'product 6.png', fix: 'product-6.png' },
  { match: 'product 7.png', fix: 'product-7.png' },
  { match: 'product 8.png', fix: 'product-8.png' },
  { match: 'product 9.png', fix: 'product-9.png' },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const { match, fix } of fixes) {
      const result = await Product.updateMany(
        { image: match },
        { $set: { image: fix } }
      );
      if (result.modifiedCount > 0) {
        console.log(`✅ Fixed "${match}" → "${fix}" (${result.modifiedCount} product(s))`);
      }
    }

    console.log('🎉 Done. No products were deleted.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();