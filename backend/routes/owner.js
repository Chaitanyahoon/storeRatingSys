const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.get('/dashboard', authMiddleware, requireRole('owner'), ownerController.getOwnerDashboard);

module.exports = router;
