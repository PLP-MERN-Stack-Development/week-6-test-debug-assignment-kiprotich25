const express = require ('express');
const router = express.Router();
const { signup, login} = require('../controllers/authController');
const {signupValidation,loginValidation} = require("../validations/authValidation")

router.post("/signup",signupValidation, signup );
router.post("/login", loginValidation, login);

module.exports = router;