const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

//  registration route
router.post('/register', authController.register);

// Email verification route
router.get('/verify-email/:token', authController.verifyEmail);

//Customer login route
router.post('/customer-login', authController.customerLogin);


module.exports = router;
