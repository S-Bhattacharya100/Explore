const Listing = require("../model/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { _id } = req.params;
    let listing = await Listing.findById(_id).populate({path: "review", populate: {path: "author"}}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found!");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()

    let url = req.file.path;
    let filename = req.file.filename;
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
    newlisting.geometry = response.body.features[0].geometry;
    let savedListing = await newlisting.save();
    console.log(savedListing);
    req.flash("success", "New listing created");
    res.redirect("/listing");
}

module.exports.renderEditForm = async (req, res) => {
    let {_id} = req.params;
    let listing = await Listing.findById(_id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { _id } = req.params;
    let listing = await Listing.findByIdAndUpdate(_id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        listing.save();
    }
    req.flash("success", "Listing updated");
    res.redirect(`/listing/${_id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { _id } = req.params;
    await Listing.findByIdAndDelete(_id);
    req.flash("success", "Listing deleted");
    res.redirect("/listing");
}