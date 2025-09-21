const express = require ("express");
const mongoose = require('mongoose');
const router = express.Router();
//const Listing = require('../models/listing.js');

const Listing = require('../models/listing.js');


const { asyncHandler } = require("../utils/errorHandler.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateListing, validateListingUpdate, validateId } = require("../utils/validateSchema.js");
const { isLoggedIn } = require("../middleware.js");

const listingsController = require('../controllers/listings.js');

const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage: storage });
// If you want to store files locally instead of Cloudinary, use this line instead
//const upload = multer({ dest: 'uploads/' });



// Test route for file upload (can be removed if not needed)
// router.post('/test-upload', upload.single('image'), (req, res) => {
//     console.log(req.file); // Information about the uploaded file
//     res.send('File uploaded successfully');
// });


// const { index } = require("../controllers/listings.js");

// GET /listings -> list all
router.get("/", asyncHandler(listingsController.index));

// GET /listings/new -> new form (must be before :id)
router.get("/new", isLoggedIn, listingsController.renderNewForm);

// POST /listings -> create
router.post("/", isLoggedIn, upload.fields([
    { name: 'listing[image]', maxCount: 1 },
    { name: 'gallery', maxCount: 5 },
    { name: 'sportsImage', maxCount: 1 }
]), validateListing, asyncHandler(listingsController.createListing));


// GET /listings/:id -> show (must be after /new)
router.get("/:id", validateId, asyncHandler(listingsController.showlisting));

// GET /listings/:id/edit -> edit form
router.get("/:id/edit", isLoggedIn, validateId, asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError("Invalid listing ID", 400);
    }
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }
    res.render("listings/edit", { listing, layout: "layouts/boilerplate" });
}));

// PUT /listings/:id -> update
router.put("/:id",isLoggedIn, validateId, upload.fields([
    { name: 'listing[image]', maxCount: 1 },
    { name: 'gallery', maxCount: 5 },
    { name: 'sportsImage', maxCount: 1 }
]), validateListingUpdate, asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError("Invalid listing ID", 400);
    }
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }
    
    // Handle image uploads for update
    if (req.files && req.files['listing[image]'] && req.files['listing[image]'][0]) {
        listing.image = { 
            url: req.files['listing[image]'][0].path, 
            filename: req.files['listing[image]'][0].filename 
        };
        await listing.save();
    }
    
    // Handle gallery images upload (if exists)
    if (req.files && req.files.gallery) {
        listing.gallery = req.files.gallery.map(file => ({
            url: file.path,
            filename: file.filename
        }));
        await listing.save();
    }
    
    // Handle sports image upload (if exists)
    if (req.files && req.files.sportsImage && req.files.sportsImage[0]) {
        if (!listing.services) listing.services = {};
        if (!listing.services.sports) listing.services.sports = {};
        listing.services.sports.image = {
            url: req.files.sportsImage[0].path,
            filename: req.files.sportsImage[0].filename
        };
        await listing.save();
    }
    
    res.redirect(`/listings/${id}`);
}));

// DELETE /listings/:id -> delete
router.delete("/:id", isLoggedIn, validateId, asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError("Invalid listing ID", 400);
    }

    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        throw new ExpressError("Listing not found", 404);
    }

    // If it's an AJAX/JSON request, respond with JSON so frontend can update without full reload
    if (req.xhr || req.accepts('json')) {
        return res.json({ success: true, id });
    }

    req.flash('success', 'Listing deleted successfully');
    res.redirect('/listings');
}));

module.exports = router;