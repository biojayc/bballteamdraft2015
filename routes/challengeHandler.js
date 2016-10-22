var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    shared = require('./shared'),
    sessionManager = require('../sessionManager');

var getChallenges = function(controller, session) {
  var container = [];
  var challenges = controller.ownersHash[session.owner].challenges.slice();
  // challenges.sort(function(a, b){ return (b.pct - a.pct) * 100000 + (b.wins - a.wins) * 100 + (a.losses - b.losses); });
  for (var i = 0; i < challenges.length; i++) {
    var challenge = challenges[i];
    var game = controller.gamesHashByKey[challenge.key];
    var enemyOwner = null;
    var status = "pending";
    if (game.awayTeam && game.awayTeam.owner && game.awayTeam.ownerId == session.owner) {
      var enemyOwner = game.homeTeam ? (game.homeTeam.owner ? game.homeTeam.owner : null) : null;
      if (challenge.homeChallengeBit) {
        status = "<a onclick='acceptChallenge(\"" + game.key + "\")' style='cursor:pointer;'>accept</a>";
      }
    } else if (game.homeTeam && game.homeTeam.owner && game.homeTeam.ownerId == session.owner) {
      var enemyOwner = game.awayTeam ? (game.awayTeam.owner ? game.awayTeam.owner : null) : null;
    }
    container.push({
      gameKey: game.key,
      date: game.date,
      bid: challenge.newChallenge,
      homeTeamName: game.homeTeam.name,
      awayTeamName: game.awayTeam.name,
      ownerName: enemyOwner ? enemyOwner.name : "",
      ownerId: enemyOwner ? enemyOwner.id : "",
      ownerColor: enemyOwner ? enemyOwner.color : "",
      status: status,
    });
  }
  return container;
}

var mainPOST = function(req, res, session) {
  var controller = shared.controller();
  requestUtils.getPostObj(req, function(body) {
    var gameKey = body.gamekey;
    var challenge =  controller.challengesHash[gameKey];
    var owner = controller.ownersHash[session.owner];
    challenge.awayChallengeBit = 0;
    challenge.homeChallengeBit = 0;
    challenge.acceptedChallenge = challenge.newChallenge;
    challenge.newChallenge = 0;
    for (var i = 0; i < owner.challenges.length; i++) {
      var c = owner.challenges[i];
      if (c.key == gameKey) {
        owner.challenges.splice(i, 1);
        break;
      }
    }
    shared.redirectTo(res, '/challenges');
  });
}

var main = function(req, res, session) {
  var controller = shared.controller();
  var scores = shared.createScores(controller);
  var winningImage = shared.getWinningImage(controller);
  var challenges = getChallenges(controller, session);
  var obj = { 
    score: scores,
    image: winningImage,
    challenges: challenges,
  };
  layout.create("layouts/challenges.html", "layouts/layout.html", obj).renderResponse(res);
}

exports.main = main;
exports.mainPOST = mainPOST;