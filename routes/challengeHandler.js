var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    shared = require('./shared'),
    sessionManager = require('../sessionManager');

var createChallengePOST = function(req, res, session) {
  var controller = shared.controller();
  requestUtils.getPostObj(req, function(body) {
    var gameKey;
    var bid;
    if (body && body.gameKey) {
      gameKey = body.gameKey;
      bid = body.bid;
    } else {
      shared.renderGeneric(res, 'Error', 'No game key specified');
      return;
    }
    if (!bid || bid <= 0 || bid > 5) {
      shared.renderGeneric(res, 'Error', 'Invalid bid');
      return;
    }
    var game = controller.gamesHashByKey[gameKey];
    var challenge = controller.challengesHash[gameKey];
    if (!challenge || !game) {
      // Once controller reloads once, this situation shouldn't ever happen, so we just
      // won't handle it.
      shared.renderGeneric(res, 'Error', 'Game doesn\'t exist or challenge hasn\'t been instantiated yet');
      return;
    } else {
      var awayOwner = game.awayTeam.ownerId ? game.awayTeam.owner : null;
      var homeOwner = game.homeTeam.ownerId ? game.homeTeam.owner : null;
      if (!awayOwner || !homeOwner) {
        shared.renderGeneric(res, 'Error', 'Can\'t issue a challenge if there isn\'t two teams');
        return;
      }
      if (homeOwner.id == session.owner) {
        challenge.homeChallengeBit = true;
        if (bid > homeOwner.points) bid = homeOwner.points;
        if (bid < 0 ) {
          shared.renderGeneric(res, 'Error', 'Can\'t issue a bid for 0 or less.');
          return;
        }
        challenge.newChallenge = bid;
      } else if (awayOwner.id == session.owner) {
        challenge.awayChallengeBit = true;
        if (bid > awayOwner.points) bid = awayOwner.points;
        if (bid < 0 ) {
          shared.renderGeneric(res, 'Error', 'Can\'t issue a bid for 0 or less.');
          return;
        }
        challenge.newChallenge = bid;
      }
      awayOwner.challenges.push(challenge);
      awayOwner.challengesHash[game.key] = challenge;
      homeOwner.challenges.push(challenge);
      homeOwner.challengesHash[game.key] = challenge;
    }
    shared.redirectTo(res, "/owner");
  });
}

var createChallenge = function(req, res, session) {
  var controller = shared.controller();
  var queryObj = requestUtils.getQueryObj(req);
  var gameKey = null
  if (queryObj && queryObj['id']) {
    var gameKey = queryObj['id'];
  }
  if (!gameKey) {
    shared.redirectToHome(res);
    return;
  }
  var game = controller.gamesHashByKey[gameKey];
  if (!game) {
    shared.renderGeneric(res, 'Error', 'That game doesn\'t seem to exist.');
    return;
  }
  if (!game.awayTeam || !game.awayTeam.owner) {
    shared.renderGeneric(res, 'Error', 'No away team or owner');
    return;
  }
  if (!game.homeTeam || !game.homeTeam.owner) {
    shared.renderGeneric(res, 'Error', 'No home team or owner');
    return;
  }
  var challenge = controller.challengesHash[gameKey];
  if (challenge && (challenge.awayChallengeBit || challenge.homeChallengeBit)) {
    shared.renderGeneric(res, 'Error', 'There\'s a pending challenge for that game already.');
    return;
  }

  var controller = shared.controller();
  var scores = shared.createScores(controller);
  var winningImage = shared.getWinningImage(controller);
  var obj = { 
    score: scores,
    image: winningImage,
    gameKey: gameKey,
  };
  layout.create("layouts/challenge.html", "layouts/layout.html", obj).renderResponse(res);
}

var acceptChallengePOST = function(req, res, session) {
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
    shared.redirectTo(res, '/owner');
  });
}

exports.createChallenge = createChallenge;
exports.createChallengePOST = createChallengePOST;
exports.acceptChallengePOST = acceptChallengePOST;