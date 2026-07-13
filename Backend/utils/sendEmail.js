const nodemailer = require('nodemailer');

// NOTE: EMAIL_PASS must be a Gmail App Password (16-char code), NOT your real password.
// Generate one at: https://myaccount.google.com/apppasswords
// (Requires 2-Step Verification to be enabled on your Google account)

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"NanoCal Industries" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
