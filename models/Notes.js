const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema ({
    //title: String,
    body: String
    // ,
    // article_id: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Articles"
    // }
});

const Notes = mongoose.model("Notes", NoteSchema);
module.exports = Notes;
