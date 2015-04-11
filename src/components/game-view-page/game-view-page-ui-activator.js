define(['socket-manager', 'router'],
    function(socket, router) {
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

                socket.once('game-not-found', function() {
                    dfd.reject(404);
                    socket.disconnect();
                });

                socket.once('joined', function(game) {
                    if (game.isAdmin) {
                        dfd.reject(302);
                        router.navigate('/game/' + game.slug + '/' + game.id)
                        return;
                    }

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
