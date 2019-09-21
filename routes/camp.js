var express =       require("express"),
router=             express.Router(),
Campground=               require("../models/campground");

router.get('/', function(req, res){

    Campground.find({}, function(err, campgrounds){

        if(err){
            console.log('error with get')
        }else{
            console.log('get request, "/" ')
            res.render('landing', { campgrounds })
        }
    
    })
    

})

//CREATE
router.post('/campgrounds', isLoggedIn, function(req, res){
    var name = req.sanitize(req.body.name);
    var desc = req.sanitize(req.body.desc);
    var img =  req.sanitize(req.body.img);
    console.log(req.body, '<----what???');

    var newCampground = {
        name: name, 
        desc: desc, 
        img: img,
        author:{
            id: req.user._id,
            username: req.user.username
        }
    }

    Campground.create(newCampground , function(err, cat){
        if(err){
            console.log('error with post', err)
        }else{
            console.log('obj created in post requesst NEW', cat)
            res.redirect('/')
        }
    
    })

}) 

//EDIT
router.get('/campgrounds/:id/edit', function(req, res){

    var campId = req.params.id;

    var campId = req.params.id;
    Campground.findById(campId, function(err, camp){
        if(err){
            console.log('error with get')
        }else{
            console.log('get ith id')
            res.render('campgrounds/edit', {camp})
        }
    })

})
//UPDATE
router.put('/campgrounds/:id', function(req, res){
    console.log(req.body.camp, '<--camp here')

    var campId = req.params.id;

    var name = req.sanitize(req.body.camp.name);
    var desc = req.sanitize(req.body.camp.desc);
    var img =  req.sanitize(req.body.camp.img);

    var data = {
        name: name, 
        desc: desc, 
        img: img,

    }

    Campground.findByIdAndUpdate(campId, data, function(err, updateCamp){
        if(err){
            console.log('error with get')
        }else{
            console.log('obj updated')
            res.redirect('/campgrounds/'+ campId)
        }
    })
})

//DELETE
router.delete('/campgrounds/:id', function(req, res){

    var campId = req.params.id;

    Campground.findByIdAndDelete(campId, function(err, deletedCamp){
        if(err){
            console.log('error with get')
        }else{
            console.log('obj deleted')
            res.redirect('/')
        }
    })
})

//NEW
router.get('/campgrounds/new',isLoggedIn,  function(req, res){

    res.render('campgrounds/new')

})

//SHOW
router.get('/campgrounds/:id', function(req, res){
    var campId = req.params.id;
    Campground.findById(campId).populate('comments').exec(function(err, foundCamp){
        
        if(err){
            console.log('error with get', err)
        }else{
            console.log(foundCamp)
            res.render('campgrounds/show', {foundCamp})
        }
    })

})

router.get('*', function(req, res){
    
    res.send("<h1>You're a star</h1>");

})

function isLoggedIn(req, res, next){
    console.log(req.isAuthenticated(), '<----')
    if(req.isAuthenticated()){

       return next();
    }
    res.redirect('/login')
    
}

module.exports = router;