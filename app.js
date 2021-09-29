var express   	  = require("express"),
	bodyParser    = require("body-parser"),
	mongoose      = require("mongoose"),
	flash         = require("connect-flash"),
	passport      = require("passport"),
	localStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground    = require("./models/campground"),
	Comment       = require("./models/comment"),
	User          = require("./models/user"),
	seedDB        = require("./seeds");

var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
	authRoutes       = require("./routes/index");	

var app = express();
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v12";
mongoose.connect(url,{
	useNewUrlParser:true,
	useUnifiedTopology:true
})
.then(() => console.log("Connected to DB!"))
.catch(error => console.log(error.message));
// seedDB();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "abcd1234",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(authRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("YelpCamp server has started");
});