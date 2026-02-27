const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: 2000
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    images: [{
        type: String // Store URLs only, never binary
    }],
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['pottery', 'textiles', 'woodwork', 'jewelry', 'painting', 'sculpture', 'glasswork', 'metalwork', 'leatherwork', 'other'],
        default: 'other'
    },
    artisan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    views_count: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes_count: {
        type: Number,
        default: 0
    },
    is_available: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for efficient queries
productSchema.index({ artisan_id: 1 });
productSchema.index({ category: 1 });
productSchema.index({ created_at: -1 });
productSchema.index({ views_count: -1 });
productSchema.index({ likes_count: -1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
