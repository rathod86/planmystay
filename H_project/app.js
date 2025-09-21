// --------------------- LOAD ENV VARIABLES ---------------------
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// --------------------- MODELS ---------------------
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");

// --------------------- UTILS & MIDDLEWARE ---------------------
const { errorHandler, notFoundHandler } = require("./utils/errorHandler.js");
const ExpressError = require("./utils/ExpressError.js");
const {
    validateListing,
    validateListingUpdate,
    validateId,
    validateReview,
    validateReviewId,
    validateReviewUpdate,
} = require("./utils/validateSchema.js");
const { sanitizeReviewData } = require("./utils/reviewUtils.js");
const { requireAuth, redirectIfAuthenticated } = require("./middleware/auth.js");

// --------------------- ROUTES ---------------------
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const insightsRoutes = require("./routes/insights.js");
const servicesRoutes = require("./routes/services.js");
const journeyRoutes = require("./routes/journey.js");

// --------------------- APP INIT ---------------------
const app = express();

// --------------------- DATABASE URL ---------------------
const dbUrl = process.env.ATLAS_URI || "mongodb://127.0.0.1:27017/planmystay";

// --------------------- DATABASE CONNECTION ---------------------
async function main() {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}
main();

// --------------------- APP CONFIG ---------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// --------------------- SESSION STORE ---------------------
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET || "devsecret",
    },
    touchAfter: 24 * 3600, // update once every 24 hours
});

store.on("error", function (e) {
    console.log("❌ SESSION STORE ERROR", e);
});

// --------------------- SESSION CONFIG ---------------------
const sessionConfig = {
    store,
    secret: process.env.SECRET || "devsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
};

app.use(session(sessionConfig));
app.use(flash());

// --------------------- PASSPORT ---------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --------------------- GLOBAL TEMPLATE VARS ---------------------
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// --------------------- ROUTES ---------------------
app.use("/users", userRoutes);
app.use("/listings", requireAuth, listingRoutes);
app.use("/listings/:id/reviews", requireAuth, reviewRoutes);
app.use("/api/insights", requireAuth, insightsRoutes);
app.use("/services", requireAuth, servicesRoutes);
app.use("/api/journey", journeyRoutes);

// Home
app.get("/", (req, res) => {
    res.render("home", { layout: "layouts/boilerplate" });
});

// Journey Page
app.get("/journey", (req, res) => {
    res.render("journey/index", { layout: "layouts/boilerplate" });
});

// Seed journey data (testing only)
app.get("/seed-journey", async (req, res) => {
    try {
        const { seedJourneyData } = require("./init/journeyData.js");
        await seedJourneyData();
        res.json({ success: true, message: "Journey data seeded successfully" });
    } catch (error) {
        console.error("❌ Error seeding journey data:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// AI Price Prediction API
app.post("/api/predict-price", async (req, res) => {
    try {
        const { predictPrice } = require("./utils/pricePredictor.js");
        const prediction = await predictPrice(req.body);
        res.json(prediction);
    } catch (error) {
        console.error("❌ Error in price prediction API:", error);
        res.status(500).json({ error: "Failed to get price prediction" });
    }
});

// --------------------- ERROR HANDLERS ---------------------
app.use(notFoundHandler);
app.use(errorHandler);

// --------------------- SERVER ---------------------
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`🚀 PlanMyStay Server running on port ${PORT}`);
    console.log(`🌐 Visit: http://localhost:${PORT}`);
    console.log("🏨 Welcome to PlanMyStay - Your Perfect Travel Companion!");
});

// Handle server errors
server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error(
            `👉 Try: taskkill /f /im node.exe OR PORT=3001 nodemon app.js`
        );
    } else {
        console.error("❌ Server error:", err);
    }
    process.exit(1);
});

module.exports = app;
