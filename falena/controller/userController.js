const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator');
/*
 * IMPORTAR LIBRERIA Y ARCHIVOS
 */
const { reset } = require('nodemon');
const Sequelize = require('sequelize');
const db = require('../database/models');
let Op = Sequelize.Op;


module.exports = {
    login: (req, res, next) => {
        res.render('login', {
            css: 'login.css',
            menu: 'user',
            title: 'Ingresar',
            user: req.session.user
        });
    },

    loginProcess: (req, res, next) => {

        let errors = validationResult(req);
        if (errors.isEmpty()) {

            db.Users.findOne({
                    where: {
                        email: req.body.email
                    }
                })
                .then(user => {
                    req.session.user = {
                        id: req.session.id = user.id,
                        nick: req.session.nick = user.first_name + " " + user.last_name,
                        email: req.session.email = user.email,
                        rol: req.session.rol = user.rol,
                    }
                    if (req.body.remember) {
                        res.cookie('userFalena', req.session.user, { maxAge: 1000 * 60 * 60 })
                    }

                    res.locals.user = req.session.user

                    res.redirect('/')
                })

        } else {

            res.render('login', {
                title: "Ingresar",
                css: "login.css",
                menu: 'user',
                errors: errors.mapped(),
                old: req.body,
                user: req.session.user
            })
        }
    },
    register: (req, res) => {
        res.render('register', {
            css: 'register.css',
            menu: 'user',
            title: 'Registrarse',
            user: req.session.user
        });
    },
    registerProcess: (req, res) => {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            db.Users.create(

                {
                    first_name: req.body.firstname.trim(),
                    last_name: req.body.lastname.trim(),
                    email: req.body.email.trim(),
                    password: bcrypt.hashSync(req.body.password, 10),
                    dni : req.body.dni.trim(),
                    profile_picture : 'default-picture.png',
                    rol: "user"
                }

            )
                .then(e => {
                    return res.redirect('/user/login')
                })
                .catch(errores=>{
                    console.log(errores);
                })
        } else {
            res.render('register',{
                title : "Registro de Usuarios",
                css : 'register.css',
                errors : errors.mapped(),
                old : req.body,
                user : req.session.user
            })
        }
    },

    logaut: function(req, res, next) {
        req.session.destroy();
        if(req.cookies.usuarioFalena){
            res.cookie('userFalena','',{ maxAge: -1})
        }
        res.redirect('/');
    },
    profile: (req, res, next) => {
        res.render('profile', {
            css: 'profile.css',
            menu: 'user',
            user: db.Users,
        })
    },
    profileUpdate: (req, res, next) => {

    },
    cart: (req, res, next) => {
        res.render('cart', {
            css: 'cart.css',
            menu: 'user'
        })
    }
}