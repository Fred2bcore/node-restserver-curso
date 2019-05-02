const express = require('express');
const User = require('../models/usuario');

const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');


app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    User.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    users,
                    cuantos: conteo
                });
            });
        });
});
app.post('/usuario', function(req, res) {
    let body = req.body;

    let user = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});
app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    // User.findByIdAndUpdate(id, (err, userDelete) => {
    User.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, userDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!userDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            user: userDelete
        });

    });


});

module.exports = app;