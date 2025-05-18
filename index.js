const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postsRouter = require('./routes/posts'); 

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Serve static HTML from /public directory
app.use(express.static(__dirname + '/public'));

// Use the posts router
app.use(express.static('public'));
app.use('/posts', postsRouter);

// Default route
//app.get('/', (req, res) => {
  //res.send('Welcome to the KnowItNow Blog API!');
//});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
});
