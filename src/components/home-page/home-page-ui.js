define(['text!./home-page.html', 'knockout', 'knockout-i18next-translator'],
    function(template, ko, Translator) {
        'use strict';
        
        var ViewModel = function(params, componentInfo) {
            var self = this;
            self.gameName = ko.observable();

            self.translator = new Translator();
            self.t = self.translator.t;
        };
        
        ViewModel.prototype.create = function() {
            var self = this;
            window.location = '/game/' + self.gameName();
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