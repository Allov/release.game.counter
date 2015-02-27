define(['text!./home-page.html', 'knockout'],
    function(template, ko) {
        'use strict';
        
        var ViewModel = function(params, componentInfo) {
            var self = this;
            self.gameName = ko.observable();
        };
        
        ViewModel.prototype.create = function() {
            var self = this;
            window.location = '/game/' + self.gameName();
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