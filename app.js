let express = require("express");
let app = express();

let bodyParser = require("body-parser");
let mongoose = require("mongoose");
methodOverride = require("method-override")
//APP CONFIG
mongoose.connect("mongodb://localhost:27017/blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//MONGODB MODELLING
let blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    image: String,
    created: { type: Date, default: Date.now }

})

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "First Blog Post",
//     body: "My first blog post. Yahh!!",
//     image: "https://pixabay.com/get/e83db50a2ff5083ed1584d05fb1d4e97e07ee3d21cac104491f3c77da5e5b1ba_340.jpg",

// }, function (err, newlyCreated) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("New Blog post:");
//         console.log(newlyCreated);
//     }
// })

//RESTFUL ROUTES
app.get("/", function (req, res) {
    res.redirect("/blogs");
})


app.get("/blogs", function (req, res) {

    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err);
        } else {
            //console.log("Blogs found: " + blogs)
            res.render("index", { exportBlog: blogs });
        }
    });

});

app.get("/blogs/new", function (req, res) {
    res.render("new");
})


app.post("/blogs", function (req, res) {
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            console.log(err);
            res.render("new")
        }

        else {
            console.log("new post created: " + newBlog);
            res.redirect("/blogs");


        }
    });



});


app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log(err);
            res.redirect("/blogs")
        }
        else {
            res.render("show", { blog: foundBlog })
            console.log("found: " + foundBlog)
        }
    });

});

app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log("not found");
            res.redirect("/blogs");
        }

        else {
            console.log("found " + foundBlog);
            res.render("edit", { blog: foundBlog });
        }
    })

});

//update blog post

app.put("/blogs/:id", function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updated) {
        if (err) {
            console.log(err);
        }

        else {
            console.log("updated " + updated);
            res.redirect("/blogs/" + req.params.id)
        }
    })

    //res.send("Update ROUTE!")

});

//delete route

app.delete("/blogs/:id", function (req, res) {

    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log("could not delete")
        }

        else {
            res.redirect("/blogs")
        }
    })
    // res.send("Destroy Route");
})


app.listen(3000, "localhost", function (ip) {
    console.log("server is running on port 3000 ")
})


