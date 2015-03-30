var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    shared = require('./shared'),
    errorHandler = require('./errorHandler');

var getTeams = function(teams) {
  var container = [];
  teams.sort(function(a, b){ return b.pct - a.pct; });
  for (var i = 0; i < teams.length; i++) {
    var team = teams[i];
    var owner = team.owner;
    container.push({
      id: team.id,
      name: team.name,
      wins: team.wins,
      losses: team.losses,
      pct: shared.formatWinningPercent(team.pct),
      rank: (i+1),
      ownerName: owner ? owner.name : "",
      ownerId: owner ? owner.id : "",
      ownerColor: owner ? owner.color : "",
    });
  }
  return container;
}

var home = function(req, res) {
  var c;
  var queryObj = requestUtils.getQueryObj(req);
  if (queryObj && queryObj['c']) {
    var c = queryObj['c'];
  }
  
  var controller = shared.controller();
  var scores = shared.createScores(controller);
  var winningImage = shared.getWinningImage(controller);
  var vsTop = shared.createVsTop(controller);
  var vsRows = shared.createVsRows(controller);
  
  var teams = controller.teams.filter(function (el) {
    return el.conference == c;
  });

  var container = getTeams(teams);
  var obj = { 
    score: scores,
    vstop: vsTop,
    vsrows: vsRows,
    image: winningImage,
    teams: container,
  };
  new layout.LayoutEngine(
      "layouts/conference.html", "layouts/layout.html", obj).render(function(html) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
      });
  
}

exports.home = home;