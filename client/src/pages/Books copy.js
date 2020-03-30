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

const Books = () => {
  const [formData, setFormData] = useState({
    author: '',
    synopsis: '',
    title: ''
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
    
    const {author, synopsis, title} = formData;

    if (title && author) {
      API.saveBook({
        author,
        likes: 0,
        synopsis,
        title
      })
        .then(res => loadBooks())
        .catch(err => console.log(err));
    }
  };

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
                placeholder="Title (required)"
              />
              <Input
                value={formData.author}
                onChange={handleInputChange}
                name="author"
                placeholder="Author (required)"
              />
              <TextArea
                value={formData.synopsis}
                onChange={handleInputChange}
                name="synopsis"
                placeholder="Synopsis (Optional)"
              />
              <FormBtn
                disabled={!(formData.author && formData.title)}
                onClick={handleFormSubmit}
              >
                Submit Book
              </FormBtn>
            </form>
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
                      <strong>
                        {book.title} by {book.author}
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
