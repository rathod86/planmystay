const express = require("express");

const { predictPrice } = require('../utils/pricePredictor.js');
const Listing = require('../models/listing.js');

const mbxGeoconding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_TOKEN;
const geocodingClien = mbxGeoconding({ accessToken: mapBoxToken });

const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
const mbxClient = require('@mapbox/mapbox-sdk');

module.exports.createListing = async (req, res) => {
    // Get features from form or logic
    const features = {
        demand: 80,
        event: 1,
        season: 2,
        competitor_price: 120
    };
    const aiPrice = await predictPrice(features);

    // Create listing with aiPrice
    const listingData = req.body.listing;
    listingData.aiPrice = aiPrice;
    const listing = new Listing(listingData);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
};


module.exports.index=async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index", { allListings, layout: "layouts/boilerplate" });
}

module.exports.renderNewForm=(req, res) => {
    res.render("listings/new", { layout: "layouts/boilerplate" });
};

module.exports.showlisting= async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", { listing, layout: "layouts/boilerplate" });

};

module.exports.renderEditForm= async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing, layout: "layouts/boilerplate" });
}

module.exports.createListingWithImage= async (req, res) =>{
    let url= req.file.path;
    let filename= req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url: url, filename: filename };
    await newListing.save();
    res.redirect("/listings");
}

module.exports.updateListing= async (req, res) => {

    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true, runValidators: true });

    if(typeof req.file !== 'undefined'){
        let url= req.file.path;
        let filename= req.file.filename;
        updatedListing.image = { url: url, filename: filename };
        await updatedListing.save();
    }
    res.redirect(`/listings/${updatedListing._id}`);
}
module.exports.deleteListing= async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}


