define(['text!./follow-bar.html', 'knockout-i18next-translator'],
    function(template, Translator) {
        'use strict';

        var FollowBar = function(params, componentInfo) {
            var self = this;
            self.translator = new Translator();
            self.t = self.translator.t;
        };

        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
        FollowBar.prototype.dispose = function() {
            var self = this;
            self.translator.dispose();
        };

        return {
            viewModel: {
                createViewModel: function(params, componentInfo) {
                    return new FollowBar(params, componentInfo);
                }
            },
            template: template
        };
    });
