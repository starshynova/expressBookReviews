const express = require('express');
let books = require('./booksdb.js');
const public_users = express.Router();


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    if (books) {
      res.status(200).send(JSON.stringify(books, null, 2));
    } else
      throw new Error('No books found');
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => { 
  try {
  const isbn = req.params.isbn; /* task 2 */
  const book = books[isbn]; 
    if (book) {
         res.status(200).send(book); 
    } else {
        res.status(404).json({ message: "Book not found" }); 
        } 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details' });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();   /* task 3 */ 
try {
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

  if (booksByAuthor.length > 0) {
    res.status(200).send(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
} catch (error) { 
  res.status(500).json({ message: 'Error fetching books by author' });
}
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase(); 
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());  
try {
  if (booksByTitle.length > 0) {
    res.status(200).send(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
} catch (error) {
  res.status(500).json({ message: 'Error fetching books by title' });

}
});

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn; /* task 5 */
  const book = books[isbn]; 
try {
  if (book) {
    if (Object.keys(book.reviews).length > 0) {
      res.status(200).send(book.reviews); 
    } else {
      res.status(404).json({ message: "No reviews found for this book" }); 
    }
  } else {
    res.status(404).json({ message: "Book not found" }); 
  }
} catch (error) {
  res.status(500).json({ message: 'Error fetching review for the book' });
}
});

module.exports.general = public_users;