const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Admin login route
router.post('/admin-login', adminController.adminLogin);

module.exports = router;
