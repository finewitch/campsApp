var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
        // console.log(req.isAuthenticated(), '<----')
        if(req.isAuthenticated()){
    
           return next();
        }
        req.flash("info", "Please login first");
        res.redirect('/login')
        
    }

module.exports = middlewareObj