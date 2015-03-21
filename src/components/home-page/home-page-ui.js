define(['text!./home-page.html', 'knockout', 'knockout-i18next-translator', 'scorekeeper-api'],
    function(template, ko, Translator, api, undefined) {
        'use strict';
        
        var ViewModel = function(params, componentInfo) {
            var self = this;
            
            self.translator = new Translator();
            self.t = self.translator.t;
            
            self.google = function() {
                window.location = '/auth/google';
            };
            
            self.facebook = function() {
                window.location = '/auth/facebook';
            };
            
            self.isAuthenticated = ko.observable(!!api.user);
            
            self.content = ko.validatedObservable({
                gameName: ko.observable(undefined).extend({
                    required: {
                        message: self.t('general.game-name-required')()
                    },
                    gameIsUnique: {
                        message: self.t('general.game-already-exists')()
                    },
                    successValidatingMessage: {
                        validatingMessage: self.t('general.validating')(),
                        validMessage: ''
                    }
                })
            }).extend({
                bootstrapValidation: {}
            });
        };
        
        ViewModel.prototype.create = function() {
            var self = this;
            self.content.isValidAsync().then(function(isValid) {
                if (isValid) {
                    window.location = '/game/' + self.content().gameName();
                }
            });
            
        };
        
        
    
        ViewModel.prototype.dispose = function() {
            var self = this;

            self.translator.dispose();
        };

        return {
            viewModel: {
                createViewModel: function(params, componentInfo) {
                    return new ViewModel(params, componentInfo);
                }
            },
            template: template
        };
    });