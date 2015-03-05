define(['knockout', 'jquery'],
    function(ko, $) {
    	'use strict';
    	
        ko.validation.rules['gameIsUnique'] = {
            async: true, // the flag that says "Hey I'm Async!"
            validator: function(val, otherVal, callback) { // yes, you get a 'callback'
            
                $.getJSON('/api/games/' + val, function(games) {
                    callback(games.length === 0);
                }).fail(function() {
                    callback(false);
                });
    
            },
            message: ''
        };
    });