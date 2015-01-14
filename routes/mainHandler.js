var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    shared = require('./shared');

var createTodaysGames = function(controller) {
  var todaysgames = [];
  var games = controller.getGamesByDateOffset(0);
  for (var i = 0; i < games.length; i++) {
    var game = games[i];
    var time = game.time.replace(" ET", "");
    var awayTeam = game.awayTeam;
    var homeTeam = game.homeTeam
    var awayOwner = awayTeam.owner;
    var homeOwner = homeTeam.owner;
    var awayOwnerName = "";
    var homeOwnerName = "";
    if (awayOwner) { awayOwnerName = " (" + awayOwner.name + ")"; }
    if (homeOwner) { homeOwnerName = " (" + homeOwner.name + ")"; }
    todaysgames.push(
        { time: time, away: awayTeam.name + awayOwnerName, home: homeTeam.name + homeOwnerName});
  }
  return todaysgames;
}

var createYesterdaysGames = function(controller) {
  var yesterdaysgames = [];
  var games = controller.getGamesByDateOffset(-1);
  for (var i = 0; i < games.length; i++) {
    var game = games[i];
    var time = game.time.replace(" ET", "");
    var awayTeamName = game.awayTeam.name + " (" + game.awayScore + ")";
    var homeTeamName = game.homeTeam.name + " (" + game.homeScore + ")";
    if (game.winningTeam) {
      var owner = game.winningTeam.owner;
      if (game.winningTeam.id == game.awayId) {
        yesterdaysgames.push(
            { time: time, away: awayTeamName, home: homeTeamName, owner: owner ? owner.name : "",
              awayClass: "winner" });
      } else {
        yesterdaysgames.push(
            { time: time, away: awayTeamName, home: homeTeamName, owner: owner ? owner.name : "",
              homeClass: "winner" });
      }
    }
  }
  return yesterdaysgames;
}

var createTeams = function(controller) {
  var container = [];
  var teams = controller.teams.slice();
  teams.sort(function(a, b){ return b.pct - a.pct; });
  for (var i = 0; i < teams.length; i++) {
    var team = teams[i];
    var owner = team.owner;
    container.push({ name: team.name, wins: team.wins, losses: team.losses, 
                    pct: shared.formatWinningPercent(team.pct), owner: owner ? owner.name : "" });
  }
  return container;
}

var createTeamsByOwner = function(controller) {
  var tbos = [];
  for (var i = 0; i < controller.owners.length; i++) {
    var owner = controller.owners[i];
    var tbo = {};
    tbo.name = owner.name;
    tbo.person = owner;
    tbo.ownerteams = [];
    for (var j = 0; j < controller.teams.length; j++) {
      var team = controller.teams[j];
      if (team.ownerId == owner.id) {
        tbo.ownerteams.push(team);
      }
    }
    tbos.push(tbo);
  }
  return tbos;
}

var home = function(req, res) {
  var controller = shared.controller();
  var scores = shared.createScores(controller);
  var winningImage = shared.getWinningImage(controller);
  var vsTop = shared.createVsTop(controller);
  var vsRows = shared.createVsRows(controller);
  var todaysgames = createTodaysGames(controller);
  var yesterdaysgames = createYesterdaysGames(controller);
  var teams = createTeams(controller);
  var tbo = createTeamsByOwner(controller);
  
  var obj = { 
    score: scores,
    vstop: vsTop,
    vsrows: vsRows,
    todaysgames: todaysgames,
    yesterdaysgames: yesterdaysgames,
    teams: teams,
    image: winningImage,
    teamsbyowner: tbo,
  };
  var text = new layout.LayoutEngine(
      "index.html", "layout.html", obj).render();
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(text);
}

exports.home = home;
