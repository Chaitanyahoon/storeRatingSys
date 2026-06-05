const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { validateCreateRating } = require('../validators/schemas');

router.post('/', authMiddleware, requireRole('user'), validateCreateRating, ratingController.upsertRating);

module.exports = router;
