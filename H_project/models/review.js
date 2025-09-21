const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        trim: true,
        minlength: [3, 'Review comment must be at least 3 characters long'],
        maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be a whole number'
        }
    },
    author: {
        type: String,
        default: "Anonymous User",
        trim: true,
        minlength: [2, 'Author name must be at least 2 characters long'],
        maxlength: [50, 'Author name cannot exceed 50 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add a compound index to prevent duplicate reviews from the same author for the same listing
// This would be added when the review is associated with a listing
reviewSchema.index({ author: 1, createdAt: 1 });

// Pre-save middleware to ensure rating is an integer
reviewSchema.pre('save', function(next) {
    if (this.rating) {
        this.rating = Math.round(this.rating);
    }
    next();
});

module.exports = mongoose.model('Review', reviewSchema);