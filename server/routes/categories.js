const express = require('express');

const _ = require('underscore');

let { authenticToken, authenticAdmin } = require('../middlewares/authentication');

let app = express();

let Category = require('../models/category');


app.get('/category', authenticToken, (req, res) => {
    Category.find({}, (err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Category.countDocuments({}, (err, counting) => {
                res.json({
                    ok: true,
                    categories,
                    counted: counting
                });
            });
        })
        .sort({ description: 1 });
});

app.get('/category/:id', authenticToken, (req, res) => {

    let id = req.params.id;

    Category.findById(id, 'description user', (err, category) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!category) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found.'
                }
            });
        }
        res.json({
            ok: true,
            category
        });
    });
});

app.post('/category', authenticToken, (req, res) => {

    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });

});

app.put('/category/:id', authenticToken, (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['description']);

    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found.',
                }
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });

    });

});

app.delete('/category/:id', [authenticToken, authenticAdmin], (req, res) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, deletedCategory) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!deletedCategory) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found.'
                }
            });
        }
        res.json({
            ok: true,
            deletedCategory
        });
    });

});


module.exports = app;