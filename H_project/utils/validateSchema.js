const Joi = require('joi');

// Base listing schema
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string()
            .min(3)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Title is required',
                'string.min': 'Title must be at least 3 characters long',
                'string.max': 'Title cannot exceed 100 characters',
                'any.required': 'Title is required'
            }),
        
        description: Joi.string()
            .min(10)
            .max(1000)
            .required()
            .messages({
                'string.empty': 'Description is required',
                'string.min': 'Description must be at least 10 characters long',
                'string.max': 'Description cannot exceed 1000 characters',
                'any.required': 'Description is required'
            }),
        
        image: Joi.object({
            url: Joi.string()
                .uri()
                .allow('')
                .optional()
                .messages({
                    'string.uri': 'Please provide a valid URL for the image'
                }),
            filename: Joi.string().optional()
        }).optional(),
        
        price: Joi.number()
            .min(0)
            .max(1000000)
            .required()
            .messages({
                'number.base': 'Price must be a valid number',
                'number.min': 'Price cannot be negative',
                'number.max': 'Price cannot exceed 1,000,000',
                'any.required': 'Price is required'
            }),
        
        location: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Location is required',
                'string.min': 'Location must be at least 2 characters long',
                'string.max': 'Location cannot exceed 100 characters',
                'any.required': 'Location is required'
            }),
        
        country: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Country is required',
                'string.min': 'Country must be at least 2 characters long',
                'string.max': 'Country cannot exceed 100 characters',
                'any.required': 'Country is required'
            })
    }).required().unknown(true)
});

// Schema for updating listings (all fields optional)
const listingUpdateSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string()
            .min(3)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Title must be at least 3 characters long',
                'string.max': 'Title cannot exceed 100 characters'
            }),
        
        description: Joi.string()
            .min(10)
            .max(1000)
            .optional()
            .messages({
                'string.min': 'Description must be at least 10 characters long',
                'string.max': 'Description cannot exceed 1000 characters'
            }),
        
        image: Joi.object({
            url: Joi.string()
                .uri()
                .allow('')
                .optional()
                .messages({
                    'string.uri': 'Please provide a valid URL for the image'
                }),
            filename: Joi.string().optional()
        }).optional(),
        
        price: Joi.number()
            .min(0)
            .max(1000000)
            .optional()
            .messages({
                'number.base': 'Price must be a valid number',
                'number.min': 'Price cannot be negative',
                'number.max': 'Price cannot exceed 1,000,000'
            }),
        
        location: Joi.string()
            .min(2)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Location must be at least 2 characters long',
                'string.max': 'Location cannot exceed 100 characters'
            }),
        
        country: Joi.string()
            .min(2)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Country must be at least 2 characters long',
                'string.max': 'Country cannot exceed 100 characters'
            })
    }).required().unknown(true)
});

// Validation middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        throw new Error(errorMessage);
    }
    
    next();
};

const validateListingUpdate = (req, res, next) => {
    const { error } = listingUpdateSchema.validate(req.body);
    
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        throw new Error(errorMessage);
    }
    
    next();
};

// ID validation middleware
const validateId = (req, res, next) => {
    const { id } = req.params;
    
    if (!id || id.trim() === '') {
        throw new Error('Listing ID is required');
    }
    
    next();
};

// Search/query validation
const searchSchema = Joi.object({
    q: Joi.string().min(1).max(100).optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    location: Joi.string().min(1).max(100).optional(),
    country: Joi.string().min(1).max(100).optional(),
    limit: Joi.number().integer().min(1).max(100).default(20).optional(),
    page: Joi.number().integer().min(1).default(1).optional()
});

const validateSearch = (req, res, next) => {
    const { error } = searchSchema.validate(req.query);
    
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        throw new Error(errorMessage);
    }
    
    next();
};

// Review validation schema
const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string()
            .min(3)
            .max(500)
            .required()
            .trim()
            .messages({
                'string.empty': 'Review comment is required',
                'string.min': 'Review comment must be at least 3 characters long',
                'string.max': 'Review comment cannot exceed 500 characters',
                'any.required': 'Review comment is required'
            }),
        
        rating: Joi.number()
            .integer()
            .min(1)
            .max(5)
            .required()
            .messages({
                'number.base': 'Rating must be a valid number',
                'number.integer': 'Rating must be a whole number',
                'number.min': 'Rating must be at least 1',
                'number.max': 'Rating cannot exceed 5',
                'any.required': 'Rating is required'
            }),
        
        author: Joi.string()
            .min(2)
            .max(50)
            .optional()
            .trim()
            .messages({
                'string.min': 'Author name must be at least 2 characters long',
                'string.max': 'Author name cannot exceed 50 characters'
            })
    }).required()
});

// Review validation middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        throw new Error(errorMessage);
    }
    
    next();
};

// Review update validation schema (for editing reviews)
const reviewUpdateSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string()
            .min(3)
            .max(500)
            .optional()
            .trim()
            .messages({
                'string.min': 'Review comment must be at least 3 characters long',
                'string.max': 'Review comment cannot exceed 500 characters'
            }),
        
        rating: Joi.number()
            .integer()
            .min(1)
            .max(5)
            .optional()
            .messages({
                'number.base': 'Rating must be a valid number',
                'number.integer': 'Rating must be a whole number',
                'number.min': 'Rating must be at least 1',
                'number.max': 'Rating cannot exceed 5'
            }),
        
        author: Joi.string()
            .min(2)
            .max(50)
            .optional()
            .trim()
            .messages({
                'string.min': 'Author name must be at least 2 characters long',
                'string.max': 'Author name cannot exceed 50 characters'
            })
    }).required()
});

// Review update validation middleware
const validateReviewUpdate = (req, res, next) => {
    const { error } = reviewUpdateSchema.validate(req.body);
    
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        throw new Error(errorMessage);
    }
    
    next();
};

// Review ID validation middleware
const validateReviewId = (req, res, next) => {
    const { reviewId } = req.params;
    
    if (!reviewId || reviewId.trim() === '') {
        throw new Error('Review ID is required');
    }
    
    next();
};

module.exports = {
    listingSchema,
    listingUpdateSchema,
    searchSchema,
    reviewSchema,
    reviewUpdateSchema,
    validateListing,
    validateListingUpdate,
    validateId,
    validateSearch,
    validateReview,
    validateReviewUpdate,
    validateReviewId
};
