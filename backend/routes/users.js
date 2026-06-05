const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { validateCreateUser, validateChangePassword } = require('../validators/schemas');

// Admin only routes
router.get('/', authMiddleware, requireRole('admin'), userController.getUsers);
router.post('/', authMiddleware, requireRole('admin'), validateCreateUser, userController.createUser);
router.get('/:id', authMiddleware, requireRole('admin'), userController.getUserById);

// All authenticated users can change password
router.patch('/me/password', authMiddleware, validateChangePassword, userController.changePassword);

module.exports = router;
