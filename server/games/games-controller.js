var mongoose = require('mongoose');

var Game = mongoose.model('Game', {
    id: String,
    name: String,
    description: String,
    administratorId: String,
    players: []
});

var GamesController = function(app) {


    app.get('/api/games/most-popular', function(req, res) {
        res.send({});
    });

    app.get('/api/games/search/:term', function(req, res) {
        var games = api.searchGames(req.params.term);
        res.send({});
    });

    app.get('/api/games', function(req, res) {
        Game.findOne({
            name: req.query.name
        }, function(err, result) {
            if (result) {
                res.send({
                    name: result.name,
                    administratorId: result.administratorId,
                    players: result.players
                });
            } else {
                res.status(204).send('No content');
            }
        });
    });
};

module.exports = GamesController;
