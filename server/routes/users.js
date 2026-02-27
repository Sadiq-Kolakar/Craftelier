const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile, followUser, unfollowUser, getArtisans } = require('../controllers/userController');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/artisans', getArtisans);
router.get('/:id', getProfile);

router.put('/profile',
    protect,
    [
        body('full_name').optional().trim().isLength({ max: 100 }),
        body('bio').optional().trim().isLength({ max: 500 }),
        body('mobile_number').optional().trim(),
        body('is_artisan').optional().isBoolean()
    ],
    validate,
    updateProfile
);

router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

module.exports = router;
