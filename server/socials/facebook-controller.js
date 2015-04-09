var configManager = require('./../../configuration/configManager');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var Facebook = function(app, accountsApi) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new FacebookStrategy({
            clientID: configManager.get('facebook-clientId'),
            clientSecret: configManager.get('facebook-clientSecret'),
            callbackURL: 'http://' + configManager.get('hostname') + '/auth/facebook/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            accountsApi.createOrUpdate({
                id: profile.id,
                name: profile.name.givenName
            });

            // create account
            done(null, {
                id: profile.id,
                profile: profile
            });
        }));

    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/auth/facebook'
        }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });
};

module.exports = Facebook;
