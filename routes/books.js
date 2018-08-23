const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Op = require('sequelize').Op;

/* GET users listing. */
router.get('/', function(req, res, next) {
    Book.findAll().then(function(books) {

        res.render('books/index', { books, title: "Books" });
    });

});

router.post('/', function(req, res, next) {
    Book.create(req.body).then(function(book){
        res.redirect(`/books/`);
    }).catch(function(err) {
        if(err.name === 'SequelizeValidationError') {
            res.render('books/new/index', { book: Book.build(req.body), title: "New Book", errors: err.errors});
        } else {
            throw err;
        }
    }).catch(function (err) {
        res.sendStatus(500)
    })
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

        res.render('books/index', { books, title: "Checked Out Books" });
    });

});

router.get('/new', function(req, res, next) {
    res.render('books/new/index', { book: Book.build(), title: "New Book"});
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

        res.render('books/detail', {book: book});
    });

});

module.exports = router;
