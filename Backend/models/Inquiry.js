const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    // ── Matches the contact.html form fields exactly ──────────────────────
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, lowercase: true, trim: true },
    phone:     { type: String, trim: true, default: '' },
    company:   { type: String, trim: true, default: '' },

    // <select id="subject"> options in contact.html
    subject: {
      type: String,
      required: true,
      enum: ['quote', 'product', 'technical', 'sample', 'partnership', 'other'],
    },

    // <select id="product"> options in contact.html
    productOfInterest: {
      type: String,
      enum: ['desiccant', 'industrial', 'deicing', 'laboratory', 'custom', ''],
      default: '',
    },

    message: { type: String, required: true },

    // For internal tracking (not shown to user)
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
  },
  { timestamps: true }  // adds createdAt + updatedAt automatically
);

module.exports = mongoose.model('Inquiry', inquirySchema);
