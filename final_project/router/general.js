const express = require('express');
let books = require("./booksdb.js"); // Assuming you have a books database
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users; // Assuming you have a user database
const public_users = express.Router();

// User Registration Route
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the username is unique
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
  const isbn = parseInt(req.params.isbn); // Convert to integer

  // Find the book based on the provided ISBN
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get Books by Author Route
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  // Find books written by the provided author
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
  // Find books that match the provided title
  const titleBooks = Object.values(books).filter(book => book.title.includes(title));

  if (titleBooks.length > 0) {
    return res.status(200).json(titleBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get Book Review Route
public_users.get('/review/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn); // Convert to integer

  // Find the book based on the provided ISBN
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Reviews not found for this book" });
  }
});

// Export the public_users router
module.exports.general = public_users;
