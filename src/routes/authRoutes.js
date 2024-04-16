// src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/auth/authController');

const router = express.Router();
console.log("jdks")
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);
router.post('/update-profile', authController.editProfile);

module.exports = router;
