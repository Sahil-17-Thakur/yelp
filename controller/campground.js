const Campground = require('../models/campground');
const Review = require('../models/review.js');
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

 
module.exports.allCamps = async (req, res)=>{
    const campLists = await Campground.find({})
    res.render('campgrounds/allCamps', {campLists})
}

module.exports.addCamps = async (req , res)=>{
    res.render('campgrounds/addCamp');
}

module.exports.allCampsPost = async(req,res)=>{
   const geodata = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    })
    .send()
   
  const newCamp =  new Campground(req.body)
  newCamp.geometry = geodata.body.features[0].geometry;
  newCamp.images = req.files.map(f => ({url: f.path, filename: f.filename}))
  newCamp.author =  req.user._id;

 await newCamp.save();
 console.log(newCamp);
 req.flash('success' ,'successfully made a new camp');
 res.redirect(`/campgrounds/${newCamp._id}`)
}

module.exports.showCamp = async(req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id).populate
    ({path : 'reviews',
    populate: {
       path: 'author'
    }
    }).populate('author')
  
   
    if(!camp){
       req.flash('error', 'Campground not Found!!!')
       res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {camp})
}

module.exports.editCampGet = async(req,res)=>{
   
   const {id} = req.params;
   
   const camp = await Campground.findById(id)
   if(!req.user._id.equals(camp.author._id)){
    req.flash('error', 'Cannot edit this, you dont have permission!!')
    return res.redirect(`/campgrounds/${camp._id}`)
  }
   res.render('campgrounds/edit',{camp})
}

module.exports.editCampPost = async(req,res)=>{
  
    
    const {id} = req.params;
    const editCamp = await Campground.findByIdAndUpdate(id,{...req.body})

   const img = req.files.map(f=>({url: f.path, filename: f.filename}))
   editCamp.images.push(...img);
   
   await editCamp.save();

if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
    }
    await editCamp.updateOne({ $pull: {images: {filename: { $in: req.body.deleteImages}}}})
} 
  
   req.flash('success', 'Successfully Updated Campground');
   res.redirect(`/campgrounds/${editCamp._id}`);
  
}

module.exports.deleteCamp = async(req,res)=>{
    const {id} = req.params
    const camp = await Campground.findById(id);
   const revId = camp.reviews;
     
   await Campground.findByIdAndDelete(id , {$pullAll: {reviews: camp.id}});
    for(let a of revId){
   await Review.findByIdAndDelete(a._id)
    }
    req.flash('success', 'Successfully Deleted Campground!!!')
     res.redirect(`/campgrounds`);
}