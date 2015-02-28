//
// Koco's main entry point.
//

define([
        'knockout',
        './components',
        './knockout-configurator',
        'router',
        'dialoger',
        'modaler',
        'knockout-i18next'
    ],
    function(ko, components, knockoutConfigurator, router, dialoger, modaler, knockoutI18next) {
        'use strict';

        knockoutConfigurator.configure();

        knockoutI18next.init({
            lng: 'fr',
            getAsync: true,
            fallbackLng: 'fr',
            resGetPath: '/app/locales/__lng__/__ns__.json',
            ns: {
                namespaces: ['default'/*, 'another'*/],
                defaultNs: 'default',
            }
        }).then(function() {
            components.registerComponents();
    
            ko.applyBindings({
                router: router,
                dialoger: dialoger,
                modaler: modaler
            });
    
            dialoger.init();
            modaler.init();
            router.init();
        });
    });
