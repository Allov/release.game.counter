define(['socketio'],
    function(io) {
        'use strict';
        
        var GameViewActivator = function() {
            
        };
        
        GameViewActivator.prototype.activate = function(matchedRoute) {
            var deferred = new $.Deferred();

            // Here would be a good place to display a loading message.
            console.log('connecting...');
            
            var socket = io.connect();
            
            socket.on('connect', function() {
                console.log('connected.');
                socket.emit('join', {game: matchedRoute.params[0].game})
            });
            
            socket.on('joined', function(user) {
                deferred.resolve({
                    user: user,
                    socket: socket
                });
            });
            
            

            return deferred.promise();
        };
        
        return new GameViewActivator();
    });