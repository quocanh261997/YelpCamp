var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

//SCHEMA SETUP
var pokeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var poke = mongoose.model("PokeGround", pokeSchema);

// poke.create({
//     name: "Charlizard",
//     image: "https://i.kinja-img.com/gawker-media/image/upload/s--EHhoxyRC--/c_scale,f_auto,fl_progressive,q_80,w_800/jiboywz6xnq7yinpvahb.png",
//     description: "The best starter pokemon ever!"
// }, function(err, poke) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("NEWLY CREATED POKEMON");
//         console.log(poke);
//     }
// });

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    //Get all pokegrounds from DB
    poke.find({}, function(err, allPoke) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                poke: allPoke
            });
        }
    });
});

app.post("/campgrounds", function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    //redirect back to campgrounds page
    var newPoke = {
        name: name,
        image: image,
        description: description
    };
    //Create a new poke and save to a database
    poke.create(newPoke, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //Redirect back to campground
            res.redirect("/campgrounds");
        }
    });
});


app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

//Show more info about one pokemon
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID
    poke.findById(req.params.id,function(err, foundPoke){
      if (err) console.log(err);
      else {
        res.render("show",{ poke: foundPoke});
      }
    });
});

app.listen(3000, function() {
    console.log("Server has started");
});
