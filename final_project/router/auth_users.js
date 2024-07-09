const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
