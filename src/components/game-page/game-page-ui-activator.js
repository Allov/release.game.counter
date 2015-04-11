define([],
    function() {
        'use strict';

        var GameActivator = function() {

        };

        GameActivator.prototype.activate = function(context) {
            var deferred = new $.Deferred();

            var socket = io.connect();

            socket.on('connect', function() {
                socket.emit('join', {
                    game: context.route.urlParams[0].game
                })
            });

            socket.on('joined', function(game) {
                // Pass the loaded data to the component.
                if (!game.isAdmin) {
                    window.location = window.location + '/view';
                }

                context.game = game;
                context.socket = socket;

                deferred.resolve();
            });

            socket.on('error', function(err) {
                console.log(err);
            });

            return deferred.promise();
        };

        return new GameActivator();
    });
