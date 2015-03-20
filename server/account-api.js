var mongoose = require('mongoose');

var Account = mongoose.model('Account', {
    id: String,
    name: String
});

var api = function() {
    
    
};

api.prototype.createOrUpdate = function(account) {
    mongoose.connect('mongodb://localhost');
    
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    
    var obj = new Account(account);
    
    db.once('open', function (callback) {
        
        Account.findOne({id: account.id}, function(err, result) {
            if (err) {
                console.log(err);
            }
            
            if (!result) {
                obj.save(function(err) {
                    console.log(err);
                });
            }
        });
    });
};

module.exports = api;