var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    shared = require('./shared'),
    errorHandler = require('./errorHandler');

var getVsTeams = function(controller, team) {
  var container = [];
  var teams = controller.teams;
  for (var i = 0; i < teams.length; i++) {
    var vsTeam = teams[i];
    if (team.id == vsTeam.id) {
      continue;
    }
    var wins = 0;
    var losses = 0;
    var pct = "0";
    var record = "0 - 0";
    if (team.otherTeamsDataHash[vsTeam.id]) {
      wins = team.otherTeamsDataHash[vsTeam.id].wins;
      losses = team.otherTeamsDataHash[vsTeam.id].losses;
      pct = team.otherTeamsDataHash[vsTeam.id].pct;
      record = wins + " - " + losses;
    }
    if (!wins && !losses) {
      continue;
    }
    container.push({
      id: vsTeam.id,
      name: vsTeam.name,
      record: record,
      pct: shared.formatWinningPercent(pct),
      ownerName: vsTeam.owner ? vsTeam.owner.name : "",
      rawPct: pct,
      wins: wins,
      losses: losses
    });
  }
  // sort by pct, then wins, then losses
  container.sort(function(a,b) {
    return (b.rawPct - a.rawPct) * 10000 + (b.wins - a.wins) * 100 - (b.losses - a.losses);
  });
  return container;
}

var getGames = function(controller, team) {
  var container = [];
  var games = team.games;
  var wins = 0, losses = 0;
  for (var i = 0; i < games.length; i++) {
    var game = games[i];
    if (game.winningTeam) {
      var oppOwnerName = '', oppOwnerColor = '', oppOwnerId = '';
      if (game.awayTeam.id == team.id) {
        var oppTeamScore = game.homeScore;
        var teamScore = game.awayScore;
        var oppTeamName = "@ " + game.homeTeam.name;
        if (game.homeTeam.owner) {
          oppOwnerName = game.homeTeam.owner.name;
          oppOwnerColor = game.homeTeam.owner.color;
          oppOwnerId = game.homeTeam.owner.id;
        }
      } else {
        var oppTeamScore = game.awayScore;
        var teamScore = game.homeScore;
        var oppTeamName = "vs " + game.awayTeam.name;
        if (game.awayTeam.owner) {
          oppOwnerName = game.awayTeam.owner.name;
          oppOwnerColor = game.awayTeam.owner.color;
          oppOwnerId = game.awayTeam.owner.id;
        }
      }
      if (game.winningTeam.id == team.id) {
        var score = "W " + teamScore + " - " + oppTeamScore;
        var scoreClass = 'win';
        wins++;
      } else {
        var score = "L " + oppTeamScore + " - " + teamScore;
        var scoreClass = 'loss';
        losses++;
      }
      var wl = wins + " - " + losses;
      container.push({
        date: game.date,
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
  
  var team;
  if (id && controller.teamsHash[id]) {
    team = controller.teamsHash[id];
  } else {
    errorHandler.error(req, res);
    return;
  }

  var vsTeams = getVsTeams(controller, team);
  var games = getGames(controller, team);
  var obj = { 
    score: scores,
    vstop: vsTop,
    vsrows: vsRows,
    image: winningImage,
    teamName: team.name,
    wins: team.wins,
    owner: team.owner ? team.owner.name : '',
    losses: team.losses,
    vsTeams: vsTeams,
    games: games,
  };
  layout.create("layouts/team.html", "layouts/layout.html", obj).renderResponse(res);  
}

exports.home = home;