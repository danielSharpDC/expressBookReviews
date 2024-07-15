const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const MY_SECRET_KEY = "My_Strong_Secret_Key";

let users = [];

const isValid = (username)=>{ 
    let isUserValid = users.findIndex((user) => {
        return user.username === username;
    });
    return isUserValid > -1;
}

const authenticatedUser = (username,password)=>{ 
    if(!isValid(username)) {
        return false;
    }
    const user = users.find(item => item.username === username && item.password === password);
    return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, MY_SECRET_KEY, { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(403).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    if(!isNaN(isbn)) {
        const book = books[isbn];
        const username = req.session.authorization["username"];
        if(book) {
            book.reviews[username] = req.body.review;
            books[isbn] = book;
            return res.status(200).json({
                message: "Review updated successfuly",
                data: book
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

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
