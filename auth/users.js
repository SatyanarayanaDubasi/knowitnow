// auth/users.js
const bcrypt = require('bcrypt');

// Hash the password once (in production, store hashed password securely)
const hashedPassword = bcrypt.hashSync('Ved@0822#', 10);

module.exports = [
  {
    username: 'admin',
    password: hashedPassword
  }
];
