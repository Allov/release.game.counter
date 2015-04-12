define([],
    function() {
        'use strict';

        var Manager = function() {
            this.socket = io.connect();

            this.socket.on('connect_error', function(err) {
                console.log(err);
            });

            this.socket.on('error', function(err) {
                console.log(err);
            });
        };

        return new Manager().socket;
    });
