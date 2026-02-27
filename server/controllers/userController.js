const userService = require('../services/userService');

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateProfile(req.user._id, req.body);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

const followUser = async (req, res, next) => {
    try {
        const result = await userService.followUser(req.user._id, req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const unfollowUser = async (req, res, next) => {
    try {
        const result = await userService.unfollowUser(req.user._id, req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const getArtisans = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await userService.getArtisans({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 12
        });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = { getProfile, updateProfile, followUser, unfollowUser, getArtisans };
