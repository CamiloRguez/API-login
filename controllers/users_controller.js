/**
 * Created by Camilo on 21/12/2016.
 */
var mongoose = require('mongoose');
var Usuario  = mongoose.model('User');
var jwt         = require('jwt-simple');
var config      = require('../config/database'); // get db config file


//registrar usuario
exports.singup = function(req, res) {
    console.log('POST');
    console.log(req.body);

    if (!req.body.email || !req.body.password || !req.body.admin) {
        res.json({success: false, msg: 'Please pass name, password adn admin.'});
    } else {
        var newUser = new Usuario({
            email: req.body.email,
            password: req.body.password,
            admin: req.body.admin
        });

        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
};

//hacer login
exports.authenticate = function(req, res) {
    Usuario.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
};