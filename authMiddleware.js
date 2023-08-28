module.exports.isLoggedin = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
     req.flash('error', 'Please Log in First');
     return res.redirect('/login');
    }
    next();
}

module.exports.urlStoreTo = (req, res, next)=>{
    if(req.session.returnTo){
        res.locals.urlValue = req.session.returnTo;
    }
    next();
}