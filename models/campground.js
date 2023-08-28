const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = {toJSON: {virtuals: true}};

const campGroundSchema = new Schema({
 
    title: String,
    price: Number,
    images: [ImageSchema],
    geometry:{
        type: {
            type: String,
           enum: ['Point'],
           required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
     },
    description: String,
    location: String,

    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
             
        }
    ]
    
},opts);

campGroundSchema.virtual('properties.popUpMarkup').get(function (){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>
    <p>${this.description.substring(0,40)}...</p>`
})


const Campground = mongoose.model('Campground', campGroundSchema);

campGroundSchema.post('findOneAndDelete', async function(doc){
    
      if(doc){
        await Review.deleteMany({
            _id: {
                $in: data.reviews
            }
        })
      }
})
module.exports = Campground;