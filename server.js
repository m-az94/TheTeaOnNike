//---- Declare Dependencies ----
const express = require("express");
const handlebars = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
const PORT = 3001;

//--- Initialize Express and Configure Middleware ----
const app = express();
app.use(logger("dev"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars",handlebars({defaultLayout:"main"}));
app.set("view engine", "handlebars");

//--- Connect to mLab on Heroku ---
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

//---- API Routes ----
app.get("/scrape", (req,res) => {
    //---- Scrape Data from Nike ----
    axios.get("https://store.nike.com/ca/en_gb/pw/mens-shoes/7puZoi3?ipp=120").then(function(response){
        let $ = cheerio.load(response.data);
        let results = [];
        $("div.grid-item").each(function(i, element){
            var product_url = $(element).find("div.grid-item-box").find("div.grid-item-content").find("div.grid-item-image").find("div.grid-item-image-wrapper").find("a").attr("href");
            var product_img = $(element).find("div.grid-item-box").find("div.grid-item-content").find("div.grid-item-image").find("div.grid-item-image-wrapper").find("a").find("img").attr("src");
            var product_name = $(element).find("div.grid-item-box").find("div.grid-item-content").find("div.grid-item-info").find("div.product-name").find("p.product-display-name").text();
            var product_price = $(element).find("div.grid-item-box").find("div.grid-item-content").find("div.grid-item-info").find("div.product-price").find("div.prices").find("span.local").text();

            results.push({
                link: product_url,
                image: product_img,
                name: product_name,
                price: product_price
            });
        });

        //---- Create New Articles Using Results from Scraping ----
        db.Articles.create(results)
        .then(dbArticles => console.log(dbArticles))
        .catch(err => console.log(err));
    });
    res.send("Scrape Complete");
});

//---- Getting All Articles from db ----
app.get("/articles", (req, res) => {
    db.Articles.find({})
    .then(dbArticles=>res.json(dbArticles))
    .catch(err => res.json(err));
});

//---- Getting One Article from db ----
app.get("/articles/:id", (req, res) => {
    db.Articles.findOne({_id:req.params.id})
    .populate("Notes")
    .then(dbArticles => res.json(dbArticles))
    .catch(err => res.json(err));
});

//---- Getting all Notes ----
app.get("/notes", (req, res) =>{
    db.Notes.find({})
    .then(dbNotes => res.json(dbNotes))
    .catch(err => res.json(err));
});

//---- Saving Article Associated with Note ---
app.post("/articles/:id", (req, res) =>{
    db.Notes.create(req.body)
    .then(dbNotes => db.Articles.findOneAndUpdate(
        {_id: req.params.id},
        {notes: dbNotes._id}
    )).then( dbArticles => res.json(dbArticles))
    .catch(err => res.json(err));
});

//---- Delete all Notes from Article db ----
app.delete("articles/:id", (req, res) => {
    db.Articles.findOneAndUpdate(
        {_id: req.params.id}, 
        {$unset:{notes: 1}}
    ).then(dbArticles => res.json(dbArticles))
    .catch( err => res.json(err));
});

//---- Delete One Note from Notes db ----
app.delete("/notes/:id", (req, res) => {
    db.Notes.remove({_id: req.params.id})
    .then(dbNotes => res.json(dbNotes))
    .catch(err => res.json(err));
});

//---- Start Server ----
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });