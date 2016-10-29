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

var getGames = function(controller, games, ownerId, sessionOwner) {
  var container = [];
  var wins = 0, losses = 0, totalPoints = 0;
  for (var i = 0; i < games.length; i++) {
    var game = games[i];
    // filter out games that aren't for the current owner.
    if (ownerId && (ownerId != game.homeTeam.ownerId && ownerId != game.awayTeam.ownerId)) {
      continue;
    }
    var oppOwnerName = '', oppOwnerColor = '', oppOwnerId = '';
    if (game.awayTeam.ownerId == ownerId) {
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
    var challenge = controller.challengesHash[game.key];
    var bid = 0;
    if (challenge) {
      bid = challenge.acceptedChallenge;
    }
    var score = "";
    if (ownerId == sessionOwner) {
      if (challenge && (challenge.awayChallengeBit || challenge.homeChallengeBit)) {
        score = "pending";
      } else {
        score = "<a href='/challenge?id=" + game.key + "'>challenge</a>";
      }
    }
    var scoreClass = "";
    var wl = "";
    var points = "";
    if (game.winningTeam) {
      var winningOwner = game.winningTeam.owner;
      if (game.winningTeam.ownerId == ownerId && game.losingTeam.ownerId == ownerId) {
        score = "WL " + teamScore + " - " + oppTeamScore
        scoreClass = "winloss";
        totalPoints += 1;
        wins++;
        losses++;
        // var ownerName = winningOwner ? winningOwner.name : "";
      } else if (game.winningTeam.ownerId == ownerId) {
        score = "W " + teamScore + " - " + oppTeamScore
        scoreClass = 'win';
        totalPoints += 1 + bid;
        wins++;
        // var ownerName = winningOwner ? winningOwner.name : "";
      } else {
        score = "L " + oppTeamScore + " - " + teamScore
        scoreClass = 'loss';
        totalPoints -= bid;
        losses++;
        // var ownerName = winningOwner ? winningOwner.name : "";
      }
      wl = wins + " - " + losses;
      points = totalPoints;
    }
    container.push({
      date: game.date,
      name: teamName,
      oppName: oppTeamName,
      score: score,
      scoreClass: scoreClass,
      bid: bid > 0 ? bid : "",
      points: points,
      oppOwnerName: oppOwnerName,
      oppOwnerColor: oppOwnerColor,
      oppOwnerId: oppOwnerId,
    });
  }
  return container;
}

var home = function(req, res, session) {
  var id;
  var queryObj = requestUtils.getQueryObj(req);
  if (queryObj && queryObj['id']) {
    var id = queryObj['id'];
  }
  
  var controller = shared.controller();
  var scores = shared.createScores(controller);
  var winningImage = shared.getWinningImage(controller);
  
  var owner;
  if (id && controller.ownersHash[id]) {
    owner = controller.ownersHash[id];
  } else if (session.owner && controller.ownersHash[session.owner]) {
    owner = controller.ownersHash[session.owner];
  } else {
    errorHandler.error(req, res);
    return;
  }

  var teams = getOwnerTeams(controller, owner);
  var vsOwners = getVsOwners(controller, owner);
  var games = getGames(controller, controller.games, owner.id, session.owner);
  var obj = { 
    score: scores,
    image: winningImage,
    ownername: owner.name,
    wins: owner.wins,
    losses: owner.losses,
    teams: teams,
    vsOwners: vsOwners,
    games: games,
  };
  layout.create("layouts/owner.html", "layouts/layout.html", obj).renderResponse(res);  
}

exports.home = home;