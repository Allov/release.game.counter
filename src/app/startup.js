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
        'knockout-i18next',
        'scorekeeper-api'
    ],
    function(ko, components, knockoutConfigurator, router, dialoger, modaler, knockoutI18next, api) {
        'use strict';

        knockoutConfigurator.configure();

        var localStorage = window.localStorage;
        var language = (window.navigator.userLanguage || window.navigator.language);
        var defaultLanguage = 'en';

        if (language) {
            defaultLanguage = language.indexOf('fr') > -1 ? 'fr' : 'en';
        }

        if (localStorage) {
            var storedLanguage = localStorage.getItem("preferedLanguage");

            if (storedLanguage) {
                defaultLanguage = storedLanguage;
            } else {
                localStorage.setItem("preferedLanguage", defaultLanguage);
            }
        }

        knockoutI18next.init({
            lng: defaultLanguage,
            getAsync: true,
            fallbackLng: 'fr',
            resGetPath: '/app/locales/__lng__/__ns__.json',
            ns: {
                namespaces: ['default'/*, 'another'*/],
                defaultNs: 'default',
            }
        }).then(function() {
            knockoutI18next.lng.subscribe(function(value) {
                if (window.localStorage) {
                    window.localStorage.setItem("preferedLanguage", value);
                }
            });

            api.init().then(function() {
                components.registerComponents();

                ko.applyBindings({
                    router: router,
                    dialoger: dialoger,
                    modaler: modaler
                });

                dialoger.init();
                modaler.init();
                router.init();

                router.unknownRouteHandler = function() {
                    router.navigate('/page-not-found');
                };
            });
        });
    });
