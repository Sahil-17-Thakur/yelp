const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const catchAsync = require('../../utils/catchAsync');
const passport = require('passport');
const { urlStoreTo } = require('../../authMiddleware.js');

router.get('/register', (req,res)=>{
    res.render('users/register')
})

router.post('/register', async(req,res)=>{
    try{
    const {username, email , password} = req.body;
    const user = new User({email , username})
   const registeredUser = await User.register(user, password);
   req.login(registeredUser, err=>{
    if(err) return next(err);
    req.flash('success', 'Welcome to GoCamp');
    res.redirect('/campgrounds');
   })
  
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
})

router.get('/login', (req, res)=>{
    res.render('users/login'); 
})
router.post('/login',urlStoreTo, passport.authenticate('local', {failureFlash: true , failureRedirect: '/login'} ) , (req, res)=>{
req.flash('success', 'Welcome Back!!');
const redirectUrl = res.locals.urlValue || '/campgrounds';
res.redirect(redirectUrl);
})

router.get('/logout', (req,res)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    req.flash('success', "Logged Out!");
    res.redirect('/campgrounds');
    })
})

module.exports = router;