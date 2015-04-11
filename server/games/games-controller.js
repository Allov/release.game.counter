var mongoose = require('mongoose');
var toSlug = require('slug');
var guid = require('node-uuid');

var Game = mongoose.model('Game', {
    id: String,
    slug: String,
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
        res.send({});
    });

    app.get('/api/games', function(req, res) {
        var slug = toSlug(req.query.name).toLowerCase();
        Game.findOne({
            slug: slug
        }, function(err, result) {
            if (result) {
                res.send({
                    id: result.id,
                    name: result.name,
                    slug: result.slug,
                    administratorId: result.administratorId,
                    players: result.players
                });
            } else {
                res.status(204).send('No content');
            }
        });
    });

    app.put('/api/games/:slug', function(req, res) {
        Game.findOne({
            slug: req.params.slug
        }, function(err, result) {
            if (!result) {
                res.status(404).send('Game "' + req.params.slug + '" was not found.');
                return;
            }

            if (result.administratorId && (!req.user || !req.user.logged_in || result.administratorId != req.user.profile.id)) {
                res.status(403).send('You are not the administrator of this game.');
                return;
            }

            if (req.body.name) {
                result.name = req.body.name;
            }
            if (req.body.description) {
                result.description = req.body.description;
            }
            if (req.body.players) {
                result.players = req.body.players;
            }
            if (req.body.slug) {
                result.name = req.body.slug;
            }

            result.save();

            res.send({
                    id: result.id,
                    name: result.name,
                    slug: result.slug,
                    description: result.description,
                    administratorId: result.administratorId,
                    players: result.players
                });
        });
    });

    app.post('/api/games', function(req, res) {

        if (!req.body.name) {
            res.status(400).send('Bad request! \'name\' is required.');
            return;
        }

        var slug = toSlug(req.body.name).toLowerCase();

        Game.findOne({
            slug: slug
        }, function(err, result) {
            if (result) {
                res.send({
                    id: result.id,
                    name: result.name,
                    slug: result.slug,
                    description: result.description,
                    administratorId: result.administratorId,
                    players: result.players
                });
            } else {
                var game = new Game({
                    id: guid.v4(),
                    slug: slug,
                    name: req.body.name,
                    description: req.body.description,
                    administratorId: req.user ? req.user.profile.id : null,
                    players: []
                });

                game.save();

                res.status(201).send({
                    id: game.id,
                    name: game.name,
                    slug: game.slug,
                    description: game.description,
                    administratorId: game.administratorId,
                    players: game.players
                });
            }
        });
    });
};

module.exports = GamesController;
