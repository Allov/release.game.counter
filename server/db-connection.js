var mongoose = require('mongoose');

var db = function() {

};

db.prototype.connect = function(done) {
    mongoose.connect('mongodb://localhost');

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function(callback) {
        if (done) {
            done();
        }
    });

    this.connection = db;
}

module.exports = new db();
