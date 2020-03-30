import axios from "axios";

export default { 
   // Searches the NYT books according to the search criteria given in the form
  getNewBooks: function(title) {
    return axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}`);
  },
  // Gets all books
  getBooks: function() {
    console.log("getBooks")
    return axios.get("/api/books");
  },
  // Gets the book with the given id
  getBook: function(id) {
    
    console.log("getBook", id)
    return axios.get("/api/books/" + id);
  },
  // Deletes the book with the given id
  deleteBook: function(id) {
    
    console.log("deleteBook", id)
    return axios.delete("/api/books/" + id);
  },
  // Saves a book to the database
  saveBook: function(bookData) {
    
    console.log("saveBook", bookData)
    return axios.post("/api/books", bookData);
  }
};
