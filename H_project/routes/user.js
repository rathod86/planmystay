const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectIfAuthenticated } = require("../middleware/auth.js");


router.get("/signup", redirectIfAuthenticated, (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", redirectIfAuthenticated, wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        
        // Validate required fields
        if (!username || username.trim().length < 3) {
            req.flash("error", "Username must be at least 3 characters long");
            return res.redirect("/users/signup");
        }
        
        if (!email || !email.includes('@')) {
            req.flash("error", "Please provide a valid email address");
            return res.redirect("/users/signup");
        }
        
        if (!password || password.length < 6) {
            req.flash("error", "Password must be at least 6 characters long");
            return res.redirect("/users/signup");
        }
        
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
    } catch (e) {
        console.error('Signup error:', e);
        
        // Handle specific error types
        if (e.name === 'UserExistsError') {
            req.flash("error", "A user with this email already exists");
        } else if (e.code === 11000) {
            req.flash("error", "Username or email already exists");
        } else if (e.name === 'ValidationError') {
            const errorMessages = Object.values(e.errors).map(err => err.message);
            req.flash("error", `Validation failed: ${errorMessages.join(', ')}`);
        } else {
            req.flash("error", e.message || "Failed to create account. Please try again.");
        }
        
        res.redirect("/users/signup");
    }
}));

router.get("/login", redirectIfAuthenticated, (req,res)=>{
 res.render("users/login.ejs");
});

router.post("/login", redirectIfAuthenticated, (req, res, next) => {
    // Validate required fields
    if (!req.body.username || !req.body.password) {
        req.flash("error", "Username and password are required");
        return res.redirect("/users/login");
    }
    
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/users/login"
    })(req, res, next);
}, (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            req.flash("error", "Failed to logout. Please try again.");
            return res.redirect("/listings");
        }
        
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    });
});

module.exports = router;