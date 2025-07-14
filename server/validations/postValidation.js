const { body } = require('express-validator');

exports.postValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  body('slug')
    .notEmpty()
    .withMessage('Slug is required'),
  body('author')
    .notEmpty()
    .withMessage('Author ID is required')
    .isMongoId()
    .withMessage('Author must be a valid MongoDB ID'),
  body('category')
    .notEmpty()
    .withMessage('Category ID is required')
    .isMongoId()
    .withMessage('Category must be a valid MongoDB ID'),
];

