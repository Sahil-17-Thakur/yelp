if(process.env.NODE_ENV != "production"){
   require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodoverride = require('method-override')

const camproutes = require('./public/routes/camproutes')
const reviewroutes = require('./public/routes/reviewroutes.js')
const  userroutes = require('./public/routes/user')

const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const multer = require('multer');
const helmet = require('helmet');
var upload = multer({dest: 'uploads/'})

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp', 
  {useNewUrlParser: true, 
  useUnifiedTopology: true,
  })
.then(()=>{
    console.log("Connected");

})
.catch(err =>{
    console.log("ERROR!!");
    console.log(err);
}) 
 app.engine('ejs', ejsMate)
 app.set('view engine', 'ejs');
 app.set ('views', path.join(__dirname, 'views'))
 app.use(express.urlencoded({extended: true}))
 app.use(methodoverride('_method'))
 

app.use(express.static(path.join(__dirname, 'public')));
 
const sessionConfig = {
   name: 'sess',
   secret: 'secret',
   resave: false,
   saveUninitialized: false,
   cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
   }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
   "https://stackpath.bootstrapcdn.com/",
   "https://api.tiles.mapbox.com/",
   "https://api.mapbox.com/",
   "https://kit.fontawesome.com/",
   "https://cdnjs.cloudflare.com/",
   "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
   "https://kit-free.fontawesome.com/",
   "https://stackpath.bootstrapcdn.com/",
   "https://api.mapbox.com/",
   "https://api.tiles.mapbox.com/",
   "https://fonts.googleapis.com/",
   "https://use.fontawesome.com/",
];
const connectSrcUrls = [
   "https://api.mapbox.com/",
   "https://a.tiles.mapbox.com/",
   "https://b.tiles.mapbox.com/",
   "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
   helmet.contentSecurityPolicy({
       directives: {
           defaultSrc: [],
           connectSrc: ["'self'", ...connectSrcUrls],
           scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
           styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
           workerSrc: ["'self'", "blob:"],
           objectSrc: [],
           imgSrc: [
               "'self'",
               "blob:",
               "data:",
               "https://res.cloudinary.com/daxwg4yk1/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
               "https://images.unsplash.com/",
           ],
           fontSrc: ["'self'", ...fontSrcUrls],
       },
   })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flash middleware ->
 app.use((req,res,next)=>{
   
   res.locals.currentUser = req.user;
   res.locals.messages = req.flash('success');
   res.locals.error = req.flash('error');
   next();
 })

 //home page route
 app.get('/', (req , res)=>{
   
   res.render('home') 
 });

// routes
 app.use('/campgrounds', camproutes);
 app.use('/campgrounds/:id/reviews', reviewroutes);
 app.use('/', userroutes);
 


 app.all('*', (req,res,next)=>{
  next(new ExpressError("Page not found", 401));
 })

 app.use((err,req,res,next)=>{
   const {statusCode = 500} = err;
   if(!err){
      err.message = 'ERROR!! Something Went Wrong!! ';
   }
   res.status(statusCode).render('error',{err});
 })
 

 app.listen(4000, ()=>{
    console.log('listening on 4000');
 })

