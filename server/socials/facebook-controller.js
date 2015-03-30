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
            clientID: '1564439337149572', //'1564434740483365',
            clientSecret: '***REMOVED***', //'***REMOVED***',
            callbackURL: 'http://localhost:1337/auth/facebook/callback'
        },
        function(accessToken, refreshToken, profile, done) {

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
