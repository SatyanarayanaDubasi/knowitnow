const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const postsRouter = require('./routes/posts');
const Blog = require('./models/Blog');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(expressLayouts);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.cookies = req.cookies;
  next();
});


// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Home page route
app.get('/', async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.render('home', { title: 'KnowItNow Blog', blogs });
});

// Login page
app.get('/login', (req, res) => {
  res.render('login', { title: 'Admin Login' });
});

// Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('loggedIn');
  res.redirect('/login');
});

// Admin route (protected)
app.get('/admin', async (req, res) => {
  if (req.cookies && req.cookies.loggedIn === 'true') {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      return res.render('admin', { title: 'Admin Dashboard', blogs });
    } catch (err) {
      console.error('Error fetching blogs:', err);
      return res.status(500).send('Server Error');
    }
  } else {
    return res.redirect('/login');
  }
});


// Handle blog creation
app.post('/admin', async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const newBlog = new Blog({ title, content, author });
    await newBlog.save();
    res.redirect('/admin');
  } catch (err) {
    console.error('❌ Error adding blog:', err);
    res.status(500).send('Error saving blog');
  }
});


// Blog routes (Add, Edit, Delete)
app.use('/posts', postsRouter);


app.post('/admin/delete/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    await Blog.findByIdAndDelete(blogId);
    res.redirect('/admin'); // or wherever your admin dashboard is
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).send('Error deleting blog');
  }
});


// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});

