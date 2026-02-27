const Product = require('../models/Product');
const ActivityLog = require('../models/ActivityLog');

const createProduct = async (artisanId, productData) => {
    const product = await Product.create({
        ...productData,
        artisan_id: artisanId
    });
    return product;
};

const getProducts = async ({ page = 1, limit = 12, category, artisan_id, sort = '-created_at' }) => {
    const skip = (page - 1) * limit;
    const query = { is_available: true };

    if (category) query.category = category;
    if (artisan_id) query.artisan_id = artisan_id;

    const products = await Product.find(query)
        .populate('artisan_id', 'full_name profile_image')
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const total = await Product.countDocuments(query);

    return { products, total, page, pages: Math.ceil(total / limit) };
};

const getProductById = async (productId, userId) => {
    const product = await Product.findById(productId)
        .populate('artisan_id', 'full_name profile_image bio followers_count');

    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    // Increment view count
    await Product.findByIdAndUpdate(productId, { $inc: { views_count: 1 } });

    // Log activity for recommendations
    if (userId) {
        await ActivityLog.create({
            user_id: userId,
            action: 'view_product',
            target_id: productId,
            target_type: 'Product',
            metadata: { category: product.category }
        });
    }

    return product;
};

const updateProduct = async (productId, artisanId, updates) => {
    const product = await Product.findById(productId);

    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    // Ownership validation
    if (product.artisan_id.toString() !== artisanId.toString()) {
        const error = new Error('Not authorized to update this product');
        error.statusCode = 403;
        throw error;
    }

    const allowedFields = ['title', 'description', 'price', 'images', 'category', 'is_available'];
    const filteredUpdates = {};
    for (const key of allowedFields) {
        if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    }

    const updated = await Product.findByIdAndUpdate(productId, filteredUpdates, {
        new: true,
        runValidators: true
    });

    return updated;
};

const deleteProduct = async (productId, artisanId) => {
    const product = await Product.findById(productId);

    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    if (product.artisan_id.toString() !== artisanId.toString()) {
        const error = new Error('Not authorized to delete this product');
        error.statusCode = 403;
        throw error;
    }

    await Product.findByIdAndDelete(productId);
    return { message: 'Product deleted successfully' };
};

const likeProduct = async (productId, userId) => {
    const product = await Product.findById(productId);
    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    const alreadyLiked = product.likes.includes(userId);
    if (alreadyLiked) {
        await Product.findByIdAndUpdate(productId, {
            $pull: { likes: userId },
            $inc: { likes_count: -1 }
        });
        return { liked: false };
    }

    await Product.findByIdAndUpdate(productId, {
        $push: { likes: userId },
        $inc: { likes_count: 1 }
    });

    await ActivityLog.create({
        user_id: userId,
        action: 'like_product',
        target_id: productId,
        target_type: 'Product',
        metadata: { category: product.category }
    });

    return { liked: true };
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct, likeProduct };
