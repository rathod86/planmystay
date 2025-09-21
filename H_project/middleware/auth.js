// Authentication middleware
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in to access this page');
        return res.redirect('/users/login');
    }
    next();
};

const isLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/listings');
    }
    next();
};

// Redirect to login if not authenticated
const requireAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please sign in to continue');
        return res.redirect('/users/login');
    }
    next();
};

// Redirect to home if already authenticated
const redirectIfAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/listings');
    }
    next();
};

module.exports = {
    isLoggedIn,
    isLoggedOut,
    requireAuth,
    redirectIfAuthenticated
};
