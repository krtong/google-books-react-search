const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: {type: String, required: true},
    author: String,
    description: String,
    link: String, 
    image: String,
});

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;