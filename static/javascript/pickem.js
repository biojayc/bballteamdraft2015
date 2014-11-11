
// #######################
// ### PICKEM
// #######################
var pickem = pickem || {};

pickem.Person = function(i,n,im) {
  this.id = i;
  this.name = n;
  this.image = im
  this.score = 0;
};

pickem.Team = function(i,n,o) {
  this.id = i;
  this.name = n;
  this.ownerId = o;

  //calculated data
  this.wins = 0;
  this.losses = 0;
  this.gamesplayed = 0;
};

pickem.Game = function(date, time, awayId, homeId, awayScore, homeScore) {
  this.date = date;
  this.time = time;
  this.awayId = awayId;
  this.homeId = homeId;
  this.awayScore = awayScore;
  this.homeScore = homeScore;

  //calculated data
  this.winningTeamId = "";
  this.winningOwnerId = "";
};

pickem.TodaysGame = function(awayId, homeId, time) {
  this.awayId = awayId;
  this.homeId = homeId;
  this.time = time;
  
  //caluclated data
  this.awayOwnerId = "";
  this.homeOwnerId = "";
}


// Controller
pickem.Controller = function() {
  this.teams = [];
  this.people = [];
  this.games = [];
  this.todaysGames = [];
};
pickem.Controller.prototype.addTeam = function(i,n,o) {
  this.teams.push(new pickem.Team(i,n,o));
}
pickem.Controller.prototype.addPerson = function(i,n,im) {
  this.people.push(new pickem.Person(i,n,im));
}
pickem.Controller.prototype.addGame = 
    function(date, time, awayId, homeId, awayScore, homeScore) {
  var game = new pickem.Game(date, time, awayId, homeId, awayScore, homeScore);
  this.playGame(game);
  this.games.push(game);
}
pickem.Controller.prototype.addTodaysGame = function(awayId, homeId, time) {
  var todaysGame = new pickem.TodaysGame(awayId, homeId, time);
  var awayOwnerId = this.findTeam(todaysGame.awayId).ownerId;
  var homeOwnerId = this.findTeam(todaysGame.homeId).ownerId;
  this.todaysGames.push(todaysGame);
}
pickem.Controller.prototype.playGame = function(game) {
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
    person.score++;
    game.winningOwnerId = person.id;
  } else {
   // alert("could not find owner: " + game.date + " " + game.time + " " + winner.ownerId);
  }
}
pickem.Controller.prototype.findTeam = function(id) {
  for (var i = 0; i < this.teams.length; i++) {
    if (this.teams[i].id == id) {
      return this.teams[i];
    }
  }
}
pickem.Controller.prototype.findPerson = function(id) {
  for (var i = 0; i < this.people.length; i++) {
    if (this.people[i].id == id) {
      return this.people[i];
    }
  }
}

