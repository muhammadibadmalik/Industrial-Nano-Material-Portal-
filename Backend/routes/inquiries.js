const express  = require('express');
const router   = express.Router();
const protect  = require('../middleware/auth');
const { submitInquiry, getInquiries } = require('../controllers/inquiryController');

// Public — contact form submission
router.post('/', submitInquiry);

// Admin only — view all inquiries
router.get('/', protect, getInquiries);

module.exports = router;
