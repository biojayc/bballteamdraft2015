var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    shared = require('./shared'),
    sessionManager = require('../sessionManager');

var createOwners = function(controller) {
  var container = [];
  var owners = controller.owners.slice();
  owners.sort(function(a, b){ return b.pct - a.pct; });
  for (var i = 0; i < owners.length; i++) {
    var owner = owners[i];
    container.push({
      id: owner.id,
      name: owner.name,
      pct: shared.formatWinningPercent(owner.pct),
      ownerColor: owner.color,
      image: owner.image,
    });
  }
  return container;
}

var login = function(req, res) {
  var controller = shared.controller();
  var scores = shared.createScores(controller);
  var winningImage = shared.getWinningImage(controller);
  var owners = createOwners(controller);
  var obj = { 
    score: scores,
    image: winningImage,
    owners: owners,
  };

  layout.create("layouts/login.html", "layouts/layout.html", obj).renderResponse(res);
}

var loginPOST = function(req, res, session) {
  requestUtils.getPostObj(req, function(body) {
      console.log("form password: " + body.password);
    if (body.owner) {
      var owner = shared.controller().ownersHash[body.owner];
      console.log("owner password: " + owner.password);
      if (owner.password === body.password) {

        sessionManager.getSession(session.sessionId).owner = body.owner;  
      }
    }
    shared.redirectToHome(res);
  });
}

var logout = function(req, res, session) {
  session.owner = null;
  shared.redirectToHome(res);
}

exports.login = login;
exports.loginPOST = loginPOST;
exports.logout = logout;