const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['view_product', 'like_product', 'follow_artisan', 'purchase', 'search'],
        required: true
    },
    target_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    target_type: {
        type: String,
        enum: ['Product', 'User'],
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: { createdAt: 'created_at' }
});

activityLogSchema.index({ user_id: 1, action: 1 });
activityLogSchema.index({ created_at: -1 });
activityLogSchema.index({ target_id: 1, target_type: 1 });

// Auto-expire old logs after 90 days
activityLogSchema.index({ created_at: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
