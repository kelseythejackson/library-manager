var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;
const Op = require('sequelize').Op;

/* GET users listing. */
router.get('/', function(req, res, next) {
    Loan.findAll({
        include: [
            {model: Book},
            {model: Patron}
        ]
    }).then(function(loans){
        console.log(loans[0]);
        res.render('loans/index', { loans });
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
module.exports = router;
