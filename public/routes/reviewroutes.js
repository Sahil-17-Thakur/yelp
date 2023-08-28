const express = require('express');
const {reviewJoiSchema} = require('../../joiSchema.js');
const {validateJoiSchema,validateJoiReviewSchema} = require('../../joiSchema.js');
const catchAsync = require('../../utils/catchAsync.js');
const router = express.Router({mergeParams: true});
const Review = require('../../models/review.js')
const Campground = require('../../models/campground.js');
const { isLoggedin } = require('../../authMiddleware.js');
const review = require('../../controller/review.js')


router.post('/',isLoggedin, validateJoiReviewSchema, catchAsync(review.addReview));

router.delete('/:reviewId', catchAsync(review.deleteReview));

  module.exports = router;