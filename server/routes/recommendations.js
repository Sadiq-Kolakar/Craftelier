const express = require('express');
const { getRecommendations, getRecommendedArtisans } = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Optional auth — works for both authenticated and guest users
const optionalAuth = async (req, res, next) => {
    try {
        const jwt = require('jsonwebtoken');
        const User = require('../models/User');
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
        }
    } catch (e) {
        // Silently continue without auth
    }
    next();
};

router.get('/crafts', optionalAuth, getRecommendations);
router.get('/artisans', optionalAuth, getRecommendedArtisans);

module.exports = router;
