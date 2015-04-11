define(['text!./game-view-page.html', 'knockout', 'lodash', 'knockout-i18next-translator'],
    function(template, ko, _, Translator) {
        'use strict';

        var ViewModel = function(context, componentInfo) {
            var self = this;

            self.translator = new Translator();
            self.t = self.translator.t;

            self.name = context.game.name;
            self.players = ko.observableArray([]);

            self.socket = context.socket;
            self.connected = ko.observable(self.socket.connected);
            self.viewerCount = ko.observable(context.game.viewers.length);

            self.socket.on('user-joined', function(data) {
                self.viewerCount(data.viewers.length);
            });

            self.socket.on('user-left', function(data) {
                self.viewerCount(data.viewers.length);
            });

            self.socket.on('disconnect', function() {
               self.connected(false);
            });

            self.socket.on('connect', function() {
                self.connected(true);
            });

            self.socket.on('game-data-update', function(gameData) {
                updateGameData(self, gameData);
            });

            if (context.game.players) {
                updateGameData(self, context.game.players);
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
                createViewModel: function(context, componentInfo) {
                    return new ViewModel(context, componentInfo);
                }
            },
            template: template
        };
    });
