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
                socket.emit('join', {game: matchedRoute.params[0].game})
            });
            
            socket.on('joined', function(user) {
                // Pass the loaded data to the component.
                deferred.resolve({
                    user: user,
                    socket: socket
                });
            });
            
            

            return deferred.promise();
        };
        
        return new GameActivator();
    });