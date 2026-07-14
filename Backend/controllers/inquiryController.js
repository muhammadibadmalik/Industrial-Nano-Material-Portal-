const Inquiry   = require('../models/Inquiry');
const sendEmail = require('../utils/sendEmail');

// POST /api/inquiries  (public — contact form)
const submitInquiry = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, subject, product, message } = req.body;

    if (!firstName || !lastName || !email || !subject || !message)
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });

    const inquiry = await Inquiry.create({
      firstName, lastName, email,
      phone:             phone   || '',
      company:           company || '',
      subject,
      productOfInterest: product || '',
      message,
    });

    // Respond immediately — don't make the user wait on email
    res.status(201).json({
      success: true,
      message: 'Your message has been received! We will contact you shortly.',
      data: { id: inquiry._id, createdAt: inquiry.createdAt },
    });

    // Send confirmation email in the background (fire and forget)
    sendEmail({
      to: email,
      subject: 'We received your inquiry — NanoCal Industries',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <h2 style="color:#1a3c2e">Thank you, ${firstName}!</h2>
          <p>We received your inquiry and will get back to you within <strong>1-2 business days</strong>.</p>
          <div style="background:#f9f9f9;border-radius:8px;padding:20px;margin:24px 0">
            <p><strong>Subject:</strong> ${subject}</p>
            ${product ? `<p><strong>Product:</strong> ${product}</p>` : ''}
            <p><strong>Message:</strong> ${message}</p>
          </div>
          <p style="color:#888;font-size:13px">— NanoCal Industries Team</p>
        </div>`,
    }).catch(e => console.error('Email error (non-blocking):', e.message));

  } catch (err) {
    console.error('submitInquiry error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// GET /api/inquiries  (admin only)
const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { submitInquiry, getInquiries };