var data = require('./data'),
    util = require('./util'),
    models = require('./models'),
    log = require('../log');

// Controller
var Controller = function() {
  this.owners = [];
  this.ownersHash = {};  // keyed by id.  value is owner object.
  this.teams = [];
  this.teamsHash = {};  // keyed by id.  value is team object.
  this.games = [];
  this.gamesHash = {};  // keyed by date.  value is array of games.
};
// Add an owner before adding any of his teams or games.
Controller.prototype.addOwner = function(i,n,f,ini,im,c) {
  var owner = new models.Owner(i,n,f,ini,im,c);
  this.ownersHash[i] = owner;
  this.owners.push(owner);
}
// Be sure the owner of the team has already been added.
Controller.prototype.addTeam = function(i,n,o) {
  var team = new models.Team(i,n,o);
  var owner = this.ownersHash[team.ownerId];
  if (owner) {
    owner.teams.push(team);
    owner.teamsHash[team.id] = team;
    team.owner = owner;
  }
  this.teamsHash[i] = team;
  this.teams.push(team);
}
// Be sure the teams that are in the game have already been added.
Controller.prototype.addGame = 
    function(date, time, awayId, homeId, awayScore, homeScore, isFinal) {
  var game = new models.Game(date, time, awayId, homeId, awayScore, homeScore, isFinal);
  this._calculateStatsForGame(game);
  if (!this.gamesHash[game.date]) {
    this.gamesHash[game.date] = [];
  }
  this.gamesHash[game.date].push(game);
  this.games.push(game);
  return game;
}
Controller.prototype._calculateStatsForGame = function(game) {
  // Joining game and teams.
  game.awayTeam = this.teamsHash[game.awayId];
  game.homeTeam = this.teamsHash[game.homeId];
  if (!game.awayTeam) {
    log.info('Could not find away team for game: ' + game.date + ' ' + game.time + ' ' + game.awayId + ' vs. ' + game.homeId);
  } else if (!game.homeTeam) {
    log.info('Could not find home team for game: ' + game.date + ' ' + game.time + ' ' + game.awayId + ' vs. ' + game.homeId);
  }
  game.awayTeam.games.push(game);
  if (!game.awayTeam.gamesHash[game.date]) {
    game.awayTeam.gamesHash[game.date] = [];
  }
  game.awayTeam.gamesHash[game.date].push(game);
  game.homeTeam.games.push(game);
  if (!game.homeTeam.gamesHash[game.date]) {
    game.homeTeam.gamesHash[game.date] = [];
  }
  game.homeTeam.gamesHash[game.date].push(game);
  
  //Calculating wins and losses for teams and owners
  if (game.isFinal) {
    if (game.awayScore > game.homeScore) {
      game.winningTeam = game.awayTeam;
      game.losingTeam = game.homeTeam;
    } else if (game.awayScore < game.homeScore){
      game.winningTeam = game.homeTeam;
      game.losingTeam = game.awayTeam;
    }
    if (game.winningTeam) {
      game.winningTeam.wins++;
      game.winningTeam.gamesPlayed++;
      game.winningTeam.pct = game.winningTeam.wins / game.winningTeam.gamesPlayed;
      if (game.losingTeam) {
        if (!game.winningTeam.otherTeamsDataHash[game.losingTeam.id]) {
          game.winningTeam.otherTeamsDataHash[game.losingTeam.id] = {};
          game.winningTeam.otherTeamsDataHash[game.losingTeam.id].wins = 0;
          game.winningTeam.otherTeamsDataHash[game.losingTeam.id].losses = 0;
          game.winningTeam.otherTeamsDataHash[game.losingTeam.id].gamesPlayed = 0;
          game.winningTeam.otherTeamsDataHash[game.losingTeam.id].pct = 0;
        }
        var vsStats = game.winningTeam.otherTeamsDataHash[game.losingTeam.id];
        vsStats.wins++;
        vsStats.gamesPlayed++;
        vsStats.pct = vsStats.wins / vsStats.gamesPlayed;
      }
    } else {
      log.info("could not find winner: " + game.date + " " + game.time);
    }
    if (game.losingTeam) {
      game.losingTeam.losses++;
      game.losingTeam.gamesPlayed++;
      game.losingTeam.pct = game.losingTeam.wins / game.losingTeam.gamesPlayed;
      if (game.winningTeam) {
        if (!game.losingTeam.otherTeamsDataHash[game.winningTeam.id]) {
          game.losingTeam.otherTeamsDataHash[game.winningTeam.id] = {};
          game.losingTeam.otherTeamsDataHash[game.winningTeam.id].wins = 0;
          game.losingTeam.otherTeamsDataHash[game.winningTeam.id].losses = 0;
          game.losingTeam.otherTeamsDataHash[game.winningTeam.id].gamesPlayed = 0;
          game.losingTeam.otherTeamsDataHash[game.winningTeam.id].pct = 0;
        }
        var vsStats = game.losingTeam.otherTeamsDataHash[game.winningTeam.id];
        vsStats.losses++;
        vsStats.gamesPlayed++;
        vsStats.pct = vsStats.wins / vsStats.gamesPlayed;
      }
    } else {
      alert("could not find loser: " + game.date + " " + game.time);
    }
    var winningOwner = game.winningTeam.owner;
    var losingOwner = game.losingTeam.owner;
    if (winningOwner) {
      winningOwner.wins++;
      winningOwner.gamesPlayed++;
      winningOwner.pct = winningOwner.wins / winningOwner.gamesPlayed;
      winningOwner.games.push(game);
      winningOwner.gamesHash[game.date] = game;
      if (losingOwner) {
        if (!winningOwner.otherOwnersDataHash[losingOwner.id]) {
          winningOwner.otherOwnersDataHash[losingOwner.id] = {};
          winningOwner.otherOwnersDataHash[losingOwner.id].wins = 0;
          winningOwner.otherOwnersDataHash[losingOwner.id].losses = 0;
          winningOwner.otherOwnersDataHash[losingOwner.id].gamesPlayed = 0;
          winningOwner.otherOwnersDataHash[losingOwner.id].pct = 0;
        }
        var vsStats = winningOwner.otherOwnersDataHash[losingOwner.id];
        vsStats.wins++;
        vsStats.gamesPlayed++;
        vsStats.pct = vsStats.wins / vsStats.gamesPlayed;
      }
    }
    if (losingOwner) {
      losingOwner.losses++;
      losingOwner.gamesPlayed++;
      losingOwner.pct = losingOwner.wins / losingOwner.gamesPlayed;
      // so that we don't add a game twice if both teams are owned by the same owner,
      // we need to make sure the winning and losing owner isn't the same.
      if (winningOwner.id != losingOwner.id) {
        losingOwner.games.push(game);
        losingOwner.gamesHash[game.date] = game;
      }
      if (winningOwner) {
        if (!losingOwner.otherOwnersDataHash[winningOwner.id]) {
          losingOwner.otherOwnersDataHash[winningOwner.id] = {};
          losingOwner.otherOwnersDataHash[winningOwner.id].wins = 0;
          losingOwner.otherOwnersDataHash[winningOwner.id].losses = 0;
          losingOwner.otherOwnersDataHash[winningOwner.id].gamesPlayed = 0;
          losingOwner.otherOwnersDataHash[winningOwner.id].pct = 0;
        }
        var vsStats = losingOwner.otherOwnersDataHash[winningOwner.id];
        vsStats.losses++;
        vsStats.gamesPlayed++;
        vsStats.pct = vsStats.wins / vsStats.gamesPlayed;
      }
    }
  }
}
Controller.prototype.getGamesByDateOffset = function(offset) {
  return this.gamesHash[util.getDateString(offset)] || [];
}
// use mm/dd/yyyy
Controller.prototype.getGamesByDate = function(date) {
  return this.gamesHash[date] || [];
}

exports.Controller = Controller;
