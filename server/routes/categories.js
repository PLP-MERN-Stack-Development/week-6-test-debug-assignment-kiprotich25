const express = require('express');
const router = express.Router();
const {getCategories,createCategory}= require('../controllers/categoryController');
const { categoryValidation } = require('../validations/categoryValidation');

router.get('/', getCategories);

// CREATE a new category
router.post('/', categoryValidation,createCategory);

module.exports = router;