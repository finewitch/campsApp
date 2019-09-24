var express =       require("express"),
router=             express.Router(),
User=               require("../models/user"),
passport =          require("passport");


router.get('/secret', function(req, res){
    res.send('secret')
})



//LOGIN========//
router.get('/login', function(req, res){
    
    res.render('user/login')
})
router.post('/login', passport.authenticate("local", {
    successRedirect : "/",
    failureRedirect : "/login",
    failureFlash: true,
    failureFlash: 'Invalid username or password',
    successFlash: 'Succesfully loged in'
}),   function(req, res){
    console.log('POST LOGIN')
    // res.render('user/register')
})


//REGISTER=======//

router.get('/register', function(req, res){
    res.render('user/register')
})
router.post('/register', function(req, res){
    console.log(req.body.user, 'in register')

    User.register(new User({username: req.body.username}), req.body.password ,function(err, user){
        if(err){
            console.log('error in user registration', err)
            return res.render('user/register')
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect('/')
            })
            // console.log(user)
        }
    })
    // res.render('user/register')
})

//LOGOUT =======//
router.get('/logout', function(req, res){
    req.logout();
    req.flash("info", "You've log out");
    res.redirect('/')
})

module.exports = router;