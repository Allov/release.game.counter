'use strict';

var configManager = require('./../configuration/configManager');
var express = require('express');
var http = require('http');
var path = require('path');
var morgan = require('morgan');
var gutil = require('gulp-util');
var io = require('socket.io');
var controllers = require('./controllers');
var ios = require('./ios');
var database = require('./db-connection');
var argv = require('yargs').argv;

function Server() {

    var self = this;

    self.expressApp = express();

    //https://www.npmjs.com/package/morgan
    //self.expressApp.use(morgan('dev'));
    self.expressApp.use(morgan('combined', {
        skip: function(req, res) {
            return res.statusCode < 400;
        }
    }));

    // setup socket.io
    self.httpServer = http.Server(self.expressApp);
    self.io = io(self.httpServer);

    database.connect(function() {
        controllers.configure(self.expressApp, self.io);
        ios.configure(self.io);

        self.expressApp.use(function(req, res, next) {
            if (path.extname(req.path).length > 0) {
                // normal static file request
                next();
            } else {
                // should force return `index.html` for angular.js
                req.url = '/index.html';
                next();
            }
        });

        self.expressApp.use(express.static(configManager.get('expressPath')));
    });
}

Server.prototype.start = function(callback) {

    console.log(configManager.get('port'));

    var server = this.httpServer.listen(configManager.get('port'), function() {
        var serverAddress = server.address();
        var serverHost = serverAddress.address === '0.0.0.0' || serverAddress.address === '::' ? 'localhost' : serverAddress.address;
        var url = 'http://' + serverHost + ':' + serverAddress.port + '/';

        gutil.log('Started ' + gutil.colors.green(process.env.NODE_ENV) + ' server at ' + gutil.colors.cyan(url));

        callback(null, url);
    });
};

if (argv.standalone) {
    new Server().start(function(a, url) {
        gutil.log(gutil.colors.yellow('Started a standalone server at ' + url));
    });
} else {
    module.exports = exports = new Server();
}
