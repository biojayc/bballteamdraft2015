var fs = require('fs'),
    scheduler = require('../scheduler');

var makeOwner = function(cols) {
  return {
    id: cols[0],
    name: cols[1],
    first: cols[2],
    initial: cols[3],
    color: cols[4],
    img: cols[5],
    password: cols[6],
  }
}

var makeTeam = function(cols) {
  return {
    id: cols[0],
    name: cols[1],
    owner: cols[2],
    conference: cols[3],
    division: cols[4],
  }
};

var makeGame = function(cols) {
  return {
    key: cols[0],
    date: cols[1],
    time: cols[2],
    awayId: cols[3],
    homeId: cols[4],
    awayScore: cols[5],
    homeScore: cols[6],
    isFinal: cols[7],
  }
}

var makeChallenge = function(cols) {
  return {
    key: cols[0],
    acceptedChallenge: cols[1],
    newChallenge: cols[2],
    awayChallengeBit: cols[3],
    homeChallengeBit: cols[4],
  }
}

var getOwners = function(cb) {
  var owners = [];
  fs.readFile("./data/owners", 'utf8', function(err, data) {
    var rows = data.split('\n');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var cols = row.split('\t');
      if (cols.length == 7) {
        owners.push(makeOwner(cols));
      }
    }
    cb(owners);
  });
}

var getTeams = function(cb) {
  var teams = [];
  fs.readFile("./data/teams", 'utf8', function(err, data) {
    var rows = data.split('\n');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var cols = row.split('\t');
      if (cols.length == 5) {
        teams.push(makeTeam(cols));
      }
    }
    cb(teams);
  });
}

var getGames = function(cb) {
  var games = [];
  fs.readFile("./data/games", 'utf8', function(err, data) {
    var rows = data.split('\n');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var cols = row.split('\t');
      if (cols.length == 8) {
        games.push(makeGame(cols));
      }
    }
    cb(games);
  });
}

var getChallenges = function(cb) {
  var challenges = [];
  fs.readFile("./data/challenges", "utf8", function(err, data) {
    var rows = data.split('\n');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var cols = row.split('\t');
      if (cols.length == 5) {
        challenges.push(makeChallenge(cols));
      }
    }
    cb(challenges);
  });
}

exports.injectData = function(controller, cb) {
  scheduler.create().add(function (cb) {
    getOwners(function(owners) {
      for (var i = 0; i < owners.length; i++) {
        var owner = owners[i];
        controller.addOwner(owner.id, owner.name, owner.first, owner.initial, owner.img, owner.color, owner.password);
      }
      cb();
    });
  }).add(function (cb) {
    getTeams(function(teams) {
      for(var i = 0; i < teams.length; i++) {
        var team = teams[i];
        controller.addTeam(team.id, team.name, team.owner, team.conference, team.division);
      }
      cb();
    });
  }).add(function(cb) {
    getGames(function(games) {
      for(var i = 0; i < games.length; i++) {
        var game = games[i];
        controller.addGame(game.key, game.date, game.time, game.awayId, game.homeId, parseInt(game.awayScore),
                           parseInt(game.homeScore), game.isFinal == 'true');
      }
      cb();
    });
  }).add(function(cb) {
    getChallenges(function(challenges) {
      for (var i = 0; i < challenges.length; i++) {
        var challenge = challenges[i];
        controller.addChallenge(challenge.key, parseInt(challenge.acceptedChallenge), parseInt(challenge.newChallenge),
                                challenge.awayChallengeBit == 'true', challenge.homeChallengeBit == 'true');
      }
      cb();
    });
  }).add(function(cb) {
    controller.calculate();
    cb();
  }).run(cb);
}
