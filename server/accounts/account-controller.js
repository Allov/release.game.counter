var AccountController = function(app) {
    app.get('/api/account', function(req, res) {
        res.send(req.user);
    });
    app.post('/api/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}

module.exports = AccountController;
