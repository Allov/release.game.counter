'use strict';

var Game = function(name, admin) {
    this.name = name || '';
    this.players = [];
    this.admin = admin || null;
    this.inProgress = true;
};

module.exports = Game;