var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;
const Op = require('sequelize').Op;
const moment = require('moment');

/* GET users listing. */
router.get('/', function(req, res, next) {
    Loan.findAll({
        include: [
            {model: Book},
            {model: Patron}
        ]
    }).then(function(loans){
        console.log(loans[0]);
        res.render('loans/index', { loans, moment });
    })
    
});

router.get('/overdue', function(req, res, next) {
    Loan.findAll({
        include: [
            {model: Book},
            {model: Patron}
        ],
        where: {
            returned_on: null,
            return_by: {
                $lt: new Date()
            }
        }
    }).then(function(loans){
        console.log(loans[0]);
        res.render('loans/index', { loans });
    })
    
});

router.get('/checked-out', function(req, res, next) {
    Loan.findAll({
        include: [
            {model: Book},
            {model: Patron}
        ],
        where: {
            returned_on: null
        }
    }).then(function(loans){
        console.log(loans[0]);
        res.render('loans/index', { loans, title: 'Checked out Loans' });
    })
    
});

router.get('/new', function(req, res, next){
    Book.findAll().then(function(books) {
        Patron.findAll().then(function(patrons) {
            console.log(patrons);
        res.render('loans/new/index', { 
            loan: Loan.build(), 
            title: 'New Loan',
            books,
            patrons,
            moment
        });
        })
    });
});

router.post('/', function(req, res, next) {
    Loan.create(req.body).then(function(loan) {
        res.redirect('/loans/');
    }).catch(function(err) {
        if(err.name === 'SequelizeValidationError') {
            Book.findAll().then(function(books){
                Patron.findAll().then(function(patrons) {
                    res.render('loans/new/index', { 
                        loan: Loan.build(req.body),
                        title: 'New Loan',
                        books,
                        patrons,
                        moment,
                        errors: err.errors
                    })
                });
            })
            
        }
    }).catch(function(err) {
        res.sendStatus(500)
    })
});


module.exports = router;
