//---- Declaring Dependencies ----
const express = require("express");
const handlebars = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
// const db = require("./models");
const PORT = 3000;

//--- Initializing Express and Configuring Middleware ----
const app = express();
app.use(logger("dev"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars",handlebars({defaultLayout:"main"}));
app.set("view engine", "handlebars");

//--- Connecting to mLab on Heroku ---
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

//---- Routes ----

app.get("/scrape", function(req,res){
    //---- Scraping Data ----
    axios.get("https://store.nike.com/ca/en_gb/pw/mens-shoes/7puZoi3?ipp=120").then(function(response){
        let $ = cheerio.load(response.data);
        let results = [];
        $("div.grid-item").each(function(i, element){
            var product_url = $(element).find("div.grid-item-box").find("div.grid-item-content").find("div.grid-item-image").find("div.grid-item-image-wrapper").find("a").attr("href");
            var product_img = $(element).find("div.grid-item-box").find("div.grid-item-content").find("div.grid-item-image").find("div.grid-item-image-wrapper").find("a").find("img").attr("src");
            var product_name = $(element).find("div.grid-item-box").find("div.grid-item-content").find("div.grid-item-info").find("div.product-name").find("p.product-display-name").text();
            var product_price = $(element).find("div.grid-item-box").find("div.grid-item-content").find("div.grid-item-info").find("div.product-price").find("div.prices").find("span.local").text();

            results.push({
                url: product_url,
                img: product_img,
                name: product_name,
                price: product_price
            });
        });
    console.log(results);
    // need to push them into db after models are made
    });
});