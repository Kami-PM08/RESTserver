const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');
const { authenticToken, authenticAdmin } = require('../middlewares/authentication');

const app = express();

app.get('/user', authenticToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    let filter = {
        status: true
    }

    User.find(filter, 'name status google img role email')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({

                    ok: false,
                    err
                })
            }
            User.countDocuments(filter, (err, counting) => {
                res.json({
                    ok: true,
                    users,
                    counted: counting
                })
            })


        })


})
app.post('/user', [authenticToken, authenticAdmin], (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({

                ok: false,
                err
            })
        }

        // userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        });
    })

    // if (body.name === undefined) {

    //     res.status(400).json({
    //         ok: false,
    //         message: "Name is required."
    //     })

    // } else {
    //     res.json({ persona: body })
    // }
})
app.put('/user/:id', [authenticToken, authenticAdmin], (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['name', 'email', 'status', 'img', 'role']);


    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({

                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            user: userDB
        })
    })


})
app.delete('/user/:id', [authenticToken, authenticAdmin], (req, res) => {
    let id = req.params.id;
    let changes = {
        status: false
    }
    User.findByIdAndUpdate(id, changes, { new: true }, (err, deletedUser) => {
        if (err) {
            return res.status(500).json({

                ok: false,
                err
            })
        }
        if (!deletedUser || deletedUser.status === false) { //probar!!
            return res.status(400).json({

                ok: false,
                err: {
                    message: 'User not found.'
                }
            })
        }
        res.json({
            ok: true,
            deletedUser
        })
    })
})

module.exports = app;