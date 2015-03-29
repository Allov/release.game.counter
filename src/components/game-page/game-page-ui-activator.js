define(['socketio'],
    function(io) {
        'use strict';

        var GameActivator = function() {

        };

        GameActivator.prototype.activate = function(matchedRoute) {
            var deferred = new $.Deferred();

            // Here would be a good place to display a loading message.
            console.log('connecting...');

            var socket = io.connect();

            socket.on('connect', function() {
                console.log('connected.');
                socket.emit('join', {
                    game: matchedRoute.params[0].game
                })
            });

            socket.on('joined', function(game) {
                // Pass the loaded data to the component.
                if (!game.isAdmin) {
                    window.location = window.location + '/view';
                }

                deferred.resolve({
                    game: game,
                    socket: socket
                });
            });

            socket.on('error', function(err) {
                console.log(err);
            });

            return deferred.promise();
        };

        return new GameActivator();
    });
