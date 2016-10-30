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
      if (challenge.awayChallengeBit) {
        status = "<a onclick='acceptChallenge(\"" + game.key + "\")' style='cursor:pointer;'>accept</a>";
      }
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

var createChallengePOST = function(req, res, session) {
  var controller = shared.controller();
  requestUtils.getPostObj(req, function(body) {
    var gameKey;
    var bid;
    if (body && body.gameKey) {
      gameKey = body.gameKey;
      bid = body.bid;
    }
    var game = controller.gamesHashByKey[gameKey];
    var challenge = controller.challengesHash[gameKey];
    if (!bid || bid <= 0) {
      shared.renderGeneric('Error', 'Invalid bid');
      return;
    }
    if (!challenge) {
      // Once controller reloads once, this situation shouldn't ever happen, so we just
      // won't handle it.
      shared.renderGeneric('Error', 'Challenge hasn\'t been instantiated yet');
      return;
    } else {
      var awayOwner = game.awayTeam.ownerId ? game.awayTeam.owner : null;
      var homeOwner = game.homeTeam.ownerId ? game.homeTeam.owner : null;
      if (game.homeTeam.ownerId && game.homeTeam.ownerId == session.owner) {
        challenge.homeChallengeBit = true;
        challenge.newChallenge = bid;
        if (awayOwner) {
          awayOwner.challenges.push(challenge);
          awayOwner.challengesHash[game.key] = challenge;
        }
        if (homeOwner) {
          homeOwner.challenges.push(challenge);
          homeOwner.challengesHash[game.key] = challenge;
        }
      } else if (game.awayTeam.ownerId && game.awayTeam.ownerId == session.owner) {
        challenge.awayChallengeBit = true;
        challenge.newChallenge = bid;
        if (awayOwner) {
          awayOwner.challenges.push(challenge);
          awayOwner.challengesHash[game.key] = challenge;
        }
        if (homeOwner) {
          homeOwner.challenges.push(challenge);
          homeOwner.challengesHash[game.key] = challenge;
        }
      }
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