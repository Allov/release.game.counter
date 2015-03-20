var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;

var Google = function(app, account) {
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    
    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });
    
    passport.use(new GoogleStrategy({
            returnURL: 'http://localhost:1337/auth/google/callback',
            realm: 'http://localhost:1337/'
        },
        function(identifier, profile, done) {
            account.createOrUpdate({
                id: identifier,
                name: profile.name.givenName
            });
            return done(null, profile);
        }));

    app.get('/auth/google', passport.authenticate('google'));
    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
            function(req, res) {
                // Successful authentication, redirect home.
                res.redirect('/');
            });
};

module.exports = Google;