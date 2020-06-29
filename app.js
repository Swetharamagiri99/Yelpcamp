var express			=require("express"),
	app				=express(),
	bodyParser		=require("body-parser"),
	passport		=require("passport"),
	LocalStrategy	=require("passport-local"),
	mongoose		=require("mongoose"),
	flash			=require("connect-flash"),
	Campground		=require("./models/campground"),
	Comment			=require("./models/comment"),
	User 			=require("./models/user.js"),
	seedDB			=require("./seeds"),
	methodOverride	=require("method-override");
var	commentRoutes		=require("./routes/comments"),
	campgroundRoutes	=require("./routes/campgrounds"),
	authRoutes			=require("./routes/auth"),
    reviewRoutes     	= require("./routes/reviews");

/*mongoose.connect("mongodb+srv://swetharamagiri:kcEupqhkjmuFYvye@cluster0-r66ka.mongodb.net/<dbname>?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});*/

//mongoose.connect("mongodb+srv://swetharamagiri:<password>@cluster0-r66ka.mongodb.net/<dbname>?retryWrites=true&w=majority")
mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
		secret:"good morning",
		resave:false,
		saveUninitialized:false
		}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

//requiring routes
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(authRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);


var port = process.env.PORT || 3000;
app.listen(port,process.env.IP, function () {
  console.log("Server Has Started!");
});