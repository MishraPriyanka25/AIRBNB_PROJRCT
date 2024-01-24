//const { json } = require("express");
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpresError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn= (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res , next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
        let listing = await Listing.findById(id);
        if(!listing.owner._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You don't have access to edit!");
            return res.redirect(`/listings/${id}`);
        }
        next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpresError(400, error);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpresError(400, error);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
        let review = await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You don not author of this review");
            return res.redirect(`/listings/${id}`);
        }
        next();
};
