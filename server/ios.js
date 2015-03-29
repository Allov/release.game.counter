var Ios = {
    configure: function(io) {
        var Games = require('./games/games-io');
        new Games(io);
    }
};

module.exports = Ios;
