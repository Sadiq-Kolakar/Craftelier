const Product = require('../models/Product');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

const getRecommendations = async (userId, { limit = 12 }) => {
    if (!userId) {
        // Non-authenticated: return popular products
        return getPopularProducts(limit);
    }

    // Get user's activity for personalization
    const activities = await ActivityLog.find({ user_id: userId })
        .sort({ created_at: -1 })
        .limit(50);

    if (activities.length === 0) {
        return getPopularProducts(limit);
    }

    // Extract preferred categories from activity
    const categoryScores = {};
    activities.forEach(activity => {
        const cat = activity.metadata?.category;
        if (cat) {
            const weight = activity.action === 'like_product' ? 3
                : activity.action === 'purchase' ? 5
                    : 1;
            categoryScores[cat] = (categoryScores[cat] || 0) + weight;
        }
    });

    // Sort categories by score
    const preferredCategories = Object.entries(categoryScores)
        .sort((a, b) => b[1] - a[1])
        .map(([cat]) => cat);

    // Get viewed product IDs to exclude
    const viewedProductIds = activities
        .filter(a => a.target_type === 'Product')
        .map(a => a.target_id);

    // Get followed artisan IDs
    const user = await User.findById(userId).select('following');
    const followingIds = user?.following || [];

    // Build recommendation query
    let products = [];

    // Priority 1: Products from followed artisans in preferred categories
    if (followingIds.length > 0 && preferredCategories.length > 0) {
        const followedProducts = await Product.find({
            artisan_id: { $in: followingIds },
            category: { $in: preferredCategories.slice(0, 3) },
            _id: { $nin: viewedProductIds },
            is_available: true
        })
            .populate('artisan_id', 'full_name profile_image')
            .sort({ created_at: -1 })
            .limit(Math.ceil(limit / 2));
        products.push(...followedProducts);
    }

    // Priority 2: Popular products in preferred categories
    if (products.length < limit && preferredCategories.length > 0) {
        const categoryProducts = await Product.find({
            category: { $in: preferredCategories.slice(0, 3) },
            _id: { $nin: [...viewedProductIds, ...products.map(p => p._id)] },
            is_available: true
        })
            .populate('artisan_id', 'full_name profile_image')
            .sort({ likes_count: -1 })
            .limit(limit - products.length);
        products.push(...categoryProducts);
    }

    // Priority 3: Fill remaining with popular products
    if (products.length < limit) {
        const popular = await Product.find({
            _id: { $nin: [...viewedProductIds, ...products.map(p => p._id)] },
            is_available: true
        })
            .populate('artisan_id', 'full_name profile_image')
            .sort({ views_count: -1, likes_count: -1 })
            .limit(limit - products.length);
        products.push(...popular);
    }

    return products;
};

const getPopularProducts = async (limit = 12) => {
    return Product.find({ is_available: true })
        .populate('artisan_id', 'full_name profile_image')
        .sort({ likes_count: -1, views_count: -1 })
        .limit(limit);
};

const getRecommendedArtisans = async (userId, { limit = 6 }) => {
    const baseQuery = { is_artisan: true };

    if (userId) {
        const user = await User.findById(userId).select('following');
        if (user?.following?.length > 0) {
            baseQuery._id = { $nin: user.following };
        }
    }

    return User.find(baseQuery)
        .select('full_name profile_image bio followers_count')
        .sort({ followers_count: -1 })
        .limit(limit);
};

module.exports = { getRecommendations, getPopularProducts, getRecommendedArtisans };
