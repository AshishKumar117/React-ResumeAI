const fs = require('fs');
const mongoose = require('mongoose');

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx === -1) return;
    const key = line.slice(0, idx);
    const val = line.slice(idx+1);
    process.env[key] = val;
  });
}

loadEnv('.env.local');

(async () => {
  try {
    if (!process.env.MONGODB_URL) {
      console.error('MONGODB_URL not set in .env.local');
      process.exit(2);
    }

    console.log('Attempting to connect to MongoDB with URL:', process.env.MONGODB_URL);
    await mongoose.connect(process.env.MONGODB_URL, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected to MongoDB successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
