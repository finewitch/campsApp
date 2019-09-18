var express =       require("express"),
expressSanitizer =  require("express-sanitizer"),
mongoose =          require("mongoose"),
passport =          require("passport"),
LocalStrategy =     require("passport-local"),
methodOverride =    require("method-override"),
bodyParser =        require("body-parser"),

Campground=         require("./models/campground"),
Comment=            require("./models/comment"),
User=               require("./models/user"),
seedDB=             require("./seeds");

// seedDB();
mongoose.connect("mongodb://localhost/campgroups", { useNewUrlParser: true,
useUnifiedTopology: true })
 
app = express(),
app.use(require('express-session')(
    {
        secret : 'abracadabra',
        resave: false,
        saveUninitialized: false 
    }
))
app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended : true}))
app.use(expressSanitizer())
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))


passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



//REST - ROUTES
//INDEX
app.get('/', function(req, res){
    Campground.find({}, function(err, campgrounds){

        if(err){
            console.log('error with get')
        }else{
            console.log('get request, "/" ')
            res.render('landing', {campgrounds})
        }
    
    })
    

})

//CREATE
app.post('/campgrounds', function(req, res){
    var name = req.sanitize(req.body.name);
    var desc = req.sanitize(req.body.desc);
    var img =  req.sanitize(req.body.img);

    var newCampground = {name, desc, img}

    Campground.create(newCampground , function(err, cat){
        if(err){
            console.log('error with get')
        }else{
            console.log('obj created in post requesst')
            res.redirect('/campgrounds')
        }
    
    })

}) 

//EDIT
app.get('/campgrounds/:id/edit', function(req, res){

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
app.put('/campgrounds/:id', function(req, res){
    console.log(req.body)

    var campId = req.params.id;
    var data = req.body.camp;

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
app.delete('/campgrounds/:id', function(req, res){

    var campId = req.params.id;

    Campground.findByIdAndDelete(campId, function(err, deletedCamp){
        if(err){
            console.log('error with get')
        }else{
            console.log('obj deleted')
            res.redirect('/campgrounds')
        }
    })
})

//NEW
app.get('/campgrounds/new', function(req, res){

    res.render('campgrounds/new')

})

//SHOW
app.get('/campgrounds/:id', function(req, res){
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


//===============//
// COMMENTS ROUTES

app.get('/campgrounds/:id/comments/new', function(req, res){
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

app.post('/campgrounds/:id/comments', function(req, res){
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


//===============//
// USER ROUTES
app.get('/secret', function(req, res){
    res.send('secret')
})
//LOGIN========//
app.get('/login', function(req, res){
    console.log('/login')
    res.render('user/login')
})
app.post('/login', passport.authenticate("local", {
    successRedirect : "/secret",
    failureRedirect : "/login"
}),   function(req, res){
    console.log('POST LOGIN')
    // res.render('user/register')
})

//REGISTER=======//

app.get('/register', function(req, res){
    res.render('user/register')
})
app.post('/register', function(req, res){
    console.log(req.body.user)

    User.register(new User({username: req.body.user.name}), req.body.user.password ,function(err, user){
        if(err){
            console.log('error in user registration', err)
            return res.render('user/register')
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect('/secret')
            })
            console.log(user)
        }
    })
    // res.render('user/register')
})

app.get('*', function(req, res){
    
    res.send("<h1>You're a star</h1>");

})

app.listen(3000, function(){
        console.log('server runs')
})