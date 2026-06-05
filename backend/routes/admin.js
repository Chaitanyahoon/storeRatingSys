const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.get('/stats', authMiddleware, requireRole('admin'), adminController.getStats);

module.exports = router;
