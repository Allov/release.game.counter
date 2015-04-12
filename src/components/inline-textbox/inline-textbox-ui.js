define(['text!./inline-textbox.html', 'knockout'],
    function(template, ko) {
        'use strict';

        var InlineTextbox = function(params, componentInfo) {
            var self = this;
            self.observable = params.observable;

            self.editing = ko.observable(false);

            self.edit = function() {
                self.editing(true);
            };

            self.edited = function() {
                if (self.observable.isValid()) {
                    self.editing(false);
                    if (params.edited) {
                        params.edited();
                    }
                }
            };
        };

        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
        InlineTextbox.prototype.dispose = function() {};

        return {
            viewModel: {
                createViewModel: function(params, componentInfo) {
                    return new InlineTextbox(params, componentInfo);
                }
            },
            template: template
        };
    });
