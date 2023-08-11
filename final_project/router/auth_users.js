const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");

const regd_users = express.Router();
const users = [];

const isValid = (username) => {
  return !users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });
    return res.status(200).json({ message: "User successfully logged in", token });
  } else {
    return res.status(401).json({ message: "Invalid login. Check username and password" });
  }
});

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    // Add the new user to the users array
    users.push({ username, password }); // Push the new user object

    return res.status(200).json({ message: "User registered successfully" });
  } else {
    return res.status(409).json({ message: "Username already exists" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const decodedToken = jwt.verify(token, 'your-secret-key');
    const username = decodedToken.username;

    const book = books[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const review = req.body.review;

    if (!book.reviews) {
      book.reviews = {};
    }

    book.reviews[username] = review;

    return res.status(200).json({ message: "Review added successfully" });
  } catch (err) {
    return res.status(403).json({ message: "User not authenticated" });
  }
});

module.exports = {
  authenticated: regd_users,
  isValid: isValid,
  users: users
};
