const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
const path     = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/inquiries', require('./routes/inquiries'));

// Health check
app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'Server running ✅' })
);

// Frontend
const frontendPath = path.join(__dirname, '..', 'Frontend', 'public');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Database
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running → http://localhost:${PORT}`)
  );
});