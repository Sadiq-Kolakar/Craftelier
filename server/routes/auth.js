const express = require('express');
const { body } = require('express-validator');
const { signup, login, getMe } = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/signup',
    authLimiter,
    [
        body('full_name').trim().notEmpty().withMessage('Full name is required').isLength({ max: 100 }),
        body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('mobile_number').optional().trim()
    ],
    validate,
    signup
);

router.post('/login',
    authLimiter,
    [
        body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required')
    ],
    validate,
    login
);

router.get('/me', protect, getMe);

module.exports = router;
