// Run this ONCE to populate MongoDB with your 9 products:
//   node seed.js
//
// To wipe and re-seed:
//   node seed.js --fresh

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  // ── 1. DESICCANT ─────────────────────────────────────────────────────────
  {
    name: 'CaCl₂ Industrial Desiccant Granules',
    category: 'desiccant',
    description: 'High-performance calcium chloride desiccant granules for moisture control in shipping containers, warehouses, and industrial storage.',
    fullDescription: 'Our CaCl₂ Industrial Desiccant Granules are engineered for superior moisture absorption in demanding environments. With a purity of 99.5% and optimized particle size, these granules provide reliable humidity control for shipping containers, warehouses, and industrial storage facilities. The anhydrous formula ensures maximum absorption capacity, protecting valuable goods from moisture damage.',
    benefits: [
      'Absorbs up to 150% of its own weight in moisture',
      'Effective in temperatures from -20°C to +50°C',
      'Non-toxic and environmentally safe',
      'Available in 25kg and 1000kg packaging',
    ],
    specs: {
      purity: '99.5% min',
      particleSize: '2-6 mm granules',
      moistureAbsorption: '150% of weight',
      form: 'Anhydrous Granules',
      packaging: '25kg bags / 1000kg super sacks',
      chemicalFormula: 'CaCl₂ (Anhydrous)',
      molecularWeight: '110.98 g/mol',
      bulkDensity: '0.85-0.95 g/cm³',
      moistureContent: '≤0.5%',
      appearance: 'White granules',
      shelfLife: '24 months (sealed)',
    },
    image: 'product 1.png',
    price: 'Contact for Pricing',
    inStock: true,
  },
  {
    name: 'CaCl₂ Container Desiccant Bags',
    category: 'desiccant',
    description: 'Ready-to-use hanging desiccant bags for shipping containers. Prevents container rain and moisture damage during long sea voyages.',
    fullDescription: 'Specially designed for maritime shipping, our CaCl₂ Container Desiccant Bags hang conveniently inside shipping containers to absorb condensation and prevent "container rain" — the damaging drips that ruin cargo. Each bag holds up to 1 kg of our premium CaCl₂ granules and contains absorbed moisture in a sealed gel, preventing spills.',
    benefits: [
      'Prevents container rain and cargo damage',
      'Easy hanging installation — no tools required',
      'Gel-lock technology prevents liquid leakage',
      'Compliant with international shipping standards',
    ],
    specs: {
      purity: '94% min',
      particleSize: 'Granule fill',
      moistureAbsorption: '120% of weight',
      form: 'Pre-packed hanging bags',
      packaging: '1kg bags, 10 bags/carton',
      chemicalFormula: 'CaCl₂',
      molecularWeight: '110.98 g/mol',
      bulkDensity: '0.80 g/cm³',
      moistureContent: '≤1.0%',
      appearance: 'White granules in breathable bag',
      shelfLife: '36 months (sealed)',
    },
    image: 'product 2.png',
    price: 'Contact for Pricing',
    inStock: true,
  },
  {
    name: 'CaCl₂ Anhydrous Powder (Desiccant Grade)',
    category: 'desiccant',
    description: 'Ultra-fine anhydrous calcium chloride powder for industrial drying applications, gas drying, and high-performance desiccant systems.',
    fullDescription: 'Our Desiccant Grade CaCl₂ Anhydrous Powder is processed to achieve ultra-fine particle sizes for applications requiring rapid moisture uptake. Ideal for gas drying systems, chemical desiccant towers, and specialty industrial drying where granule size is critical to performance.',
    benefits: [
      'Ultra-fine particle size for maximum surface area',
      'Rapid moisture absorption kinetics',
      'Suitable for gas drying and desiccant towers',
      'High purity minimises contamination risk',
    ],
    specs: {
      purity: '99.9% min',
      particleSize: '50-100 mesh powder',
      moistureAbsorption: '160% of weight',
      form: 'Anhydrous Powder',
      packaging: '25kg multi-wall paper bags',
      chemicalFormula: 'CaCl₂ (Anhydrous)',
      molecularWeight: '110.98 g/mol',
      bulkDensity: '0.70-0.80 g/cm³',
      moistureContent: '≤0.2%',
      appearance: 'White fine powder',
      shelfLife: '18 months (sealed)',
    },
    image: 'product 3.png',
    price: 'Contact for Pricing',
    inStock: true,
  },

  // ── 2. INDUSTRIAL ─────────────────────────────────────────────────────────
  {
    name: 'CaCl₂ Industrial Grade Flakes 74%',
    category: 'industrial',
    description: 'Calcium chloride flakes at 74% concentration for dust suppression, soil stabilization, and oil & gas applications.',
    fullDescription: 'Our 74% CaCl₂ Industrial Flakes are the industry-standard product for road dust control and soil stabilization. Highly hygroscopic, they draw moisture from the air to maintain road surfaces in a slightly damp condition that prevents dust. Also widely used in oil and gas drilling fluids, concrete acceleration, and refrigeration brine systems.',
    benefits: [
      'Effective dust suppression for unpaved roads',
      'Accelerates concrete setting in cold weather',
      'Used in oil & gas completion fluids',
      'Cost-effective and readily available',
    ],
    specs: {
      purity: '74% min CaCl₂',
      particleSize: '4-8 mm flakes',
      moistureAbsorption: '100% of weight',
      form: 'Flakes',
      packaging: '25kg bags / 1000kg IBC',
      chemicalFormula: 'CaCl₂·2H₂O (Dihydrate)',
      molecularWeight: '147.01 g/mol',
      bulkDensity: '0.75 g/cm³',
      moistureContent: '≤1.0%',
      appearance: 'White flakes',
      shelfLife: '24 months',
    },
    image: 'product 4.png',
    price: 'Contact for Pricing',
    inStock: true,
  },
  {
    name: 'CaCl₂ Liquid Solution 30-38%',
    category: 'industrial',
    description: 'Ready-to-use calcium chloride liquid solution for immediate application in dust control, concrete acceleration, and industrial processes.',
    fullDescription: 'Our CaCl₂ Liquid Solution is supplied at 30-38% concentration, ready for direct application without mixing or dissolution. The liquid form ensures uniform coverage in dust suppression applications and precise dosing in concrete and industrial processes. Supplied in bulk tankers or IBC totes.',
    benefits: [
      'Ready-to-use — no dissolution required',
      'Uniform coverage in spray applications',
      'Precise concentration control',
      'Delivered in bulk tankers or 1000L IBCs',
    ],
    specs: {
      purity: '30-38% CaCl₂ solution',
      particleSize: 'N/A (liquid)',
      moistureAbsorption: 'N/A',
      form: 'Aqueous Solution',
      packaging: '1000L IBC / Bulk tanker',
      chemicalFormula: 'CaCl₂ (aq)',
      molecularWeight: '110.98 g/mol',
      bulkDensity: '1.29-1.40 g/cm³ (solution density)',
      moistureContent: 'N/A',
      appearance: 'Clear colourless liquid',
      shelfLife: '12 months',
    },
    image: 'product 5.png',
    price: 'Contact for Pricing',
    inStock: true,
  },
  {
    name: 'CaCl₂ Industrial Pellets 94-97%',
    category: 'industrial',
    description: 'High-concentration calcium chloride pellets for demanding industrial applications including refrigeration, paper manufacturing, and chemical processing.',
    fullDescription: 'At 94-97% purity, our Industrial CaCl₂ Pellets deliver maximum performance in refrigeration brine systems, paper and pulp processing, and chemical manufacturing. The pellet form offers easier handling and slower dissolution rates compared to powder, making them ideal for controlled-release industrial applications.',
    benefits: [
      'High concentration — 94-97% CaCl₂',
      'Controlled dissolution rate',
      'Lower dust generation than powder',
      'Versatile for refrigeration and chemical use',
    ],
    specs: {
      purity: '94-97% min',
      particleSize: '4-6 mm pellets',
      moistureAbsorption: '145% of weight',
      form: 'Anhydrous Pellets',
      packaging: '25kg bags / 1000kg super sacks',
      chemicalFormula: 'CaCl₂ (Anhydrous)',
      molecularWeight: '110.98 g/mol',
      bulkDensity: '0.90-1.00 g/cm³',
      moistureContent: '≤0.5%',
      appearance: 'White pellets',
      shelfLife: '24 months (sealed)',
    },
    image: 'product 6.png',
    price: 'Contact for Pricing',
    inStock: true,
  },

  // ── 3. DE-ICING ───────────────────────────────────────────────────────────
  {
    name: 'CaCl₂ Road De-Icing Granules',
    category: 'deicing',
    description: 'Fast-acting calcium chloride granules for road de-icing and anti-icing. Effective at temperatures as low as -32°C.',
    fullDescription: 'Our Road De-Icing CaCl₂ Granules are formulated for rapid ice melting even in extreme cold. Unlike sodium chloride (rock salt), calcium chloride generates heat upon dissolution, actively melting ice rather than just lowering the freezing point. Effective at temperatures as low as -32°C, making it the preferred choice for severe winter conditions.',
    benefits: [
      'Effective down to -32°C (-25.6°F)',
      'Exothermic reaction — generates heat to melt ice',
      'Works faster than sodium chloride or sand',
      'Reduces required application quantity vs rock salt',
    ],
    specs: {
      purity: '94% min',
      particleSize: '2-6 mm granules',
      moistureAbsorption: 'N/A (de-icing use)',
      form: 'Granules',
      packaging: '10kg, 25kg bags / bulk totes',
      chemicalFormula: 'CaCl₂',
      molecularWeight: '110.98 g/mol',
      bulkDensity: '0.85 g/cm³',
      moistureContent: '≤1.0%',
      appearance: 'White to off-white granules',
      shelfLife: '24 months',
    },
    image: 'product 7.png',
    price: 'Contact for Pricing',
    inStock: true,
  },
  {
    name: 'CaCl₂ Anti-Icing Liquid Brine',
    category: 'deicing',
    description: 'Pre-wetting brine solution for anti-icing road treatment before snowfall. Reduces ice bonding and lowers salt usage by up to 30%.',
    fullDescription: 'Applied before a winter storm, our CaCl₂ Anti-Icing Brine prevents ice from bonding to the road surface, making subsequent plowing far more effective. Pre-wetting with liquid brine before snowfall reduces overall salt usage by up to 30%, saving cost while improving outcomes. Supplied in bulk tankers for municipal and highway departments.',
    benefits: [
      'Preventive treatment before snowfall',
      'Reduces ice-road bonding significantly',
      'Cuts overall de-icing salt usage by up to 30%',
      'Ideal for municipal highway departments',
    ],
    specs: {
      purity: '32% CaCl₂ brine solution',
      particleSize: 'N/A (liquid)',
      moistureAbsorption: 'N/A',
      form: 'Aqueous Brine Solution',
      packaging: 'Bulk tanker delivery',
      chemicalFormula: 'CaCl₂ (aq)',
      molecularWeight: '110.98 g/mol',
      bulkDensity: '1.31 g/cm³ (solution density)',
      moistureContent: 'N/A',
      appearance: 'Clear colourless liquid',
      shelfLife: '12 months',
    },
    image: 'product 8.png',
    price: 'Contact for Pricing',
    inStock: true,
  },

  // ── 4. LABORATORY ─────────────────────────────────────────────────────────
  {
    name: 'CaCl₂ Laboratory Reagent Grade (ACS)',
    category: 'laboratory',
    description: 'ACS-grade anhydrous calcium chloride for laboratory use. Meets American Chemical Society purity specifications for research and analytical applications.',
    fullDescription: 'Our ACS Reagent Grade CaCl₂ Anhydrous meets or exceeds American Chemical Society specifications, making it suitable for precise laboratory, research, and analytical applications. Supplied with a Certificate of Analysis (CoA) confirming purity, heavy metals, and other critical parameters. Ideal for buffer preparation, cell biology media, desiccation, and chemical synthesis.',
    benefits: [
      'Meets ACS reagent purity specifications',
      'Certificate of Analysis included',
      'Suitable for cell biology and buffer preparation',
      'Low heavy metal content',
    ],
    specs: {
      purity: '99.9% min (ACS grade)',
      particleSize: 'Granular / powder options',
      moistureAbsorption: '160% of weight',
      form: 'Anhydrous granules or powder',
      packaging: '500g, 1kg, 5kg lab bottles',
      chemicalFormula: 'CaCl₂ (Anhydrous)',
      molecularWeight: '110.98 g/mol',
      bulkDensity: '0.80 g/cm³',
      moistureContent: '≤0.2%',
      appearance: 'White granules or powder',
      shelfLife: '36 months (sealed)',
    },
    image: 'product 9.png',
    price: 'Contact for Pricing',
    inStock: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const fresh = process.argv.includes('--fresh');

    if (fresh) {
      await Product.deleteMany({});
      console.log('🗑️  Existing products cleared');
    }

    const inserted = await Product.insertMany(products);
    console.log(`✅ ${inserted.length} products seeded successfully`);

    // Print IDs so you can test /api/products/:id
    inserted.forEach((p, i) => {
      console.log(`   ${i + 1}. [${p.category}] ${p.name}  →  ID: ${p._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
