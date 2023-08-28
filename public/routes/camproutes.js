const express = require('express');
const path = require('path');
const {joiSchema} = require('../../joiSchema.js');
const {validateJoiSchema, validateJoiReviewSchema} = require('../../joiSchema.js');
const router = express.Router({mergeParams: true});
const catchAsync = require('../../utils/catchAsync.js');
const Campground = require('../../models/campground.js')
const Review = require('../../models/review.js');
const { isLoggedin } = require('../../authMiddleware.js');
const { equal } = require('joi');
const campground = require('../../controller/campground.js')
const {storage} = require('../../cloudinary')
const multer = require('multer');
var upload = multer({storage});



router.get('/', catchAsync(campground.allCamps))
router.post('/',upload.array('images'),validateJoiSchema ,catchAsync(campground.allCampsPost));

 

 router.get('/new', isLoggedin, campground.addCamps);


 

router.get('/:id', catchAsync(campground.showCamp));

router.get('/:id/edit', isLoggedin,catchAsync(campground.editCampGet));

router.put('/:id',isLoggedin, upload.array('images'),validateJoiSchema, catchAsync(campground.editCampPost));



router.delete('/:id',isLoggedin, catchAsync(campground.deleteCamp));

module.exports = router;