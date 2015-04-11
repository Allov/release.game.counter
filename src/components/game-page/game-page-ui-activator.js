define(['router', 'socket-manager'],
    function(router, socket) {
        'use strict';

        var GameActivator = function() {

        };

        GameActivator.prototype.activate = function(context) {
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
                    // Pass the loaded data to the component.
                    if (!game.isAdmin) {
                        dfd.reject(302);

                        router.navigate('/game/' + context.route.urlParams[0].game);
                        return;
                    }

                    context.game = game;
                    context.socket = socket;

                    dfd.resolve();
                });

                socket.on('disconnect', function() {
                    console.log('disconnected...');
                });
            }).promise();
        };

        function join(context) {
            socket.emit('join', {
                game: context.route.urlParams[0].game,
                id: context.route.urlParams[0].id
            });
        }

        return new GameActivator();
    });
