const express = require('express');
const fileUpload = require('express-fileupload');

const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const Product = require('../models/product');

const app = express();

app.use(fileUpload({ useTempFiles: true }));

function fileDelete(fileName, type) {

    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);

    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)
    }
}

function userImage(id, res, fileName) {
    User.findById(id, (err, userDB) => {
        if (err) {
            fileDelete(fileName, 'users');

            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            fileDelete(fileName, 'users');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found.'
                }
            });
        }

        fileDelete(userDB.img, 'users');

        userDB.img = fileName;

        userDB.save((err, user) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                user
            });
        });
    });
}

function productImage(id, res, fileName) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            fileDelete(fileName, 'products');

            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            fileDelete(fileName, 'products');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found.'
                }
            });
        }

        fileDelete(productDB.img, 'products');

        productDB.img = fileName;

        productDB.save((err, product) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                product
            });
        });
    });
}

app.put('/upload/:type/:id', (req, res) => {
    let type = req.params.type;
    let id = req.params.id;

    let validTypes = ['products', 'users'];

    if (!validTypes.includes(type)) {
        return res.status(400).json({
            ok: false,
            message: type + ' not a valid extension.',
            allowedExtensions: validExtensions.join(', ') + '.'
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    let file = req.files.file;

    let splitName = file.name.split('.');
    let extension = splitName[splitName.length - 1];

    let validExtensions = ['jpg', 'png', 'gif', 'jpeg', 'jfif']

    if (!validExtensions.includes(extension)) {
        return res.status(400).json({
            ok: false,
            message: extension + ' not a valid extension.',
            allowedExtensions: validExtensions.join(', ') + '.'
        });
    }

    let fileName = `${id}-${splitName[0]}-${new Date().getMilliseconds()}.${extension}`;

    file.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (type === 'users') {
            userImage(id, res, fileName);
        } else {
            productImage(id, res, fileName);
        }

    });
});

module.exports = app;