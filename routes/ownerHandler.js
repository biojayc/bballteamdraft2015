var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    shared = require('./shared'),
    errorHandler = require('./errorHandler');

var getOwnerTeams = function(controller, owner) {
  var container = [];
  var teams = owner.teams.slice();
  teams.sort(function(a,b) { return b.pct - a.pct; });
  for (var i = 0; i < teams.length; i++) {
    var team = teams[i];
    container.push({
      name: team.name,
      wins: team.wins,
      losses: team.losses,
      pct: shared.formatWinningPercent(team.pct),
    });
  }
  return container;
}

var getVsOwners = function(controller, owner) {
  var container = [];
  var owners = controller.owners;
  for (var i = 0; i < owners.length; i++) {
    var vsOwner = owners[i];
    if (owner.id != vsOwner.id && owner.otherOwnersDataHash[vsOwner.id]) {
      var vsOwnerData = owner.otherOwnersDataHash[vsOwner.id];
      var wins = vsOwnerData.wins;
      var losses = vsOwnerData.losses;
      var pct = vsOwnerData.pct;
      var record = wins + " - " + losses;
      container.push({
        id: vsOwner.id,
        name: vsOwner.name,
        color: vsOwner.color,
        wins: wins,
        losses: losses,
        pct: shared.formatWinningPercent(pct),
        sort: pct,
      });
    }
  }
  container.sort(function (a,b) { return b.sort - a.sort; });
  return container;
}

var getGames = function(controller, owner) {
  var container = [];
  var games = owner.games;
  var wins = 0, losses = 0;
  for (var i = 0; i < games.length; i++) {
    var game = games[i];
    if (game.winningTeam) {
      var oppOwnerName = '', oppOwnerColor = '', oppOwnerId = '';
      if (game.awayTeam.ownerId == owner.id) {
        var oppTeamScore = game.homeScore;
        var teamScore = game.awayScore;
        var teamName = game.awayTeam.name;
        var oppTeamName = "@ " + game.homeTeam.name;
        if (game.homeTeam.owner) {
          oppOwnerName = game.homeTeam.owner.name;
          oppOwnerColor = game.homeTeam.owner.color;
          oppOwnerId = game.homeTeam.owner.id;
        }
      } else {
        var oppTeamScore = game.awayScore;
        var teamScore = game.homeScore;
        var teamName = game.homeTeam.name;
        var oppTeamName = "vs " + game.awayTeam.name;
        if (game.awayTeam.owner) {
          oppOwnerName = game.awayTeam.owner.name;
          oppOwnerColor = game.awayTeam.owner.color;
          oppOwnerId = game.awayTeam.owner.id;
        }
      }
      var winningOwner = game.winningTeam.owner;
      if (game.winningTeam.ownerId == owner.id && game.losingTeam.ownerId == owner.id) {
        var score = "WL " + teamScore + " - " + oppTeamScore
        var scoreClass = "winloss";
        wins++;
        losses++;
        // var ownerName = winningOwner ? winningOwner.name : "";
      } else if (game.winningTeam.ownerId == owner.id) {
        var score = "W " + teamScore + " - " + oppTeamScore
        var scoreClass = 'win';
        wins++;
        // var ownerName = winningOwner ? winningOwner.name : "";
      } else {
        var score = "L " + oppTeamScore + " - " + teamScore
        var scoreClass = 'loss';
        losses++;
        // var ownerName = winningOwner ? winningOwner.name : "";
      }
      var wl = wins + " - " + losses;
      container.push({
        date: game.date,
        name: teamName,
        oppName: oppTeamName,
        score: score,
        scoreClass: scoreClass,
        wl: wl,
        oppOwnerName: oppOwnerName,
        oppOwnerColor: oppOwnerColor,
        oppOwnerId: oppOwnerId,
      });
    }
  }
  return container;
}

var home = function(req, res) {
  var id;
  var queryObj = requestUtils.getQueryObj(req);
  if (queryObj && queryObj['id']) {
    var id = queryObj['id'];
  }
  
  var controller = shared.controller();
  var scores = shared.createScores(controller);
  var winningImage = shared.getWinningImage(controller);
  var vsTop = shared.createVsTop(controller);
  var vsRows = shared.createVsRows(controller);
  
  var owner;
  if (id && controller.ownersHash[id]) {
    owner = controller.ownersHash[id];
  } else {
    errorHandler.error(req, res);
    return;
  }

  var teams = getOwnerTeams(controller, owner);
  var vsOwners = getVsOwners(controller, owner);
  var games = getGames(controller, owner);
  var obj = { 
    score: scores,
    vstop: vsTop,
    vsrows: vsRows,
    image: winningImage,
    ownername: owner.name,
    wins: owner.wins,
    losses: owner.losses,
    teams: teams,
    vsOwners: vsOwners,
    games: games,
  };
  var text = new layout.LayoutEngine(
      "owner.html", "layout.html", obj).render();
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(text);
}

exports.home = home;