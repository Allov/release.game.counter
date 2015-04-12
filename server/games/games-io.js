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
            joinGame(data, socket);
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
            console.log('No longer tracking game ' + leftGame.slug);
            _.remove(self.games, function(g) {
                return g == leftGame;
            });
        } else {
            var leftUser = {
                name: user.profile ? user.profile.name.givenName : 'Anonymous'
            };
            io.to(leftGame.slug).emit('user-left', {
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

    function joinGame(data, socket) {
        var user = socket.request.user;

        if (!data || !data.game) {
            gutil.log('Invalid game name');
            return;
        }

        var slug = data.game.toLowerCase();

        var isAdmin = false;
        var joinedGame = _.find(self.games, {
            name: slug
        });

        if (!joinedGame) {

            Game.findOne({
                slug: slug
            }, function(err, result) {

                if (!result && !user.logged_in) {
                    io.to(socket.id).emit('game-not-found');
                    console.log('Game ' + slug + ' could not be found.');
                    return;
                }

                if (!result && user.logged_in) {
                    socket.emit('game-not-found');
                    return;
                } else {
                    isAdmin = result.administratorId == user.id;
                    console.log('Resuming game ' + slug + ', isAdmin: ' + isAdmin);
                }

                joinedGame = {
                    id: result.id,
                    slug: result.slug,
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
        socket.join(joinedGame.slug);

        if (isAdmin) {
            socket.on('game-data', function(gameData) {
                Game.findOneAndUpdate({
                    id: joinedGame.id
                }, {
                    players: gameData
                }, function(err) {
                    if (err) {
                        console.log({
                            error: err
                        });
                    }

                    console.log(gameData);

                    joinedGame.game.players = gameData;

                    io.to(joinedGame.slug).emit('game-data-update', gameData);
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
            id: joinedGame.id,
            slug: joinedGame.slug,
            name: joinedGame.game.name,
            description: joinedGame.game.description,
            isAdmin: isAdmin,
            players: joinedGame.game.players,
            viewers: viewers
        });
    }
};

module.exports = GameIo;
