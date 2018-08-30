var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;
const Op = require('sequelize').Op;
const moment = require('moment');

/* GET users listing. */
router.get('/', function(req, res, next) {
    Patron.findAll().then(function(patrons){
        res.render('patrons/index', { patrons });
    })
});

router.get('/new', function(req, res, next) {
    res.render('patrons/new/index');
});

router.get('/:id', function(req, res, next) {
    res.render('patrons/detail');
});

module.exports = router;
