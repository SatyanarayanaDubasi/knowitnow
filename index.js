const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postsRouter = require('./routes/posts');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Protect /admin.html before serving static files
app.get('/admin.html', (req, res, next) => {
  if (req.cookies && req.cookies.loggedIn === 'true') {
    return next();
  } else {
    return res.redirect('/login.html');
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/posts', postsRouter);

// Start Server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
});
