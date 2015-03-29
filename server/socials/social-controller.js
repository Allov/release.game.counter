var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportSocketIo = require("passport.socketio");
var MongoStore = require('connect-mongo')(expressSession);
var FacebookController = require('./facebook-controller');
var GoogleController = require('./google-controller');
var AccountsApi = require('../accounts/account-api');
var database = require('../db-connection');

var SocialController = function(app, io) {
    var store = new MongoStore({
        mongooseConnection: database.connection
    });

    app.use(cookieParser());
    app.use(bodyParser());
    app.use(expressSession({
        secret: 'keyboard cat',
        store: store
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: 'connect.sid',
        secret: 'keyboard cat',
        store: store,
        fail: function(data, message, error, accept) {
            accept();
        }
    }));

    var accountsApi = new AccountsApi();
    var facebook = new FacebookController(app, accountsApi);
    var google = new GoogleController(app, accountsApi);
};

module.exports = SocialController;
