define(['socket-manager'],
    function(socket) {
        'use strict';

        var GameViewActivator = function() {

        };

        GameViewActivator.prototype.activate = function(context) {
            return new $.Deferred(function(dfd) {
                if (socket.disconnected) {
                    socket.on('connect', function() {
                        join(context);
                    });
                } else {
                    join(context);
                }

                socket.once('joined', function(game) {
                    context.game = game;
                    context.socket = socket;
                    dfd.resolve();
                });
            }).promise();
        };

        function join(context) {
            socket.emit('join', {
                game: context.route.urlParams[0].game
            });
        }

        return new GameViewActivator();
    });
