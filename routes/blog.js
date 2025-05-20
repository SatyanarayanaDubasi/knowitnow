router.get('/', async (req, res) => {
  const blogs = await Blog.find(); // from MongoDB
  res.render('home', {
    title: 'KnowItNow Blog',
    blogs: blogs
  });
});
