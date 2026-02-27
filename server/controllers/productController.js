const productService = require('../services/productService');

const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.user._id, req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const { page, limit, category, artisan_id, sort } = req.query;
        const result = await productService.getProducts({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 12,
            category,
            artisan_id,
            sort
        });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const userId = req.user?._id || null;
        const product = await productService.getProductById(req.params.id, userId);
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.user._id, req.body);
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const result = await productService.deleteProduct(req.params.id, req.user._id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const likeProduct = async (req, res, next) => {
    try {
        const result = await productService.likeProduct(req.params.id, req.user._id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct, likeProduct };
