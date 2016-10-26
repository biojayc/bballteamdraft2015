exports.Owner = function(i,n,f,ini,im,c,p) {
  this.id = i;
  this.name = n;
  this.first = f;
  this.initial = ini;
  this.image = im;
  this.color = c;
  this.password = p;
  
  //calculated data
  this.points = 0;
  this.wins = 0;
  this.losses = 0;
  this.gamesPlayed = 0;
  this.pct = 0;
  this.teams = [];
  this.teamsHash = {};
  this.games = [];
  this.gamesHash = {};
  this.challenges = [];
  this.challengesHash = {};
  this.otherOwnersDataHash = {};  // used to store wins and losses vs other owners.  Owner Ids as keys
};

exports.Team = function(i,n,o,c,d) {
  this.id = i;
  this.name = n;
  this.ownerId = o;
  this.conference = c;
  this.division = d;

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

exports.Game = function(key, date, time, awayId, homeId, awayScore, homeScore, isFinal) {
  this.key = key;
  this.date = date;
  this.time = time;
  this.awayId = awayId;
  this.homeId = homeId;
  this.awayScore = awayScore;
  this.homeScore = homeScore;
  this.isFinal = isFinal;

  //calculated data
  this.awayTeam;
  this.hometeam;
  this.winningTeam;
  this.losingTeam;
};

exports.Challenge = function(key, acceptedChallenge, newChallenge, awayChallengeBit, homeChallengeBit) {
  this.key = key;
  this.acceptedChallenge = acceptedChallenge;
  this.newChallenge = newChallenge;
  this.awayChallengeBit = awayChallengeBit;
  this.homeChallengeBit = homeChallengeBit;
}
