define(['text!./page-not-found-page.html', 'knockout-i18next-translator'],
    function(template, Translator) {
        'use strict';

        var ViewModel = function(context, componentInfo) {
            var self = this;
            self.translator = new Translator();
            self.t = self.translator.t;
        };

        ViewModel.prototype.dispose = function() {
            var self = this;

            self.translator.dispose();
        };

        return {
            viewModel: {
                createViewModel: function(context, componentInfo) {
                    return new ViewModel(context, componentInfo);
                }
            },
            template: template
        };
    });
