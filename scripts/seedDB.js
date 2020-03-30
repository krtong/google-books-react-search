
const mongoose = require("mongoose");
const db = require("../models");

// This file empties the Books collection and inserts the books below

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/reactreadinglist"
);

const bookSeed =[{
    title: "The Test Book",
    author: "Mikael Krogerus",
    description: "An essential library of tests for self-knowledge a…ick, fun way to evaluate your life and happiness.",
    image: "http://books.google.com/books/content?id=lPV1CQAAQ…=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
    _id: "lPV1CQAAQBAJ"
}];

db.Book
  .remove({})
  .then(() => db.Book.collection.insertMany(bookSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
