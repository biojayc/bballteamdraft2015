var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    shared = require('./shared');

var createGames = function(games) {
  var container = [];
  for (var i = 0; i < games.length; i++) {
    var game = games[i];
    var time = game.time.replace(" ET", "");
    var awayTeamName = (game.awayScore ? '(' + game.awayScore + ') ' : '') + game.awayTeam.name;
    var homeTeamName = game.homeTeam.name + (game.homeScore ? ' (' + game.homeScore + ')' : '');
    var awayOwner = game.awayTeam.owner;
    var homeOwner = game.homeTeam.owner;
    var awayOwnerId = "";
    var homeOwnerId = "";
    var awayOwnerName = "";
    var homeOwnerName = "";
    var awayOwnerColor = "";
    var homeOwnerColor = "";
    var awayClass = "";
    var homeClass = "";
    if (awayOwner) {
      awayOwnerName = awayOwner.name;
      awayOwnerColor = awayOwner.color;
      awayOwnerId = awayOwner.id;
    }
    if (homeOwner) {
      homeOwnerName = homeOwner.name;
      homeOwnerColor = homeOwner.color;
      homeOwnerId = homeOwner.id;
    }
    if (game.winningTeam) {
      if (game.winningTeam.id === game.awayTeam.id) {
        awayClass = 'bold';
      } else {
        homeClass = 'bold';
      }
    }
    container.push(
        { time: time, 
          awayTeam: awayTeamName, 
          awayOwner: awayOwnerName, 
          awayOwnerColor: awayOwnerColor, 
          awayOwnerId: awayOwnerId,
          awayClass: awayClass,
          homeTeam: homeTeamName, 
          homeOwner: homeOwnerName, 
          homeOwnerColor: homeOwnerColor, 
          homeOwnerId: homeOwnerId,
          homeClass: homeClass,
        }
    );
  }
  return container;
}

var createTeams = function(controller) {
  var container = [];
  var teams = controller.teams.slice();
  teams.sort(function(a, b){ return b.pct - a.pct; });
  for (var i = 0; i < teams.length; i++) {
    var team = teams[i];
    var owner = team.owner;
    container.push({ 
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

var home = function(req, res) {
  var controller = shared.controller();
  var scores = shared.createScores(controller);
  var winningImage = shared.getWinningImage(controller);
  var vsTop = shared.createVsTop(controller);
  var vsRows = shared.createVsRows(controller);
  var todaysgames = createGames(controller.getGamesByDateOffset(0));
  var yesterdaysgames = createGames(controller.getGamesByDateOffset(-1));
  var teams = createTeams(controller);
  
  var obj = { 
    score: scores,
    vstop: vsTop,
    vsrows: vsRows,
    todaysgames: todaysgames,
    yesterdaysgames: yesterdaysgames,
    teams: teams,
    image: winningImage,
  };
  var text = new layout.LayoutEngine(
      "index.html", "layout.html", obj).render();
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(text);
}

exports.home = home;
