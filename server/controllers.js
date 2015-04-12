var controllers = {
    configure: function(app, io) {
        var Social = require('./socials/social-controller');
        new Social(app, io);

        var Accounts = require('./accounts/account-controller');
        new Accounts(app);

        var Games = require('./games/games-controller');
        new Games(app, io);
    }
};

module.exports = controllers;
