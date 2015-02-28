'use strict';

var Game = function(name, admin) {
    this.name = name || '';
    this.admin = admin || null;
    this.inProgress = true;
};

module.exports = Game;