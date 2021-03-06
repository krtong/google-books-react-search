import React, {useContext, useEffect, useState} from "react";
import DeleteBtn from "../components/DeleteBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import { LikeButton } from '../components/LikeButton';
import { BookContext } from '../context/BookContext';
import SaveBtn from "../components/SaveButton";

const Books = () => {
  const [formData, setFormData] = useState({
      title: "",
      toResults: false,
      results: []
  });
  const {books, setBooks} = useContext(BookContext);

  const loadBooks = () => {
    API.getBooks()
      .then(res => {
        setBooks(res.data)
      }
      )
      .catch(err => console.log(err));
  };

  useEffect(() => {
     if (books.length === 0) {
     loadBooks();
     }
   }, []);

  const deleteBook = id => {
    API.deleteBook(id)
      .then(res => {
        const remainingBooks = books.filter(book => book._id !== id);
        setBooks(remainingBooks);
      })
      .catch(err => console.log(err));
  };

  const incrementLikes = id => {
    console.log('id of book to increase likes', id, books);
    const indexToUpdate = books.findIndex(book => book._id === id);
    const newBooks = [...books];
    newBooks[indexToUpdate].likes = newBooks[indexToUpdate].likes ? newBooks[indexToUpdate].likes + 1 : 1;
    setBooks(newBooks);

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    })
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    if (formData.title) {

      const title = formData.title.trim();

      API.getNewBooks(title)
        .then(res => {

          console.log(res.data.items);

          setFormData({
            ...formData,
            toResults: true,
            results: res.data.items
          });
        })
        .catch(err => console.log(err));
    }
  };


  const addToBookList = book => {

      API.saveBook(book)
        .then(res => loadBooks())
        .catch(err => console.log(err));
    
  }
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>What Books Should I Read?</h1>
            </Jumbotron>
            <form>
              <Input
                value={formData.title}
                onChange={handleInputChange}
                name="title"
                placeholder="Title/Author/SOMETHING/Etc (required)"
              />
              <FormBtn
                disabled={!(formData.title)}
                onClick={handleFormSubmit}
              >
                Search
              </FormBtn>
            </form>
            <row>
              {formData.results.length ? (
              <List>
                {formData.results.map(book =>{
                      const {title, authors:[author], description, imageLinks:{smallThumbnail: image}, link} = book.volumeInfo;
                      const _id = book.id
                  return(
                  <ListItem key={_id}>
                    <LikeButton id={_id} incrementLikes={incrementLikes} likes={book.likes | 0} />
                    <Link to={"/books/" + book._id}>
                      <img src={image} />
                      <strong>
                        <a href={link}>{title} by {author}</a>
                      </strong>
                    </Link>
                    <SaveBtn onClick={() => addToBookList({title, author, description, image, link, _id})} />
                  </ListItem>
                )})}

              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
            </row>
            
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>

            {books.length ? (
              <List>
                {books.map(book => (
                  <ListItem key={book._id}>
                    <LikeButton id={book._id} incrementLikes={incrementLikes} likes={book.likes | 0} />
                    <Link to={"/books/" + book._id}>
                      <img src={book.image} />
                      <strong>
                        <a href={book.link}>{book.title} by {book.author}</a>
                      </strong>
                    </Link>
                    <DeleteBtn onClick={() => deleteBook(book._id)} />
                  </ListItem>
                ))}

              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
            
          </Col>
        
        </Row>
      </Container>
    );
}

export default Books;
