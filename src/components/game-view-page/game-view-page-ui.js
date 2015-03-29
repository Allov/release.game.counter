define(['text!./game-view-page.html', 'knockout', 'lodash', 'socketio', 'knockout-i18next-translator'],
    function(template, ko, _, io, Translator) {
        'use strict';

        var ViewModel = function(params, componentInfo) {
            var self = this;

            self.translator = new Translator();
            self.t = self.translator.t;

            self.name = params.activationData.game.name;
            self.players = ko.observableArray([]);

            self.socket = params.activationData.socket;

            self.socket.on('user-joined', function(data) {
                console.log('User [' + data.user.name + '] joined the game.');
            });

            self.socket.on('user-left', function(data) {
                console.log('User [' + data.user.name + '] joined the game.');
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

            if (params.activationData.game.players) {
                updateGameData(self, params.activationData.game.players);
            }
        };

        ViewModel.prototype.dispose = function() {
            var self = this;

            self.translator.dispose();
        };

        function updateGameData(self, gameData) {
            gameData = _.sortBy(gameData, 'score').reverse();
            self.players(gameData);
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
