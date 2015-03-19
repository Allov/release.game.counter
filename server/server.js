'use strict';

var configManager = require('./../configuration/configManager');
var express = require('express');
var http = require('http');
var path = require('path');
var morgan = require('morgan');
var gutil = require('gulp-util');
var io = require('socket.io');
var GamesApi = require('./games-api');
var FacebookApi = require('./facebook-api');
var GoogleApi = require('./google-api');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

function Server() {
    this.expressApp = express();

    //https://www.npmjs.com/package/morgan
    //this.expressApp.use(morgan('dev'));
    this.expressApp.use(morgan('combined', {
        skip: function(req, res) { return res.statusCode < 400; }
    }));

    this.expressApp.use(cookieParser());
    this.expressApp.use(bodyParser());
    this.expressApp.use(session({ secret: 'keyboard cat' }));
    this.expressApp.use(passport.initialize());
    this.expressApp.use(passport.session());

    this.httpServer = http.Server(this.expressApp);
    this.io = io(this.httpServer);
    var api = new GamesApi(this.io);
    var facebook = new FacebookApi(this.expressApp);
    var google = new GoogleApi(this.expressApp);

    this.expressApp.get('/api/games/most-popular', function(req, res) {
        var games = api.mostPopularGames(4);
        res.send(games);
    });
    
    this.expressApp.get('/api/games/search/:term', function(req, res) {
        var games = api.searchGames(req.params.term);
        res.send(games);
    });
    
    this.expressApp.get('/api/games/:name', function(req, res) {
        var game = api.getGameByName(req.params.name);
        res.send(game);
    });
    
    this.expressApp.get('/api/account', function(req, res) {
        res.send(req.user);
    });
    
    this.expressApp.get('/api/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
    this.expressApp.use(function(req, res, next) {
        if (path.extname(req.path).length > 0) {
            // normal static file request
            next();
        } else {
            // should force return `index.html` for angular.js
            req.url = '/index.html';
            next();
        }
    });

    this.expressApp.use(express.static('./src'));
}

Server.prototype.start = function(callback) {
    
    var server = this.httpServer.listen(configManager.get('port'), function() {
        var serverAddress = server.address();
        var serverHost = serverAddress.address === '0.0.0.0' || serverAddress.address === '::' ? 'localhost' : serverAddress.address;
        var url = 'http://' + serverHost + ':' + serverAddress.port + '/';

        gutil.log('Started ' + gutil.colors.green('dev') + ' server at ' + gutil.colors.cyan(url));

        callback(null, url);
    });
};

module.exports = exports = new Server();
