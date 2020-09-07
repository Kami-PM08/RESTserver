const express = require('express');

const _ = require('underscore');

const { authenticToken } = require('../middlewares/authentication');

// let Category = require('../models/category');
let Product = require('../models/product');

let app = express();

app.get('/product', authenticToken, async(req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    Product.find({})
        .populate('category')
        .populate('user')
        .sort('name')
        .skip(from)
        .limit(limit)
        .exec((err, productsDB) => {
            // console.log(res.headersSent);
            // console.log(`p: ${productsDB}`);

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productsDB
            });
        });

});

app.get('/product/:id', authenticToken, (req, res) => {

    let id = req.params.id;

    Product.findById(id)
        .populate('category')
        .populate('user')
        .exec((err, product) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!product) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Product not found.'
                    }
                });
            }
            res.json({
                ok: true,
                product
            });
        });
});

app.get('/product/search/:term', authenticToken, (req, res) => {
    let term = req.params.term;
    let regex = new RegExp(term, 'i');

    Product.find({ name: regex, available: true })
        .populate('category', 'description')
        .sort('name')
        .exec((err, product) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!product) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Product not found.'
                    }
                });
            }
            res.json({
                ok: true,
                product
            });
        });
});

app.post('/product', authenticToken, (req, res) => {

    let body = req.body;

    // let categoryDB = await Category.find({ description: body.category }, 'id', (err, category) => {

    //     if (err) {
    //         res.status(500).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if (!category) {
    //         res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Category not found.'
    //             }
    //         });
    //     }
    // });

    let product = new Product({

        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        available: body.available,
        // category: categoryDB._id,
        category: body.category,
        user: req.user._id
    });

    product.save((err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productDB
        });

    });

});

app.put('/product/:id', authenticToken, (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['name', 'unitPrice', 'description', 'available', 'category', 'user']);

    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, product) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!product) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found.'
                }
            });
        }
        res.json({
            ok: true,
            product
        });
    });
});

app.delete('/product/:id', authenticToken, (req, res) => {

    let id = req.params.id;

    Product.findByIdAndUpdate(id, { available: false }, { new: true }, (err, deletedProduct) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!deletedProduct) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found.'
                }
            });
        }
        res.json({
            ok: true,
            deletedProduct
        });
    });
});

module.exports = app;