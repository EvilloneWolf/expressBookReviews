const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js"); // Assuming you have a books database
const regdUsers = express.Router();

let users = {"user":"helloworld","password": "12345678"};

const isValid = (username) => {
  // Write code to check if the username is valid
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Write code to check if username and password match the one we have in records
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regdUsers.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    // Generate JWT token for the authenticated user
    const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });
    return res.status(200).json({ message: "User successfully logged in", token });
  } else {
    return res.status(401).json({ message: "Invalid login. Check username and password" });
  }
});

// Add a book review
regdUsers.put("/books/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const decodedToken = jwt.verify(token, 'your-secret-key');
    const username = decodedToken.username;

    // Find the book based on the provided ISBN
    const book = books[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Assuming the review is sent in the request body
    const review = req.body.review;

    // Add the review to the book's reviews
    if (!book.reviews) {
      book.reviews = {};
    }
    book.reviews[username] = review;

    return res.status(200).json({ message: "Review added successfully" });
  } catch (err) {
    return res.status(403).json({ message: "User not authenticated" });
  }
});

module.exports = { authenticated: regdUsers, isValid, users };
