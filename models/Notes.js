const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema ({
    title: String,
    body: String
});

const Notes = mongoose.model("Notes", NoteSchema);
module.exports = Notes;
