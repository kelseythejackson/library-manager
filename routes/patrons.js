var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;
const Op = require('sequelize').Op;
const moment = require('moment');

/* GET users listing. */
router.get('/', function(req, res, next) {
    // Patron.findAll().then(function(patrons){
    //     res.render('patrons/index', { patrons });
    // })
    res.redirect('/patrons/page-1');
});

router.get('/page-:page', function(req, res, next) {
    Patron.findAndCountAll().then(function(patrons) {
        let page = req.params.page;
        let pages = Math.ceil(patrons.count / 5);
        let offset = 5 * (page - 1);
        let totalPages = [];
        for (let i = 1; i <= pages; i++) {
            totalPages.push(i);
            
        }
        Patron.findAll({
            limit: 5,
            offset: offset
        }).then(function(patrons) {
            res.render('patrons/index', {
                page,
                patrons,
                pages,
                totalPages,
                title: 'Patrons'
            })
        })
    });
})

router.get('/new', function(req, res, next) {
    res.render('patrons/new/index', { patron: Patron.build()});
});
router.post('/', function(req, res, next) {
    Patron.create(req.body).then(function() {
        res.redirect('/patrons')
    }).catch(function(err) {
        if(err.name === 'SequelizeValidationError') {
            res.render('patrons/new/index', { patron: Patron.build(req.body), errors: err.errors });
        } else {
            throw err;
        }
    }).catch(function (err) {
        res.sendStatus(500)
    })
})
router.get('/:id', function(req, res, next) {
    Patron.findOne({
        include: [{
            model: Loan,
            include: [{
                model: Book
            }]
        }],
        where: {
            id: {
                [Op.eq] : req.params.id
            }
        }
    }).then(function(patron) {
        res.render('patrons/detail', { patron, moment });
    });
    
});

router.put('/:id', function(req, res, next) {
    Patron.findById(req.params.id).then(function(patron) {
        if(patron) {
            return patron.update(req.body)
        } else {
            res.sendStatus(404);
        }
    }).then(function() {
        res.redirect('/patrons/');
    }).catch(function(err) {
        if(err.name === 'SequelizeValidationError') {
            let patron = Patron.build(req.body);
            patron.id = req.params.id;
            res.render('patrons/detail', {
                patron,
                moment,
                errors: err.errors
            })
        } else {
            throw err;
        }
    }).catch(function(err) {
        res.sendStatus(500);
    })
});

module.exports = router;
