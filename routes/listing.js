const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../model/listing");
const {isLoggedin, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
// The photo will be uploaded to cloudinary from multer
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// Combaining index route and create route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedin, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

// New route should be declared before show route to avoid conflict between them

// New route
router.get("/new", isLoggedin, listingController.renderNewForm);

// Combaining show route, edit route and destroy route
router.route("/:_id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedin, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedin, isOwner, wrapAsync(listingController.destroyListing));

// Edit form serving route
router.get("/:_id/edit", isLoggedin, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;