const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Admin Dashboard - GET
router.get('/admin', async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.render('admin', { title: 'Admin Dashboard', blogs });
});

// Handle Blog Submission - POST
router.post('/admin', async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const newBlog = new Blog({ title, content, author });
    await newBlog.save();
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to save blog');
  }
});

module.exports = router;

