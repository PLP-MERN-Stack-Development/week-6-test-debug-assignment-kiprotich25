const { body } = require('express-validator');
exports.signupValidation = [
  body('username').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password too short'),
];
exports.loginValidation = [
  body('email').isEmail().withMessage('Email required'),
  body('password').notEmpty().withMessage('Password required'),
];