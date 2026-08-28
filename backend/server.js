const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Database Table
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        mobile_number VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        dob VARCHAR(50),
        age VARCHAR(10),
        address TEXT,
        marital_status VARCHAR(50),
        blood_group VARCHAR(10),
        nationality VARCHAR(50),
        preferred_language VARCHAR(50),
        profile_photo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add columns if they don't exist (for existing tables)
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS dob VARCHAR(50),
      ADD COLUMN IF NOT EXISTS age VARCHAR(10),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS marital_status VARCHAR(50),
      ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10),
      ADD COLUMN IF NOT EXISTS nationality VARCHAR(50),
      ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(50),
      ADD COLUMN IF NOT EXISTS profile_photo TEXT;
    `);
    console.log('Database initialized: users table ready.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

initDb();

// --- Auth Routes ---

// Register Endpoint
app.post('/api/auth/register', async (req, res) => {
  const { 
    fullName, mobileNumber, email, password, 
    dob, age, address, maritalStatus, bloodGroup, 
    nationality, preferredLanguage, profilePhoto 
  } = req.body;

  if (!fullName || !mobileNumber || !email || !password) {
    return res.status(400).json({ error: 'Core fields are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR mobile_number = $2',
      [email, mobileNumber]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email or mobile number already exists.' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (
        full_name, mobile_number, email, password_hash, 
        dob, age, address, marital_status, blood_group, 
        nationality, preferred_language, profile_photo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id, full_name, email`,
      [
        fullName, mobileNumber, email, passwordHash, 
        dob, age, address, maritalStatus, bloodGroup, 
        nationality, preferredLanguage, profilePhoto
      ]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Login successful', 
      token, 
      user: { 
        id: user.id, 
        full_name: user.full_name, 
        email: user.email,
        profile_photo: user.profile_photo 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// Get User Endpoint
app.get('/api/user/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const user = result.rows[0];
    // Don't send password hash back
    delete user.password_hash;
    res.json({ user });
  } catch (err) {
    console.error('Fetch user error:', err);
    res.status(500).json({ error: 'Server error while fetching user data.' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
