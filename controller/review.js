const Campground = require('../models/campground');
const Review = require('../models/review.js');

module.exports.addReview = async(req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    const {review ,rating} = req.body;
    
    const revu = new Review({review,rating})
    revu.author = req.user._id;
     camp.reviews.push(revu);
      await camp.save();
     await revu.save();
     req.flash('success', 'Review submitted successfully');
     res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const {id} = req.params;
    const {reviewId} = req.params;
    const camp = Campground.findById(id);
  
     await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
    
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/campgrounds/${id}`)
}