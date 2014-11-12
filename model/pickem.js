var data = require('./data');

var Person = function(i,n,im) {
  this.id = i;
  this.name = n;
  this.image = im
   
  //calculated
  this.wins = 0;
  this.losses = 0;
}
 
var Team = function(i,n,o) {
  this.id = i;
  this.name = n;
  this.ownerId = o;
 
  //calculated data
  this.wins = 0;
  this.losses = 0;
  this.gamesplayed = 0;
}
 
var Game = function(date, time, awayId, homeId, awayScore, homeScore) {
  this.date = date;
  this.time = time;
  this.awayId = awayId;
  this.homeId = homeId;
  this.awayScore = awayScore;
  this.homeScore = homeScore;
 
  //calculated data
  this.winningTeamId = "";
  this.winningOwnerId = "";
}
 
var TodaysGame = function(awayId, homeId, time) {
  this.awayId = awayId;
  this.homeId = homeId;
  this.time = time;
   
  //caluclated data
  this.awayOwnerId = "";
  this.homeOwnerId = "";
}
 
// Controller
var Controller = function() {
  this.teams = [];
  this.people = [];
  this.games = [];
  this.todaysGames = [];
};
Controller.prototype.addTeam = function(i,n,o) {
  this.teams.push(new Team(i,n,o));
}
Controller.prototype.addPerson = function(i,n,im) {
  this.people.push(new Person(i,n,im));
}
Controller.prototype.addGame =
    function(date, time, awayId, homeId, awayScore, homeScore) {
  var game = new Game(date, time, awayId, homeId, awayScore, homeScore);
  this.playGame(game);
  this.games.push(game);
}
Controller.prototype.addTodaysGame = function(awayId, homeId, time) {
  var todaysGame = new TodaysGame(awayId, homeId, time);
  var awayOwnerId = this.findTeam(todaysGame.awayId).ownerId;
  var homeOwnerId = this.findTeam(todaysGame.homeId).ownerId;
  this.todaysGames.push(todaysGame);
}
Controller.prototype.playGame = function(game) {
  var winner;
  var loser;
  if (game.awayScore > game.homeScore) {
    winner = this.findTeam(game.awayId);
    loser = this.findTeam(game.homeId);
  } else {
    winner = this.findTeam(game.homeId);
    loser = this.findTeam(game.awayId);
  }
  if (winner) {
    winner.wins++;
    winner.gamesplayed++;
    game.winningTeamId = winner.id;
  } else {
    alert("could not find winner: " + game.date + " " + game.time);
  }
  if (loser) {
    loser.losses++;
    loser.gamesplayed++;
  } else {
    alert("could not find loser: " + game.date + " " + game.time);
  }
  var person = this.findPerson(winner.ownerId);
  if (person) {
    person.wins++;
    game.winningOwnerId = person.id;
  }
  var losingPerson = this.findPerson(loser.ownerId);
  if (losingPerson) {
    losingPerson.losses++;
  }
}
Controller.prototype.findTeam = function(id) {
  for (var i = 0; i < this.teams.length; i++) {
    if (this.teams[i].id == id) {
      return this.teams[i];
    }
  }
}
Controller.prototype.findPerson = function(id) {
  for (var i = 0; i < this.people.length; i++) {
    if (this.people[i].id == id) {
      return this.people[i];
    }
  }
}

var controller = new Controller();
data.injectData(controller);
controller.people.sort(function(a, b){return b.wins-a.wins});
controller.teams.sort(function(a, b){
  return (b.wins*1000 - b.losses) - (a.wins*1000 - a.losses);
});
exports.controller = controller;
