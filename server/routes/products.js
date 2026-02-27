const express = require('express');
const { body } = require('express-validator');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, likeProduct } = require('../controllers/productController');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/',
    protect,
    [
        body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
        body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 2000 }),
        body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('category').isIn(['pottery', 'textiles', 'woodwork', 'jewelry', 'painting', 'sculpture', 'glasswork', 'metalwork', 'leatherwork', 'other']).withMessage('Invalid category'),
        body('images').optional().isArray().withMessage('Images must be an array')
    ],
    validate,
    createProduct
);

router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.post('/:id/like', protect, likeProduct);

module.exports = router;
