// routes/auth.js
const express = require('express');
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcrypt');
const users = require('../auth/users');

// Login form (GET)
router.get('/login', (req, res) => {
  res.sendFile(__dirname + '/../public/login.html');
});

// Login submission (POST)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = username;
    res.redirect('/admin.html');
  } else {
    res.send('Invalid credentials');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
