const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema ({
    name: {
        type: String, 
        required: true
    },
    link:{
        type: String,
        required: true 
    },
    image: {
        type: String,
        required: true
    },
    price:{
        type:String,
        required: true
    }
});