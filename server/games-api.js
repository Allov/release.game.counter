'use strict';

var Game = require('./game');
var User = require('./user');
var _ = require('lodash');
var gutil = require('gulp-util');

var Api = function(io) {
    var self = this;
    
    this.io = io;
    
    this.games = [];
    this.users = [];
    this.currentUserId = 99;
    
    self.searchGames = function(name) {
        return _.pluck(_.filter(this.games, function(game) {
            return game.name.indexOf(name) > -1;
        }), 'name');
    };
    
    self.mostPopularGames = function(max) {
        var groupedGames = _.groupBy(self.users, function(user) {
            return user.game.name;
        });
        
        var games = [];
        for(var i in groupedGames) {
            games.push({
                name: i,
                count: groupedGames[i].length
            });
        }
        
        var sortedGames = _.sortBy(games, 'count');
        sortedGames = sortedGames.reverse();
        
        return _.take(sortedGames, max);
    };
    
    self.getGameByName = function(name) {
        return _.pluck(_.where(self.games, { name: name }), 'name');
    };

    // register Socket IO events
    io.on('connection', function(socket) {
        socket.on('join', function(data) {
            createOrJoinGame(data, socket);
        });
        
        socket.on('disconnect', function() {
           disconnectFromGame(socket);
        });
    });

    function getUserFromSocketId(socketId) {
        return _.find(self.users, function(user) {
            return user.id === socketId;
        });
    }

    // Privates
    function disconnectFromGame(socket) {
        var user = getUserFromSocketId(socket.id);

        if (!user) {
            gutil.log('User does not exist...')
            return;
        }
        
        var leftGame = user.game;
        _.remove(self.users, function(user) {
            return user.id === socket.id;
        });
        
        // cleanup arrays
        if (user.isAdmin || !_.some(self.users, function(user) { return user.game === user.game; })) {
            _.remove(self.games, function(game) {
                return game === leftGame;
            });
            
            if (user.isAdmin) {
                io.to(leftGame.name).emit('end of game', { reason: 'Admin has left the game.' });
                var usersInLeftGame = _.where(self.users, { game: leftGame });
                usersInLeftGame.forEach(function(user) {
                    //user.game = null;
                    io.sockets.connected[user.id].disconnect();
                    _.remove(self.users, user);
                    
                });
            }

            gutil.log(_.template('Game [<%= name %>] has been removed (number of active game: <%= count %>).')({ name: leftGame.name, count: self.games.length }));
        }
        
        gutil.log('User [' + user.name + (user.isAdmin ? ' (admin)' : '') + '][' + user.id + '] has left the game [' + leftGame.name + '].');
        gutil.log(_.template('Game [<%= name %>] has <%= count %> user left.')({ name: leftGame.name, count: _.where(self.users, { game: leftGame }).length }));
    }
    
    function createOrJoinGame(data, socket) {
        if (!data || !data.game) {
            gutil.log('Invalid game name');
            return;
        }
    
        var gameName = data.game.toLowerCase();
    
        socket.join(gameName);
        
        var joinedGame = _.find(self.games, function(game) {
            return game.name == gameName;
        });
        
        self.currentUserId++;
        var user = new User(socket.id, data.name || ('User' + self.currentUserId));
        
        if (!joinedGame) {
            gutil.log(_.template('Creating game room for [<%= name %>]')({ name: gameName }));
            user.isAdmin = true;
            
            socket.on('game-data', function(gameData) {
               joinedGame.gameData = gameData;
               io.to(joinedGame.name).emit('game-data-update', gameData);
            });
            
            joinedGame = new Game(gameName, user);
            self.games.push(joinedGame);
        }
        gutil.log('User [' + user.name + (user.isAdmin ? ' (admin)' : '') + '][' + user.id + '] joined the game [' + gameName + ']');

        user.game = joinedGame;
        
        self.users.push(user);
        
        self.io.to(gameName).emit('user joined', { name: user.name});
        self.io.to(user.id).emit('joined', {
            isAdmin: user.isAdmin,
            name: user.name,
            gameData: joinedGame.gameData
        });
    }
};

module.exports = Api;