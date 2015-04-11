'use strict';

var nconf = require('nconf');
var path = require('path');

function ConfigManager() {
	var fileName;

    console.log('NODE_ENV: ' + process.env.NODE_ENV);

    switch (process.env.NODE_ENV) {
        case 'tests':
            fileName = 'testConfig.json';
            break;
        case 'production':
            console.log('case!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            fileName = 'productionConfig.json';
            break;
        default:
            fileName = 'developmentConfig.json';
            break;
    }

    nconf.argv()
        .env()
        .file({
            file: path.join(__dirname, fileName)
        });

    return nconf;
}

module.exports = exports = new ConfigManager();
