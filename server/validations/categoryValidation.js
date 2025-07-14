const { body, validationResult } = require('express-validator');

exports.categoryValidation = [
  body('name')
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters'),

  // 👇 Error handler middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
