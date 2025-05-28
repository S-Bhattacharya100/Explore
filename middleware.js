const Listing = require("./model/listing");
const Review = require("./model/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./validationSchema");
const { reviewSchema } = require("./validationSchema");

module.exports.isLoggedin = (req, res, next) => {
    if (! req.isAuthenticated()) {
        // req.originalUrl contains the absolute path to the target url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
}

// Using local variable to make it accessable for "/login" route
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { _id } = req.params;
    let listing = await Listing.findById(_id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/listing/${_id}`);
    }
    next();
}

// Error handling middleware for listing
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Error handling middleware for review
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { _id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/listing/${_id}`);
    }
    next();
}