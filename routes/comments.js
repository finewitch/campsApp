var express =       require("express"),
router=             express.Router(),
Campground=               require("../models/campground");
Comment=               require("../models/comment");



router.get('/campgrounds/:id/comments/new', isLoggedIn,  function(req, res){
    var campId = req.params.id;
    Campground.findById(campId).populate('comments').exec(function(err, camp){
        if(err){
            console.log('error with get', err)
        }else{
            console.log(camp)
            res.render('comments/new', {camp})
        }
    })
})

router.post('/campgrounds/:id/comments', function(req, res){
    var campId = req.params.id;
    Campground.findById(campId).populate('comments').exec(function(err, camp){
        if(err){
            console.log('error in comment, find by id', err)
        }else{
            console.log(camp, 'camp founded!!!')
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log('err from comment', err);
                }else{
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect('/campgrounds/' + campId)
                }
            })
        }
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){

       return next();
    }
    res.redirect('/login')
    
}

module.exports = router;