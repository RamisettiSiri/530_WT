const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Error connecting to MongoDB:", err));

// Routes
app.use('/files', require('./routes/fileRoutes'));

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🌐 Server running on port ${process.env.PORT}`);
});