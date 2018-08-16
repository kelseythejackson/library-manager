var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Loan = require('../models').Loan;
const Op = require('sequelize').Op;

/* GET users listing. */
router.get('/', function(req, res, next) {
    Book.findAll().then(function(books) {
        console.log(books[0]);
        res.render('books/index', { books, title: "Books" });
    });

});

router.get('/overdue', function(req, res, next) {
    Book.findAll({
        include: [{
            model: Loan,
            where: {
                returned_on: null,
                return_by: {
                    $lt: new Date()
                }
            }
        }]
    }).then(function(books) {
        console.log(books[0]);
        res.render('books/index', { books, title: "Overdue Books" });
    });

});
router.get('/checked-out', function(req, res, next) {
    Book.findAll({
        include: [{
            model: Loan,
            where: {
                returned_on: null,

            }
        }]
    }).then(function(books) {
        console.log(books[0]);
        res.render('books/index', { books, title: "Checked Out Books" });
    });

});

router.get('/new', function(req, res, next) {
    res.render('books/new/index');
});

router.get('/:id', function(req, res, next){
    Book.findOne({
        include: [{
           model: Loan
        }],
        where: {
            id: {
                [Op.eq]: req.params.id
            }
        }
    }).then(function(book){
        console.log(book.Loans);
        res.render('books/detail', {book: book});
    });

});

module.exports = router;
