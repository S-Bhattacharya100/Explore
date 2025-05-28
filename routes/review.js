const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../model/review");
const Listing = require("../model/listing");
const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/review");

// post route for reviews
router.post("/reviews", isLoggedin, validateReview, wrapAsync(reviewController.createReview));

// Delete route for reviews
router.delete("/review/:reviewId", isLoggedin, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;