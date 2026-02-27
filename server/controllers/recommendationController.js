const recommendationService = require('../services/recommendationService');

const getRecommendations = async (req, res, next) => {
    try {
        const userId = req.user?._id || null;
        const { limit } = req.query;
        const products = await recommendationService.getRecommendations(userId, {
            limit: parseInt(limit) || 12
        });
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        next(error);
    }
};

const getRecommendedArtisans = async (req, res, next) => {
    try {
        const userId = req.user?._id || null;
        const { limit } = req.query;
        const artisans = await recommendationService.getRecommendedArtisans(userId, {
            limit: parseInt(limit) || 6
        });
        res.status(200).json({ success: true, data: artisans });
    } catch (error) {
        next(error);
    }
};

module.exports = { getRecommendations, getRecommendedArtisans };
