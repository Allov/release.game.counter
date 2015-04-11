define([],
    function() {
        'use strict';

        var GameViewActivator = function() {

        };

        GameViewActivator.prototype.activate = function(context) {
            var deferred = new $.Deferred();

            var socket = io.connect();

            socket.on('connect', function() {
                socket.emit('join', {
                    game: context.route.urlParams[0].game
                })
            });

            socket.on('joined', function(game) {
                context.game = game;
                context.socket = socket;
                deferred.resolve();
            });



            return deferred.promise();
        };

        return new GameViewActivator();
    });
