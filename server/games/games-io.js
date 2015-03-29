'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');
var gutil = require('gulp-util');

var Account = mongoose.model('Account');
var Game = mongoose.model('Game');

var GameIo = function(io) {
    var self = this;

    self.io = io;

    self.games = [];

    // register Socket IO events
    self.io.on('connection', function(socket) {
        socket.on('join', function(data) {
            createOrJoinGame(data, socket);
        });

        socket.on('disconnect', function() {
            disconnectFromGame(socket);
        });
    });

    self.io.on('connect_error', function(err) {
        console.log(err);
    });

    function disconnectFromGame(socket) {
        var user = socket.request.user;

        var leftGame = _.find(self.games, function(g) {
            return _.some(g.viewers, function(v) {
                return v.socket.id == socket.id;
            });
        });

        var isAdmin = user.id == leftGame.administratorId;

        _.remove(leftGame.viewers, function(v) {
            return v.socket.id == socket.id;
        });

        if (_.isEmpty(leftGame.viewers)) {
            console.log('No longer tracking game ' + leftGame.name);
            _.remove(self.games, function(g) {
                return g == leftGame;
            });
        } else {
            var leftUser = {
                name: user.profile ? user.profile.name.givenName : 'Anonymous'
            };
            io.to(leftGame.name).emit('user-left', {
                user: leftUser,
                viewers: _.map(leftGame.viewers, function(v) {
                    return {
                        id: v.user.id,
                        name: v.user.name || 'Anonymous'
                    };
                })
            });
        }
    }

    function createOrJoinGame(data, socket) {
        var user = socket.request.user;

        if (!data || !data.game) {
            gutil.log('Invalid game name');
            return;
        }

        var gameName = data.game.toLowerCase();

        var isAdmin = false;
        var joinedGame = _.find(self.games, {
            name: gameName
        });

        if (!joinedGame) {

            Game.findOne({
                name: gameName
            }, function(err, result) {

                if (!result && !user.logged_in) {
                    io.to(socket.id).emit('game-not-found');
                    console.log('Game ' + gameName + ' could not be found.');
                    return;
                }

                if (!result && user.logged_in) {
                    var newGame = new Game({
                        id: gameName,
                        name: gameName,
                        description: '',
                        administratorId: user.id,
                        players: []
                    });

                    newGame.save();
                    console.log('Created a new game...');
                    isAdmin = true;

                    result = newGame;
                } else {
                    isAdmin = result.administratorId == user.id;
                    console.log('Resuming game ' + gameName + ', isAdmin: ' + isAdmin);
                }

                joinedGame = {
                    name: gameName,
                    administratorId: result.administratorId,
                    game: result,
                    viewers: []
                };

                self.games.push(joinedGame);

                initGame(io, socket, isAdmin, user, joinedGame);
            });
        } else {
            isAdmin = joinedGame.administratorId == user.id;

            initGame(io, socket, isAdmin, user, joinedGame);
        }
    }

    function initGame(io, socket, isAdmin, user, joinedGame) {
        socket.join(joinedGame.name);

        if (isAdmin) {
            socket.on('game-data', function(gameData) {
                Game.findOneAndUpdate({
                    id: joinedGame.name
                }, {
                    players: gameData
                }, function(err) {
                    if (err) {
                        console.log({
                            error: err
                        });
                    }

                    joinedGame.game.players = gameData;

                    io.to(joinedGame.name).emit('game-data-update', gameData);
                });
            });
        }

        joinedGame.viewers.push({
            user: user,
            socket: socket
        });

        var joinedUser = {
            name: user.profile ? user.profile.name.givenName : 'Anonymous'
        };

        var viewers = _.map(joinedGame.viewers, function(v) {
            return {
                id: v.user.id,
                name: v.user.name || 'Anonymous'
            };
        });

        var joinedData = {
            user: joinedUser,
            viewers: viewers
        };

        io.to(joinedGame.name).emit('user-joined', joinedData);
        io.to(socket.id).emit('joined', {
            name: joinedGame.name,
            isAdmin: isAdmin,
            players: joinedGame.game.players,
            viewers: viewers
        });
    }
};

module.exports = GameIo;
