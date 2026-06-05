const { body, validationResult } = require('express-validator');

// Helper to run validations and return formatting
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Return consistent error response with first error message
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  };
};

const passwordRules = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be between 8 and 16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*]/)
  .withMessage('Password must contain at least one special character (!@#$%^&*)');

const newPasswordRules = body('newPassword')
  .isLength({ min: 8, max: 16 })
  .withMessage('New password must be between 8 and 16 characters')
  .matches(/[A-Z]/)
  .withMessage('New password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*]/)
  .withMessage('New password must contain at least one special character (!@#$%^&*)');

const nameRules = body('name')
  .trim()
  .isLength({ min: 3, max: 60 })
  .withMessage('Name must be between 3 and 60 characters');

const addressRules = body('address')
  .trim()
  .optional({ nullable: true, checkFalsy: true })
  .isLength({ max: 400 })
  .withMessage('Address cannot exceed 400 characters');

const emailRules = body('email')
  .trim()
  .isEmail()
  .withMessage('Please provide a valid email address');

// Export rule sets wrapped in validate middleware
module.exports = {
  validateRegister: validate([
    nameRules,
    emailRules,
    passwordRules,
    addressRules
  ]),

  validateLogin: validate([
    body('email').trim().isEmail().withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ]),

  validateCreateUser: validate([
    nameRules,
    emailRules,
    passwordRules,
    addressRules,
    body('role')
      .isIn(['admin', 'user', 'owner'])
      .withMessage('Role must be admin, user, or owner')
  ]),

  validateCreateStore: validate([
    body('name')
      .trim()
      .isLength({ min: 20, max: 60 })
      .withMessage('Store name must be between 20 and 60 characters'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address'),
    body('address')
      .trim()
      .isLength({ max: 400 })
      .withMessage('Store address cannot exceed 400 characters'),
    body('ownerId')
      .isUUID()
      .withMessage('Owner ID must be a valid UUID')
  ]),

  validateCreateRating: validate([
    body('storeId')
      .isUUID()
      .withMessage('Store ID must be a valid UUID'),
    body('score')
      .isInt({ min: 1, max: 5 })
      .withMessage('Score must be an integer between 1 and 5')
  ]),

  validateChangePassword: validate([
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    newPasswordRules
  ])
};
