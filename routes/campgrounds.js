var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var middleware=require("../middleware")

//campgrounds route(index)
router.get("/",function(req,res){
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err)
		}
		else 
			res.render("campgrounds/index",{campgrounds:allcampgrounds});
	});
});
//creating campgrounds route
router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var description=req.body.description
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newCampground={name:name,price:price,image:image,description:description,author:author};
	//create a new campground to save to db
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
		//redirect to campground pages
		req.flash("success","Campground added Successfully")
		res.redirect("/campgrounds/"+newlyCreated._id);
		}
	});
});
//new route
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
})
//show route
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err|| !foundCampground){
			req.flash("error","Campground not found");
			res.redirect("back");
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
//edit campground route
router.get("/:id/edit",middleware.isAuthorised,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
				res.render("campgrounds/edit",{campground:foundCampground});
		
});
});
//update campground route
router.put("/:id",middleware.isAuthorised,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			req.flash("error","You don't have permission");
			res.redirect("/campgrounds/"+req.params.id);
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
//destroy campground route
router.delete("/:id",middleware.isAuthorised,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			req.flash("success","Campground deleted");
			res.redirect("/campgrounds");
		}
	});
});


module.exports=router;