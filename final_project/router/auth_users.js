const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username); 
};

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user && user.password === password; 
};

regd_users.post("/register", async (req, res) => {
  const { username, password } = req.body;
try {
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
} catch (error) {
  res.status(500).json({ message: "User registration error" })
}
});


regd_users.post("/login", async (req, res) => {
  const { username, password } = req.body; 
try {
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' }); 
    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
} catch (error) {
  res.status(500).json({message: "User login error"})
}
});

regd_users.put("/auth/review/:isbn", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];
  const { reviews } = req.body; 
  const { isbn } = req.params; 

try {
  if (!token) {
    console.log("No token provided");
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

    const decoded = jwt.verify(token, 'secretKey'); 
    const user = decoded.username; 
    console.log(`User: ${user}, ISBN: ${isbn}, Reviews: ${reviews}`);

    if (books[isbn]) {
      books[isbn].reviews[user] = reviews; 
      console.log("Review added successfully");
      res.status(200).json({ message: "Review added successfully." });
    } else {
      console.log("Book not found");
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.log("Invalid token");
    res.status(401).json({ message: "Invalid token" }); 
  }
});

regd_users.delete("/auth/review/:isbn", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];
  const { isbn } = req.params; 

  try {
  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }
  
    const decoded = jwt.verify(token, 'secretKey'); 
    const user = decoded.username; 

    if (books[isbn]) {
      if (books[isbn].reviews[user]) {
        delete books[isbn].reviews[user]; 
        res.status(200).json({ message: "Review deleted successfully." });
      } else {
        res.status(404).json({ message: "Review not found" }); 
      }
    } else {
      res.status(404).json({ message: "Book not found" }); 
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" }); 
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
