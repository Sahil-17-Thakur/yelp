const cities = require('./cities')
const {places , descriptors} = require('./seedHelpers')
const Campground = require('../models/campground')

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("Connected");

})
.catch(err =>{
    console.log("ERROR!!");
    console.log(err);
})
const seedArr = (arr)=> arr[Math.floor(Math.random()*arr.length)];

const seedDb = async()=>{
    await Campground.deleteMany({});
    for(let i=0; i<=300; i++){
        const randNum = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*1000)+30
        const camp = new Campground({
            location: `${cities[randNum].city}, ${cities[randNum].state}`,
            title: `${seedArr(descriptors)} ${seedArr(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium enim sunt tempore ipsam explicabo debitis earum? Tempore inventore officia aliquid alias architecto ullam eum, repellendus, exercitationem quos dolor perspiciatis! Sunt!',
            price,
            author: "649ff856cd5950c0934dedc8",
            geometry:{
                type:"Point",
                coordinates: [ 
                    cities[randNum].longitude,
                    cities[randNum].latitude
                 ]
            },
            images: [
            {
                url: 'https://res.cloudinary.com/daxwg4yk1/image/upload/v1688470325/YelpCamp/f7osjzx9zhvziwhozsjw.jpg',       
                filename: 'YelpCamp/f7osjzx9zhvziwhozsjw',
            },
            {
                url: 'https://res.cloudinary.com/daxwg4yk1/image/upload/v1688470326/YelpCamp/qmvvujbkeohtkrnmusv0.jpg',       
                filename: 'YelpCamp/qmvvujbkeohtkrnmusv0',
            }

            ]

        })
       await camp.save();
    }
   
}
seedDb();