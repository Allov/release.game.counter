//
// Main component registry file. It is called once at application start. Any scaffolded component will be added here.
//

define(['knockout-utilities', 'router', 'dialoger', 'modaler'],
    function(koUtilities, router, dialoger, modaler) {
        'use strict';

        var Components = function() {};

        Components.prototype.registerComponents = function() {
            // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]
            
            //Register components, dialogs & pages here
            router.registerPage('home');
            router.addRoute('', {
                title: 'Home',
                pageName: 'home'
            });
        };

        return new Components();
    });
