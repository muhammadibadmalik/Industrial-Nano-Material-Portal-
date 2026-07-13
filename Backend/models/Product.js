const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // matches the data-category attributes in your HTML:
    // "desiccant" | "industrial" | "deicing" | "laboratory"
    category: {
      type: String,
      required: true,
      enum: ['desiccant', 'industrial', 'deicing', 'laboratory'],
    },
    description: {
      type: String,
      required: true,
    },
    // Full description shown on product-details.html
    fullDescription: {
      type: String,
      default: '',
    },
    // Key benefits list shown in Description tab
    benefits: {
      type: [String],
      default: [],
    },
    // Specs shown on product-details.html
    specs: {
      purity:             { type: String, default: '99.5% min' },
      particleSize:       { type: String, default: '50-100 nm' },
      moistureAbsorption: { type: String, default: '150% of weight' },
      form:               { type: String, default: 'Anhydrous Granules' },
      packaging:          { type: String, default: '25kg / 1000kg bags' },
      // Technical specs table (specifications tab)
      chemicalFormula:    { type: String, default: 'CaCl₂ (Anhydrous)' },
      molecularWeight:    { type: String, default: '110.98 g/mol' },
      bulkDensity:        { type: String, default: '0.85-0.95 g/cm³' },
      moistureContent:    { type: String, default: '≤0.5%' },
      appearance:         { type: String, default: 'White granules' },
      shelfLife:          { type: String, default: '24 months (sealed)' },
    },
    // image filename e.g. "product 1.png"  (served from public/)
    image: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      default: 'Contact for Pricing',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
