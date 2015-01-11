var Controller = require('../model/controller').Controller,
    cache = require('../cache'),
    data = require('../model/data');

var cache = new cache.CacheManager();

var controller = function() {
  return cache.get('controller', function() {
    var c = new Controller();
    data.injectData(c);
    return c;
  }, 3600);
}

exports.controller = controller;

var formatWinningPercent = function(pct) {
  var winningPercent = Math.round(pct * 1000);
  if (winningPercent == 0) {
    winningPercent = "000";
  } else if (winningPercent < 100) {
    winningPercent = "0" + winningPercent;
  }
  return "." + winningPercent;
}
exports.formatWinningPercent = formatWinningPercent;

exports.createScores = function(controller) {
  var scores = [];
  var owners = controller.owners.slice();
  owners.sort(function(a, b){return b.pct-a.pct});
  for (var i = 0; i < owners.length; i++) {
    var owner = owners[i];
    scores.push({ name: owner.name, wins: owner.wins, pct: formatWinningPercent(owner.pct) });
  }
  return scores;
}

exports.getWinningImage = function(controller) {
  var owners = controller.owners.slice();
  owners.sort(function(a, b){return b.pct-a.pct});
  return owners[0].image;
}

exports.createVsTop = function(controller) {
  var container = [];
  for (var i = 0; i < controller.owners.length; i++) {
    container.push({ initial: controller.owners[i].initial });
  }
  return container;
}

exports.createVsRows = function(controller) {
  var container = [];
  var owners = controller.owners;
  for (var i = 0; i < owners.length; i++) {
    var owner1 = owners[i];
    
    var cols = [];
    for (var j = 0; j < owners.length; j++) {
      var owner2 = owners[j];
      var wins;
      // This if is needed to prevent an owner with no teams from causing issues.
      if (owner1.otherOwnersDataHash[owner2.id]) {
        wins = owner1.otherOwnersDataHash[owner2.id].wins;
      } else {
        wins = 0;
      }
      cols.push({ wins: wins });
    }
    container.push({ first: owner1.first, vsrow: cols });
  }
  return container;
}