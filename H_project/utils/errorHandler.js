const ExpressError = require('./ExpressError');

// Custom error classes for different types of errors
class ValidationError extends ExpressError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

class NotFoundError extends ExpressError {
    constructor(message = 'Resource not found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

class UnauthorizedError extends ExpressError {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

class ForbiddenError extends ExpressError {
    constructor(message = 'Access forbidden') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

class ConflictError extends ExpressError {
    constructor(message = 'Resource conflict') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    
    // Log error for debugging
    console.error('Error Details:', {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode,
        name: err.name,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    } else if (err.code === 11000) {
        statusCode = 409;
        message = 'Duplicate entry found';
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    } else if (err.message && err.message.includes('Title must be') || 
               err.message && err.message.includes('Description must be') ||
               err.message && err.message.includes('Price must be') ||
               err.message && err.message.includes('Location must be') ||
               err.message && err.message.includes('Country must be') ||
               err.message && err.message.includes('Please provide a valid URL')) {
        statusCode = 400;
        message = err.message;
    }

    // Send error response
    if (req.xhr || req.headers.accept && req.headers.accept.includes('application/json')) {
        // API request - send JSON response
        res.status(statusCode).json({
            error: {
                message: message,
                statusCode: statusCode,
                timestamp: new Date().toISOString()
            }
        });
    } else {
        // Browser request - render error page
        res.status(statusCode).render('error', {
            error: {
                message: message,
                statusCode: statusCode,
                stack: process.env.NODE_ENV === 'development' ? err.stack : null
            },
            layout: 'layouts/boilerplate'
        });
    }
};

// Async error wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// 404 handler
const notFoundHandler = (req, res, next) => {
    next(new NotFoundError(`Route ${req.originalUrl} not found`));
};

module.exports = {
    ExpressError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    errorHandler,
    asyncHandler,
    notFoundHandler
};
