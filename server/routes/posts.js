const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const  {getPosts,getPostById, updatePost,createPost,deletePost, addComment} = require('../controllers/postController');
const { postValidation} = require ('../validations/postValidation');

router.get('/',getPosts);
router.get('/:id', getPostById);


router.post('/', postValidation,createPost);

// UPDATE a post
router.put('/:id', postValidation,updatePost);

// DELETE a post
router.delete('/:id', deletePost);

// ADD a comment to a post
router.post('/:id/comments', addComment);

module.exports = router;