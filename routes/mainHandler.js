var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    shared = require('./shared'),
    sessionManager = require('../sessionManager');

var createTeams = function(controller) {
  var container = [];
  var teams = controller.teams.slice();
  teams.sort(function(a, b){ return (b.pct - a.pct) * 100000 + (b.wins - a.wins) * 100 + (a.losses - b.losses); });
  for (var i = 0; i < teams.length; i++) {
    var team = teams[i];
    var owner = team.owner;
    container.push({
      id: team.id,
      name: team.name,
      wins: team.wins,
      losses: team.losses,
      pct: shared.formatWinningPercent(team.pct),
      ownerName: owner ? owner.name : "",
      ownerId: owner ? owner.id : "",
      ownerColor: owner ? owner.color : "",
    });
  }
  return container;
}

var createGames = function(games) {
  var container = [];
  for (var i = 0; i < games.length; i++) {
    var game = games[i];
    var time = shared.formatTimeZone(shared.timezones.EASTERN, game.time);
    var awayTeamName = (game.awayScore ? '(' + game.awayScore + ') ' : '') + game.awayTeam.name;
    var homeTeamName = game.homeTeam.name + (game.homeScore ? ' (' + game.homeScore + ')' : '');
    var awayOwner = game.awayTeam.owner;
    var homeOwner = game.homeTeam.owner;
    var awayOwnerId = "";
    var homeOwnerId = "";
    var awayOwnerName = "";
    var homeOwnerName = "";
    var awayOwnerColor = "";
    var homeOwnerColor = "";
    var awayClass = "";
    var homeClass = "";
    if (awayOwner) {
      awayOwnerName = awayOwner.name;
      awayOwnerColor = awayOwner.color;
      awayOwnerId = awayOwner.id;
    }
    if (homeOwner) {
      homeOwnerName = homeOwner.name;
      homeOwnerColor = homeOwner.color;
      homeOwnerId = homeOwner.id;
    }
    if (game.winningTeam) {
      if (game.winningTeam.id === game.awayTeam.id) {
        awayClass = 'bold';
      } else {
        homeClass = 'bold';
      }
    }
    container.push({
      date: game.date,
      time: time,
      awayTeam: awayTeamName,
      awayOwner: awayOwnerName,
      awayOwnerColor: awayOwnerColor,
      awayOwnerId: awayOwnerId,
      awayClass: awayClass,
      homeTeam: homeTeamName,
      homeOwner: homeOwnerName,
      homeOwnerColor: homeOwnerColor,
      homeOwnerId: homeOwnerId,
      homeClass: homeClass,
    });
  }
  return container;
}

var getDateByOffset = function(startDate, offset) {
  var newDate = startDate;
  newDate.setDate(newDate.getDate() + offset);
  var dd = newDate.getDate();
  var mm = newDate.getMonth()+1; //January is 0!
  var yyyy = newDate.getFullYear();

  if(dd<10) {
    dd='0'+dd
  }

  if(mm<10) {
    mm='0'+mm
  }

  return yyyy + '' + mm + '' + dd;
}

var home = function(req, res, session) {
  var controller = shared.controller();
  var scores = shared.createScores(controller);
  var winningImage = shared.getWinningImage(controller);
  var vsTop = shared.createVsTop(controller);
  var vsRows = shared.createVsRows(controller);
  var todaysgames = createGames(controller.getGamesByDateOffset(0));
  var yesterdaysgames = createGames(controller.getGamesByDateOffset(-1));
  var teams = createTeams(controller);
  var moreDate = getDateByOffset(new Date(), -2);
  var obj = { 
    score: scores,
    vstop: vsTop,
    vsrows: vsRows,
    todaysgames: todaysgames,
    yesterdaysgames: yesterdaysgames,
    moreDate: moreDate,
    teams: teams,
    image: winningImage,
  };
  layout.create("layouts/index.html", "layouts/layout.html", obj).renderResponse(res);
}

var teamstandings = function (req, res, session) {
  var controller = shared.controller();
  var scores = shared.createScores(controller);
  var winningImage = shared.getWinningImage(controller);
  var vsTop = shared.createVsTop(controller);
  var vsRows = shared.createVsRows(controller);
  var teams = createTeams(controller);
  var obj = { 
    score: scores,
    vstop: vsTop,
    vsrows: vsRows,
    teams: teams,
    image: winningImage,
  };
  layout.create("layouts/teamstandings.html", "layouts/layout.html", obj).renderResponse(res);
}

var formatDate = function(dateStr) {
  var year = dateStr.substr(0, 4);
  var month = dateStr.substr(4, 2);
  var day = dateStr.substr(6, 2);
  var newDate = month + '/' + day + '/' + year;
  return newDate;
}

var games = function(req, res) {
  var dateStr = getDateByOffset(new Date(), 0);
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
  var games = createGames(controller.getGamesByDate(formattedDateStr));
  var previousDate = getDateByOffset(new Date(formattedDateStr), -1);
  var nextDate = getDateByOffset(new Date(formattedDateStr), 1);
  
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
  layout.create("layouts/games.html", "layouts/layout.html", obj).renderResponse(res);
}

exports.home = home;
exports.teamstandings = teamstandings;
exports.games = games;
