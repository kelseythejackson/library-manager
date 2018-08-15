var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Loan = require('../models').Loan;

/* GET users listing. */
router.get('/', function(req, res, next) {
    Book.findAll().then(function(books) {
        console.log(books[0]);
        res.render('books/index', { books, title: "Books" });
    });

});

router.get('/overdue', function(req, res, next) {
    Book.findAll({
        include: Loan
    }).then(function(books) {
        console.log(books[0]);
        res.render('books/index', { books, title: "Overdue Books" });
    });

});
router.get('/checked-out', function(req, res, next) {
    Book.findAll({
        include: Loan
    }).then(function(books) {
        console.log(books[0]);
        res.render('books/index', { books, title: "Checked Out Books" });
    });

});

module.exports = router;
