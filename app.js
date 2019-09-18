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

//ROUTES
var authRoutes =require("./routes/auth"),
commentRoutes=  require("./routes/comments"),
campRoutes=     require("./routes/camp");

// seedDB();
mongoose.connect("mongodb://localhost/campgroups", 
{ useNewUrlParser: true,
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

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})

app.use(authRoutes);
app.use(commentRoutes);
app.use(campRoutes);


passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.listen(3000, function(){
        console.log('server runs')
})