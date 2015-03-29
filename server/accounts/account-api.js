var mongoose = require('mongoose');

var Account = mongoose.model('Account', {
    id: String,
    name: String
});

var api = function() {};

api.prototype.createOrUpdate = function(account) {
    var obj = new Account(account);

    Account.findOne({
        id: account.id
    }, function(err, result) {
        if (err) {
            console.log(err);
        }

        if (!result) {
            obj.save(function(err) {
                if (err) {
                    console.log(err);
                }
            });
        }

        console.log('Created account...');
    });
};

module.exports = api;
