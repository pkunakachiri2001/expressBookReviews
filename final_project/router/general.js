const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
      resolve(books);
  });
  
  getBooks.then((bookList) => {
      return res.status(200).send(JSON.stringify(bookList, null, 4));
  }).catch((err) => {
      return res.status(500).json({message: "Error fetching books"});
  });
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  const getBookByIsbn = new Promise((resolve, reject) => {
    if(books[isbn]) {
        resolve(books[isbn]);
    } else {
        reject("Book not found");
    }
  });
  
  getBookByIsbn.then((book) => {
      return res.status(200).json(book);
  }).catch((err) => {
      return res.status(404).json({message: err});
  });
});

// Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  const getBookByAuthor = new Promise((resolve, reject) => {
    let filtered_books = [];
    for (let isbn in books) {
      if (books[isbn].author === author) {
          filtered_books.push(books[isbn]);
      }
    }
    resolve(filtered_books);
  });
  
  getBookByAuthor.then((filtered) => {
      return res.status(200).json(filtered);
  });
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  const getBookByTitle = new Promise((resolve, reject) => {
    let filtered_books = [];
    for (let isbn in books) {
      if (books[isbn].title === title) {
          filtered_books.push(books[isbn]);
      }
    }
    resolve(filtered_books);
  });
  
  getBookByTitle.then((filtered) => {
      return res.status(200).json(filtered);
  });
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
const axios = require('axios');

// Task 10: Get all books using async/await with Axios
public_users.get('/async-books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11: Get book details by ISBN using async/await with Axios
public_users.get('/async-isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error fetching book"});
    }
});

// Task 12: Get book details by Author using async/await with Axios
public_users.get('/async-author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error fetching by author"});
    }
});

// Task 13: Get book details by Title using async/await with Axios
public_users.get('/async-title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error fetching by title"});
    }
});