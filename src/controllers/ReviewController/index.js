const createReviews = require("./createReviews");
const getBookReviews = require("./getBookReviews");
const getUserReview = require("./getUserReview");
const updateReview = require("./updateReview");
const deleteReview = require("./deleteReview");
const giveReviewALike = require("./giveReviewALike");


module.exports = {
    createReviews,
    getBookReviews,
    getUserReview,
    updateReview,
    deleteReview,
    giveReviewALike
}