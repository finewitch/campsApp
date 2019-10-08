var express =       require("express"),
expressSanitizer =  require("express-sanitizer"),
mongoose =          require("mongoose"),
passport =          require("passport"),
LocalStrategy =     require("passport-local"),
methodOverride =    require("method-override"),
bodyParser =        require("body-parser"),
flash =             require("connect-flash"),
session =           require('express-session');
MongoStore =        require('connect-mongo')(session);

Campground=         require("./models/campground"),
Comment=            require("./models/comment"),
User=               require("./models/user"),
seedDB=             require("./seeds");

//ROUTES
var authRoutes =require("./routes/auth"),
commentRoutes=  require("./routes/comments"),
campRoutes=     require("./routes/camp");

// seedDB();

var mode,
    port,
    db;

//---------------SET THE MODE -------------//

mode = 'prod'

    if(mode === 'dev'){
        db = 'mongodb://localhost/campgroups';
        port = 3000;
    }else{
        db = process.env.MONGOLAB_URI;
        port = process.env.PORT;
    }

mongoose.connect( db , 
    {   useNewUrlParser: true, 
        useUnifiedTopology: true }
    )
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err}`));

app = express();

app.use(session(
    {
        secret : 'abracadabra',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    }
))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended : true}))
app.use(expressSanitizer())
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))

app.use(function(req,res,next){

    res.locals.currentUser = req.user;
    res.locals.info = req.flash("info");
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    // console.log('here', currentUser)

    next();

})

app.use(authRoutes);
app.use(commentRoutes);
app.use(campRoutes);

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.listen(port, function(){
        console.log('server runs')
})