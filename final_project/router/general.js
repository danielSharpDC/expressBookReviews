const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const foundUser = users.findIndex(item => item.username === username);
    if (foundUser === -1) {
      users.push({ "username": username, "password": password });
      return res.status(201).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(422).json({ message: "Username and Password are required" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return new Promise((resolve) => {
        res.status(200).send(JSON.stringify({
            message: "List of books",
            data: books
        }));
        resolve();
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    return new Promise(resolve => {
        const isbn = parseInt(req.params.isbn);
        if(!isNaN(isbn)) {
            const book = books[isbn];
            if(book) {
                res.status(200).json({
                    message: "Request was successful",
                    data: book
                });
            } else {
                res.status(404).json({
                    message: "Book not found"
                });
            }
        } else {
            res.status(422).json({
                message: "ISBN must be a number"
            });
        }
        resolve();
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  return new Promise(resolve => {
    const author = req.params.author;
    const authorBooks = [];
    for(const key in books) {
        const book = books[key];
        if(book.author === author) {
            authorBooks.push(book);
        }
    }
    if(authorBooks.length) {
        res.status(200).json({
            message: "Request was successful",
            data: authorBooks
        });
    } else {
        res.status(404).json({
        message: "Nothing found for that author",
        });
    }
    resolve();
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    return new Promise(resolve => {
        const title = req.params.title;
        let foundBooks;
        for(const key in books) {
            const book = books[key];
            if(book.title === title) {
                foundBooks = book;
                break;
            }
        }
        if(foundBooks !== undefined) {
            res.status(200).json({
                message: "Request was successful",
                data: foundBooks
            });
        } else {
            res.status(404).json({
                message: "Nothing found with this title",
            });
        }
        resolve();
    });    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    if(!isNaN(isbn)) {
        const book = books[isbn];
        if(book) {
            return res.status(200).json({
                message: "Request was successful",
                data: book.reviews
            });
        } else {
            return res.status(404).json({
                message: "Book not found"
            });
        }
    } else {
        return res.status(422).json({
            message: "ISBN must be a number"
        });
    }
});

module.exports.general = public_users;
