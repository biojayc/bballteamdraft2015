var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    shared = require('./shared');

var formatDate = function(dateStr) {
  var year = dateStr.substr(0, 4);
  var month = dateStr.substr(4, 2);
  var day = dateStr.substr(6, 2);
  var newDate = month + '/' + day + '/' + year;
  return newDate;
}

var home = function(req, res) {
  var dateStr = shared.getDateByOffset(new Date(), 0);
  var formattedDateStr = formatDate(dateStr);
  var queryObj = requestUtils.getQueryObj(req);
  if (queryObj && queryObj['date']) {
    var dateStr = queryObj['date'];
  }
  if (dateStr.length > 7) {
    formattedDateStr = formatDate(dateStr);
  }
  var controller = shared.controller();
  var scores = shared.createScores(controller);
  var winningImage = shared.getWinningImage(controller);
  var vsTop = shared.createVsTop(controller);
  var vsRows = shared.createVsRows(controller);
  var games = shared.createGames(controller.getGamesByDate(formattedDateStr));
  var previousDate = shared.getDateByOffset(new Date(formattedDateStr), -1);
  var nextDate = shared.getDateByOffset(new Date(formattedDateStr), 1);
  
  var obj = { 
    score: scores,
    vstop: vsTop,
    vsrows: vsRows,
    image: winningImage,
    date: formattedDateStr,
    games: games,
    previousDate: previousDate,
    nextDate: nextDate,
  };
  var text = new layout.LayoutEngine(
      "games.html", "layout.html", obj).render();
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(text);
}

exports.home = home;