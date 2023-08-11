const express = require('express');
const axios = require('axios'); // Import Axios
const books = require("./booksdb.js");
const { isValid } = require("./auth_users.js");

const public_users = express.Router();

// User Registration Route
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (isValid(username)) {
    // Add the user to the users array
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
  } else {
    return res.status(409).json({ message: "Username already exists" });
  }
});

// Get Book List Route
public_users.get('/', function (req, res) {
  // Return the list of available books
  return res.status(200).json(books);
});

// Get Book Details by ISBN Route
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn);

  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get Books by Author Route
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const authorBooks = Object.values(books).filter(book => book.author === author);

  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get Books by Title Route
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const titleBooks = Object.values(books).filter(book => book.title.includes(title));

  if (titleBooks.length > 0) {
    return res.status(200).json(titleBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get Book Review Route
public_users.get('/review/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn);

  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Reviews not found for this book" });
  }
});

// Using Promises (`.then` callbacks) with Axios
public_users.get('/books', function (req, res) {
  // Fetch the list of books using Axios
  axios.get('http://localhost:5000/') // Adjust the URL accordingly
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(500).json({ message: 'Error fetching books' });
    });
});

// Using `async-await` with Axios
public_users.get('/books-async', async function (req, res) {
  try {
    // Fetch the list of books using Axios with async-await
    const response = await axios.get('http://localhost:5000/'); // Adjust the URL accordingly
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books' });
  }
});

// Fetch Book Details by Title using Promises
public_users.get('/title-details/:title', function (req, res) {
  const title = req.params.title;

  // Fetch the book details by title using Axios
  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(500).json({ message: 'Error fetching book details by title' });
    });
});

// Fetch Book Details by Author using async-await
public_users.get('/author-details/:author', async function (req, res) {
  const author = req.params.author;

  try {
    // Fetch the book details by author using Axios with async-await
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching book details by author' });
  }
});

// Fetch Book Details by ISBN using Promises
public_users.get('/isbn-details/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Fetch the book details by ISBN using Axios
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(500).json({ message: 'Error fetching book details by ISBN' });
    });
});

module.exports = {
  general: public_users
};
