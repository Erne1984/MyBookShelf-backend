const createReviews = require("./createReviews");
const getBookReviews = require("./getBookReviews");
const getUserReview = require("./getUserReview");
const updateReview = require("./updateReview");
const deleteReview = require("./deleteReview");
const giveReviewALike = require("./giveReviewALike");
const classifyReview = require('./classifyReview');
const filterReviewsbyClassificition = require("./filterReviewsbyClassificition");


module.exports = {
    createReviews,
    getBookReviews,
    getUserReview,
    updateReview,
    deleteReview,
    giveReviewALike,
    classifyReview,
    filterReviewsbyClassificition
}