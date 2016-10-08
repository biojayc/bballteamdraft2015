var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    shared = require('./shared');

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
  var vsTop = shared.createVsTop(controller);
  var vsRows = shared.createVsRows(controller);
  var owners = createOwners(controller);
  var obj = { 
    score: scores,
    vstop: vsTop,
    vsrows: vsRows,
    image: winningImage,
    owners: owners,
  };

  new layout.LayoutEngine(
      "layouts/login.html", "layouts/layout.html", obj).render(
        function(html) {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(html);
        });
}

var logout = function(req, res) {
  res.writeHead(302, {'Location': '/', 'Set-Cookie': 'owner='});
  res.end("");
}

exports.login = login;
exports.logout = logout;