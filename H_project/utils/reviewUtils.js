const mongoose = require('mongoose');

/**
 * Validate if a review ID is a valid MongoDB ObjectId
 * @param {string} reviewId - The review ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidReviewId = (reviewId) => {
    return mongoose.Types.ObjectId.isValid(reviewId);
};

/**
 * Sanitize review data before saving
 * @param {Object} reviewData - The review data to sanitize
 * @returns {Object} - Sanitized review data
 */
const sanitizeReviewData = (reviewData) => {
    const sanitized = { ...reviewData };
    
    // Trim string fields
    if (sanitized.comment) {
        sanitized.comment = sanitized.comment.trim();
    }
    
    if (sanitized.author) {
        sanitized.author = sanitized.author.trim();
    }
    
    // Ensure rating is an integer
    if (sanitized.rating) {
        sanitized.rating = Math.round(Number(sanitized.rating));
    }
    
    // Set default author if not provided
    if (!sanitized.author || sanitized.author.length < 2) {
        sanitized.author = "Anonymous User";
    }
    
    return sanitized;
};

/**
 * Check if a user has already reviewed a listing
 * @param {string} listingId - The listing ID
 * @param {string} author - The author name
 * @param {Object} Review - The Review model
 * @returns {Promise<boolean>} - True if user has already reviewed
 */
const hasUserReviewed = async (listingId, author, Review) => {
    try {
        const existingReview = await Review.findOne({
            author: author,
            _id: { $in: listingId.reviews }
        });
        return !!existingReview;
    } catch (error) {
        console.error('Error checking existing review:', error);
        return false;
    }
};

/**
 * Calculate average rating for a listing
 * @param {Array} reviews - Array of review IDs
 * @param {Object} Review - The Review model
 * @returns {Promise<number>} - Average rating (0 if no reviews)
 */
const calculateAverageRating = async (reviews, Review) => {
    try {
        if (!reviews || reviews.length === 0) {
            return 0;
        }
        
        const reviewDocs = await Review.find({ _id: { $in: reviews } });
        if (reviewDocs.length === 0) {
            return 0;
        }
        
        const totalRating = reviewDocs.reduce((sum, review) => sum + review.rating, 0);
        return Math.round((totalRating / reviewDocs.length) * 10) / 10; // Round to 1 decimal place
    } catch (error) {
        console.error('Error calculating average rating:', error);
        return 0;
    }
};

/**
 * Validate review rating is within acceptable range
 * @param {number} rating - The rating to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidRating = (rating) => {
    const numRating = Number(rating);
    return Number.isInteger(numRating) && numRating >= 1 && numRating <= 5;
};

/**
 * Validate review comment length
 * @param {string} comment - The comment to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidComment = (comment) => {
    if (!comment || typeof comment !== 'string') {
        return false;
    }
    const trimmedComment = comment.trim();
    return trimmedComment.length >= 3 && trimmedComment.length <= 500;
};

module.exports = {
    isValidReviewId,
    sanitizeReviewData,
    hasUserReviewed,
    calculateAverageRating,
    isValidRating,
    isValidComment
};
