const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Apply auth middleware to all user routes
router.use(verifyToken);

// @route   GET api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', userController.getAllUsers);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private (Admin or own user)
router.get('/:id', userController.getUserById);

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private (Admin or own user)
router.put(
  '/:id',
  [
    body('firstName', 'First name is required').optional().not().isEmpty(),
    body('lastName', 'Last name is required').optional().not().isEmpty(),
    body('email', 'Please include a valid email').optional().isEmail(),
    body('role', 'Invalid role').optional().isIn(['admin', 'safety_manager', 'safety_supervisor'])
  ],
  userController.updateUser
);

// @route   PUT api/users/:id/password
// @desc    Update user password
// @access  Private (Admin or own user)
router.put(
  '/:id/password',
  [
    body('currentPassword', 'Current password is required').exists(),
    body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  userController.updatePassword
);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', userController.deleteUser);

module.exports = router;