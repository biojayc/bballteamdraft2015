var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    shared = require('./shared'),
    sessionManager = require('../sessionManager');

var createTeams = function(controller) {
  var container = [];
  var teams = controller.teams.slice();
  teams.sort(function(a, b){ return (b.pct - a.pct) * 100000 + (b.wins - a.wins) * 100 + (a.losses - b.losses); });
  for (var i = 0; i < teams.length; i++) {
    var team = teams[i];
    var owner = team.owner;
    container.push({
      id: team.id,
      name: team.name,
      wins: team.wins,
      losses: team.losses,
      pct: shared.formatWinningPercent(team.pct),
      ownerName: owner ? owner.name : "",
      ownerId: owner ? owner.id : "",
      ownerColor: owner ? owner.color : "",
    });
  }
  return container;
}

var home = function(req, res, session) {
  var controller = shared.controller();
  var scores = shared.createScores(controller);
  var winningImage = shared.getWinningImage(controller);
  var vsTop = shared.createVsTop(controller);
  var vsRows = shared.createVsRows(controller);
  var todaysgames = shared.createGames(controller.getGamesByDateOffset(0));
  var yesterdaysgames = shared.createGames(controller.getGamesByDateOffset(-1));
  var teams = createTeams(controller);
  var moreDate = shared.getDateByOffset(new Date(), -2);
  var obj = { 
    score: scores,
    vstop: vsTop,
    vsrows: vsRows,
    todaysgames: todaysgames,
    yesterdaysgames: yesterdaysgames,
    moreDate: moreDate,
    teams: teams,
    image: winningImage,
  };
  layout.create("layouts/index.html", "layouts/layout.html", obj).renderResponse(res);
}

exports.home = home;
