//
// Here you can modify the require.js configuration. This is the require.js configuration object as per http://requirejs.org/docs/api.html#config.
//

var require = {
    baseUrl: '/',
    paths: {
        'configs': './app/configs/configs',
        'configs-transforms': './app/configs/configs.local',
        'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',
        'jquery': 'bower_components/jquery/dist/jquery',
        'byroads': 'bower_components/byroads.js/dist/byroads',
        'knockout': 'bower_components/knockout/dist/knockout',
        'knockout-mapping': 'bower_components/knockout-mapping/knockout.mapping',
        'text': 'bower_components/requirejs-text/text',
        'lodash': 'bower_components/lodash/lodash',
        'knockout-validation': 'bower_components/knockout-validation/dist/knockout.validation',
        'dialoger': 'bower_components/knockout-dialoger/src/dialoger',
        'modaler': 'bower_components/knockout-modaler/src/modaler',
        'router': 'bower_components/knockout-router/src/router',
        'knockout-utilities': 'bower_components/knockout-utilities/src/knockout-utilities',
        'router-event': 'bower_components/knockout-router/src/router-event',
        'router-state': 'bower_components/knockout-router-state-push/src/router-state-push',
        'nav-bar': 'components/nav-bar/nav-bar',
        'socketio': 'bower_components/socket.io-client/socket.io',
        'knockout-i18next': 'bower_components/knockout-i18next/src/knockout-i18next',
        'i18next': 'bower_components/i18next/i18next.amd',
        'knockout-mutex': 'bower_components/knockout-mutex/src/knockout-mutex',
        'knockout-i18next-translator': 'bower_components/knockout-i18next/src/knockout-i18next-translator',
        'typehead': 'bower_components/typehead.js/dist/typeahead.jquery',
        'bloodhound': 'bower_components/typehead.js/dist/bloodhound'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'typehead': {
            deps: ['jquery', 'bloodhound']
        },
        'knockout.validation': {
            deps: ['knockout']
        },
        'knockout-mapping': {
            deps: ['knockout']
        }
    }
};