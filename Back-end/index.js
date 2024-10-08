const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Post = require('./models/post.model');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
  }));
app.use(bodyParser.json());

// MongoDB Connection   
mongoose.connect('mongodb://localhost:27017/sportsapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Routes
// GET all posts
app.get('/posts/list', async (req, res) => {
  try {
    // const posts = await Post.find().sort({ createdAt: -1 });
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new post
app.post('/posts', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    genre: req.body.genre,
    date: req.body.date,
    image: req.body.image,
    location: req.body.location
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE post
app.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://10.33.49.103:${PORT}`);
  });