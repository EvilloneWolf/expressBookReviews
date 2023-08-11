const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if a valid JWT token is present in the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, 'your-secret-key');
    req.user = decodedToken; // Store the decoded user information in the request object
    next(); // Move to the next middleware
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
