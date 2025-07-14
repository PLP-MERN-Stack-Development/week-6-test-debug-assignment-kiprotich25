const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

// @desc    Get all posts with pagination and filtering
exports.getPosts = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = category ? { category } : {};

    const posts = await Post.find(filter)
      .populate('author')
      .populate('category')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get post by ID
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author')
      .populate('category');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    await post.incrementViewCount?.(); // Optional chaining in case method doesn't exist
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a post
exports.createPost = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { title, content, slug, category } = req.body;

    const newPost = new Post({
      title,
      content,
      slug,
      category,
      author: decoded.id,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// @desc    Update a post
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Optional: check if user is the author
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (post.author.toString() !== decoded.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedPost);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// @desc    Delete a post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (post.author.toString() !== decoded.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post successfully deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to a post
exports.addComment = async (req, res, next) => {
  try {
    const { user, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await post.addComment(user, content);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};
