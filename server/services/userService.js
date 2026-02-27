const User = require('../models/User');

const getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
    return user;
};

const updateProfile = async (userId, updates) => {
    const allowedFields = ['full_name', 'bio', 'mobile_number', 'profile_image', 'is_artisan'];
    const filteredUpdates = {};

    for (const key of allowedFields) {
        if (updates[key] !== undefined) {
            filteredUpdates[key] = updates[key];
        }
    }

    const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
        new: true,
        runValidators: true
    });

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

const followUser = async (currentUserId, targetUserId) => {
    if (currentUserId.toString() === targetUserId.toString()) {
        const error = new Error('Cannot follow yourself');
        error.statusCode = 400;
        throw error;
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    const alreadyFollowing = targetUser.followers.includes(currentUserId);
    if (alreadyFollowing) {
        const error = new Error('Already following this user');
        error.statusCode = 400;
        throw error;
    }

    await User.findByIdAndUpdate(targetUserId, {
        $push: { followers: currentUserId },
        $inc: { followers_count: 1 }
    });

    await User.findByIdAndUpdate(currentUserId, {
        $push: { following: targetUserId },
        $inc: { following_count: 1 }
    });

    return { message: 'Followed successfully' };
};

const unfollowUser = async (currentUserId, targetUserId) => {
    if (currentUserId.toString() === targetUserId.toString()) {
        const error = new Error('Cannot unfollow yourself');
        error.statusCode = 400;
        throw error;
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    const isFollowing = targetUser.followers.includes(currentUserId);
    if (!isFollowing) {
        const error = new Error('Not following this user');
        error.statusCode = 400;
        throw error;
    }

    await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUserId },
        $inc: { followers_count: -1 }
    });

    await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUserId },
        $inc: { following_count: -1 }
    });

    return { message: 'Unfollowed successfully' };
};

const getArtisans = async ({ page = 1, limit = 12 }) => {
    const skip = (page - 1) * limit;
    const artisans = await User.find({ is_artisan: true })
        .select('full_name profile_image bio followers_count')
        .sort({ followers_count: -1 })
        .skip(skip)
        .limit(limit);

    const total = await User.countDocuments({ is_artisan: true });

    return { artisans, total, page, pages: Math.ceil(total / limit) };
};

module.exports = { getUserById, updateProfile, followUser, unfollowUser, getArtisans };
