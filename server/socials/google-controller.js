var configManager = require('./../../configuration/configManager');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var Google = function(app, accountsApi) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    var googleStrategy = new GoogleStrategy({
            clientID: configManager.get('google-clientId'),
            clientSecret: configManager.get('google-clientSecret'),
            callbackURL: 'http://' + configManager.get('hostname') + '/auth/google/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            accountsApi.createOrUpdate({
                id: profile.id,
                name: profile.name.givenName
            });

            return done(null, {
                id: profile.id,
                profile: profile
            });
        });

    passport.use(googleStrategy);

    app.get('/auth/google', passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login']
    }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });
};

module.exports = Google;
