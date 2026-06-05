const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { validateCreateStore } = require('../validators/schemas');

router.get('/', authMiddleware, requireRole('user', 'admin'), storeController.getStores);
router.post('/', authMiddleware, requireRole('admin'), validateCreateStore, storeController.createStore);

module.exports = router;
