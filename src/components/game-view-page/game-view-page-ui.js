define(['text!./game-view-page.html', 'knockout', 'lodash', 'socketio', 'knockout-i18next-translator'],
    function(template, ko, _, io, Translator) {
        'use strict';
        
        var ViewModel = function(params, componentInfo) {
            var self = this;
            
            self.translator = new Translator();
            self.t = self.translator.t;

            self.players = ko.observableArray([]);
            
            self.socket = params.activationData.socket;
            
            self.socket.on('user joined', function(user) {
                console.log('User [' + user.name + '] joined the game.');
            });
            
            self.socket.on('end of game', function(data) {
                console.log(data.reason);
            });
            
            self.socket.on('disconnect', function() {
               console.log('disconnected');
            });

            self.socket.on('game-data-update', function(gameData) {
                updateGameData(self, gameData);
            });

            if (params.activationData.user.gameData) {
                updateGameData(self, params.activationData.user.gameData);
            }
        };
        
        ViewModel.prototype.dispose = function() {
            var self = this;

            self.translator.dispose();
        };

        function updateGameData(self, gameData) {
            gameData = _.sortBy(gameData, 'score').reverse();
            self.players(gameData);
            console.log(self.players());
        }

        return {
            viewModel: {
                createViewModel: function(params, componentInfo) {
                    return new ViewModel(params, componentInfo);
                }
            },
            template: template
        };
    });