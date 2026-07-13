// Run this ONCE to create your admin account:
//   node createAdmin.js
//
// You can change the username/password below before running.

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const Admin    = require('./models/Admin');

dotenv.config();

const USERNAME = 'admin';
const PASSWORD = 'nanocal1234';   // ← change this to your preferred password

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const exists = await Admin.findOne({ username: USERNAME });
    if (exists) {
      console.log('⚠️  Admin already exists. Delete from MongoDB if you want to reset.');
      process.exit(0);
    }

    await Admin.create({ username: USERNAME, password: PASSWORD });
    console.log(`✅ Admin created!`);
    console.log(`   Username: ${USERNAME}`);
    console.log(`   Password: ${PASSWORD}`);
    console.log('');
    console.log('You can now login at http://localhost:5000 using the Admin button.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
