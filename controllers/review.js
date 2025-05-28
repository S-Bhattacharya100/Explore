const Listing = require("../model/listing");
const Review = require("../model/review");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params._id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created");
    res.redirect(`/listing/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { _id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(_id, {$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listing/${_id}`);
}