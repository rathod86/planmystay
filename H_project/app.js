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
const {
    requireAuth,
    redirectIfAuthenticated
} = require("./middleware/auth.js");

// --------------------- ROUTES ---------------------
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const insightsRoutes = require("./routes/insights.js");
const servicesRoutes = require("./routes/services.js");
const journeyRoutes = require("./routes/journey.js");

// --------------------- APP INIT ---------------------
const app = express();

// --------------------- DATABASE CONNECTION ---------------------
const dbUrl = process.env.ATLAS_URI; // Must be set on Render

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB successfully"))
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // stop server if DB fails
});

// --------------------- APP CONFIG ---------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// --------------------- FAVICON ROUTE ---------------------
app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "favicon.ico"));
});

// --------------------- SESSION STORE ---------------------
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", e => console.log("❌ SESSION STORE ERROR", e));

const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24
    }
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

// --------------------- ERROR HANDLERS ---------------------
app.use(notFoundHandler);
app.use(errorHandler);

// --------------------- SERVER ---------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
