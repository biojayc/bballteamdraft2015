var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    controller = require('../model/pickem').controller;

var home = function(req, res) {
  //TODO: clean this crap up.  Move it somewhere else or something.
  var todaysgames = [];
  for (var i = 0; i < controller.todaysGames.length; i++) {
    var game = controller.todaysGames[i];
    var awayTeam = controller.findTeam(game.awayId);
    var homeTeam = controller.findTeam(game.homeId);
    var awayOwner = controller.findPerson(awayTeam.ownerId);
    var homeOwner = controller.findPerson(homeTeam.ownerId);
    var awayOwnerName = "";
    var homeOwnerName = "";
    if (awayOwner) { awayOwnerName = " (" + awayOwner.name + ")"; }
    if (homeOwner) { homeOwnerName = " (" + homeOwner.name + ")"; }
    todaysgames.push(
        { time: game.time, away: awayTeam.name + awayOwnerName, home: homeTeam.name + homeOwnerName});
  }
  
  var games = [];
  for (var i = controller.games.length - 1, count = 9; i >= 0 && count >= 0; i--,count--) {
    var game = controller.games[i];
    var awayTeam, homeTeam;
    var awayTeam = controller.findTeam(game.awayId).name + " (" + game.awayScore + ")";
    var homeTeam = controller.findTeam(game.homeId).name + " (" + game.homeScore + ")";
    var person = controller.findPerson(game.winningOwnerId);
    if (game.winningTeamId == game.awayId) {
      games.push(
          { date: game.date, away: awayTeam, home: homeTeam, person: person ? person.name : "",
            awayClass: "winner" });
    } else {
      games.push(
          { date: game.date, away: awayTeam, home: homeTeam, person: person ? person.name : "",
            homeClass: "winner" });
    }
  }
  
  var teams = [];
  for (var i = 0; i < controller.teams.length; i++) {
    var team = controller.teams[i];
    var person = controller.findPerson(team.ownerId);
    teams.push({ name: team.name, wins: team.wins, losses: team.losses, person: person ? person.name : "" });
  }
  
  var obj = { 
    score: controller.people,
    todaysgames: todaysgames,
    games: games,
    teams: teams,
    image: controller.people[0].image,
  };
  var text = new layout.LayoutEngine(
      "index.html", "layout.html", obj).Render();
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(text);
}

exports.home = home;
