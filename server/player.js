'use strict';

var Player = function(name) {
    this.name = '';
    this.score = 0;
};

Player.prototype.add = function(score) {
    this.score = this.score + score;
};

module.exports = Player;