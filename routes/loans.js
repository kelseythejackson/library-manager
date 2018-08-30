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
        res.render('loans/index', { loans, moment });
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
        res.render('loans/index', { loans, moment, title: 'Checked out Loans' });
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

router.get('/return/:id', function(req, res, next) {
    Loan.findOne({
        include: [{
           model: Patron
        },{
            model: Book
        }],
        where: {
            id: {
                [Op.eq]: req.params.id
            }
        }
    }).then(function(loan) {
        console.log(loan);
        res.render('loans/return/index', {
            loan,
            return: Loan.build(),
            moment
        });
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

router.put('/return/:id', function(req, res, next) {
    Loan.findById(req.params.id).then(function(loan) {
        if (loan) {
            return loan.update(req.body);
        } else {
            res.sendStatus(404)
        }
    }).then(function() {
        res.redirect('/loans/');
    }).catch(function(err){
        if(err.name === 'SequelizeValidationError') {
            Loan.findOne({
                include: [{
                   model: Patron
                },{
                    model: Book
                }],
                where: {
                    id: {
                        [Op.eq]: req.params.id
                    }
                }
            }).then(function(loan) {
                res.render('loans/return/index', {
                    loan,
                    return: Loan.build(req.body),
                    moment,
                    errors: err.errors
                });
            });
            
        }
    }).catch(function(err){

    });
});


module.exports = router;
