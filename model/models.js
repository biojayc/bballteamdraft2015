exports.Owner = function(i,n,f,ini,im) {
  this.id = i;
  this.name = n;
  this.first = f;
  this.initial = ini;
  this.image = im
  
  //calculated data
  this.wins = 0;
  this.losses = 0;
  this.gamesPlayed = 0;
  this.pct = 0;
  this.teams = [];
  this.teamsHash = {};
  this.games = [];
  this.gamesHash = {};
  this.otherOwnersDataHash = {};  // used to store wins and losses vs other owners.  Owner Ids as keys
};

exports.Team = function(i,n,o) {
  this.id = i;
  this.name = n;
  this.ownerId = o;

  //calculated data
  this.wins = 0;
  this.losses = 0;
  this.gamesPlayed = 0;
  this.pct = 0;
  this.owner;
  this.games = [];
  this.gamesHash = {};
  this.otherTeamsDataHash = {};  // used to store wins and losses vs other teams.  Team Ids as keys
};

exports.Game = function(date, time, awayId, homeId, awayScore, homeScore) {
  this.date = date;
  this.time = time;
  this.awayId = awayId;
  this.homeId = homeId;
  this.awayScore = awayScore;
  this.homeScore = homeScore;

  //calculated data
  this.awayTeam;
  this.hometeam;
  this.winningTeam;
  this.losingTeam;
};
