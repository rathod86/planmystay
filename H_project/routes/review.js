const express = require('express');
const mongoose = require('mongoose');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { asyncHandler } = require("../utils/errorHandler.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateId, validateReview, validateReviewId, validateReviewUpdate } = require("../utils/validateSchema.js");
const { sanitizeReviewData } = require('../utils/reviewUtils.js');

// POST /listings/:id/reviews -> create review
router.post('/', validateReview, asyncHandler(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }

    if (!listing.propertyType) {
        listing.propertyType = 'Apartment';
    }

    const sanitizedReviewData = sanitizeReviewData(req.body.review);
    const newReview = new Review(sanitizedReviewData);
    await newReview.save();

    listing.reviews.push(newReview._id);
    await listing.save();

    res.redirect(`/listings/${req.params.id}`);
}));

// DELETE /listings/:id/reviews/:reviewId -> delete review
router.delete('/:reviewId', validateId, validateReviewId, asyncHandler(async (req, res, next) => {
    const { id, reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ExpressError("Invalid review ID", 400);
    }
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }
    listing.reviews = listing.reviews.filter(review => review.toString() !== reviewId);
    await listing.save();
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
        throw new ExpressError("Review not found", 404);
    }
    res.redirect(`/listings/${id}`);
}));

// GET /listings/:id/reviews/:reviewId/edit -> edit review form
router.get('/:reviewId/edit', validateId, validateReviewId, asyncHandler(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ExpressError("Review not found", 404);
    }
    res.render("reviews/edit", { listing, review, layout: "layouts/boilerplate" });
}));

// PUT /listings/:id/reviews/:reviewId -> update review
router.put('/:reviewId', validateId, validateReviewId, validateReviewUpdate, asyncHandler(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }
    const sanitizedReviewData = sanitizeReviewData(req.body.review);
    const updatedReview = await Review.findByIdAndUpdate(reviewId, sanitizedReviewData, { new: true, runValidators: true });
    if (!updatedReview) {
        throw new ExpressError("Review not found", 404);
    }
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
