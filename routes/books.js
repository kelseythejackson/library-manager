const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;
const Op = require('sequelize').Op;
const moment = require('moment');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.redirect('/books/page-1');

});

router.get('/search', function(req, res, next) {
    Book.findAll({
        where: {
            [Op.or]: [
             {
                title: {
                    [Op.like]: `%${req.query.term}%`
                }
             },
             {
                author: {
                    [Op.like]: `%${req.query.term}%`
                }
             },
             {
                genre: {
                    [Op.like]: `%${req.query.term}%`
                }
             },
             {
                first_published: {
                    [Op.like]: `%${req.query.term}%`
                }
             }    
            ]
        }
    }).then(function(books){
        res.render('books/search/index', {
            books,
            query_term: req.query.term    
        })
    })
    
});

router.get('/page-:page', function(req, res, next) {
    Book.findAndCountAll().then(function(books) {
        let page = req.params.page;
        let pages = Math.ceil(books.count / 10);
        let offset = 10 * (page - 1);
        let totalPages = [];
        for (let i = 1; i <= pages; i++) {
            totalPages.push(i);
            
        }
        Book.findAll({
            limit: 10,
            offset: offset
        }).then(function(books) {
            res.render('books/index', {
                page,
                books,
                pages,
                partialUrl: 'books',
                totalPages,
                title: 'Books'
            })
        })
    });
})

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
    res.redirect('/books/overdue/page-1');

});

router.get('/overdue/page-:page', function(req, res, next) {
    Book.findAndCountAll({
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
        let page = req.params.page;
        let pages = Math.ceil(books.count / 10);
        let offset = 10 * (page - 1);
        let totalPages = [];
        for (let i = 1; i <= pages; i++) {
            totalPages.push(i);  
        }

        Book.findAll({
            include: [{
                model: Loan,
                where: {
                    returned_on: null,
                    return_by: {
                        $lt: new Date()
                    }
                }
            }],
            limit: 10,
            offset: offset
        }).then(function(books) {
            res.render('books/index', { books,
                page,
                pages,
                totalPages,
                partialUrl: 'books/overdue',
                title: "Overdue Books" });
        });
    })
    
})
router.get('/checked-out', function(req, res, next) {
    res.redirect('/books/checked-out/page-1');

});

router.get('/checked-out/page-:page', function(req, res, next) {
    Book.findAndCountAll({
        include: [{
            model: Loan,
            where: {
                returned_on: null,
            }
        }]
    }).then(function(books) {
        let page = req.params.page;
        let pages = Math.ceil(books.count / 10);
        let offset = 10 * (page - 1);
        let totalPages = [];
        for (let i = 1; i <= pages; i++) {
            totalPages.push(i);
            
        }

        Book.findAll({
            include: [{
                model: Loan,
                where: {
                    returned_on: null,
                }
            }],
            limit: 10,
            offset: offset
        }).then(function(books) {
            res.render('books/index', { books,
                page,
                pages,
                totalPages,
                partialUrl: 'books/checked-out',
                title: "Checked Out Books" });
        });
    })
    
})

router.get('/new', function(req, res, next) {
    res.render('books/new/index', { book: Book.build(), title: "New Book"});
});

router.get('/:id', function(req, res, next){
    Book.findOne({
        include: [{
           model: Loan,
           include: [{
               model: Patron
           }]
        }],
        where: {
            id: {
                [Op.eq]: req.params.id
            }
        }
    }).then(function(book){
        res.render('books/detail', {book: book, moment});
    });

});

router.put('/:id', function(req, res, next) {
    Book.findById(req.params.id).then(function(book) {
        if(book) {
            return book.update(req.body);
        } else {
            res.sendStatus(404);
        }
    }).then(function(book) {
        res.redirect(`/books/`);
    }).catch(function(err) {
        if(err.name === 'SequelizeValidationError') {
            let book = Book.build(req.body);
            book.id = req.params.id;
            res.render('books/detail', { 
                book: book, 
                title: book.title, 
                errors: err.errors
            });
        } else {
            throw err;
        }
    }).catch(function(err) {
        res.sendStatus(500);
    });
});

router.get('/search', function(req, res, next) {
    res.render('/books/search/index', {
        query_title: req.query.title
    })
});

module.exports = router;
