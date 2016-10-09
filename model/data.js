var fs = require('fs');

var owners = [
  { id: 'JS', name: 'Jerry Seiler', first: "Jerry", initial: "Je", color: "#cc5500", img: "/images/js.jpg" },
  { id: 'JRS', name: 'Jamie Smith', first: "Jamie", initial: "Ja", color: "red", img: "/images/jrs.jpg" },
  { id: 'BT', name: 'Brian Turley', first: "Brian", initial: "Br", color: "green", img: "/images/bt.gif" },
  { id: 'AK', name: 'Aaron Knoles', first: "Aaron", initial: "A", color: "blue", img: "/images/ak.gif" },
  { id: 'CS', name: 'Chris Seiler', first: "Chris", initial: "C", color: "grey", img: "/images/cs.jpg" },
  { id: 'MM', name: 'Mark Mullings', first: "Mark", initial: "M", color: "purple",  img: "/images/noimage.gif" },
  { id: 'WT', name: 'Wesley Thompson', first: "Wesley", initial: "W", color: "magenta", img: "/images/noimage.gif" },
  { id: 'MB', name: 'Michael Blow', first: "Michael", initial: "Mi", color: "brown", img: "/images/noimage.gif" },
  { id: 'ZD', name: 'Zack Deville', first: "Zach", initial: "Z", color: "DarkBlue", img: "/images/noimage.gif" },
  { id: 'BS', name: 'Blake Smith', first: "Blake", initial: "Bl", color: "#25383C", img: "/images/noimage.gif" }
];
var teams = [
  { id: 'CLE', name: 'Cleveland Cavaliers', owner: 'CS', conference: 'E', division: 'C' },
  { id: 'DAL', name: 'Dallas Mavericks', owner: 'BS', conference: 'W', division: 'SW' },
  { id: 'SAS', name: 'San Antonio Spurs', owner: 'AK', conference: 'W', division: 'SW' },
  { id: 'LAC', name: 'LA Clippers', owner: 'BT', conference: 'W', division: 'P' },
  { id: 'CHI', name: 'Chicago Bulls', owner: 'MB', conference: 'E', division: 'C' },
  { id: 'OKC', name: 'Oklahoma City Thunder', owner: 'MM', conference: 'W', division: 'NW' },
  { id: 'HOU', name: 'Houston Rockets', owner: 'JRS', conference: 'W', division: 'SW' },
  { id: 'GSW', name: 'Golden State Warriors', owner: 'JS', conference: 'W', division: 'P' },
  { id: 'MEM', name: 'Memphis Grizzlies', owner: 'WT', conference: 'W', division: 'SW' },
  { id: 'POR', name: 'Portland Trailblazers', owner: 'CS', conference: 'W', division: 'NW' },
  { id: 'TOR', name: 'Toronto Raptors', owner: 'BS', conference: 'E', division: 'A' },
  { id: 'WAS', name: 'Washington Wizards', owner: 'MB', conference: 'E', division: 'SE' },
  { id: 'IND', name: 'Indiana Pacers', owner: 'JRS', conference: 'E', division: 'C' },
  { id: 'CHA', name: 'Charlotte Hornets', owner: 'JS', conference: 'E', division: 'SE' },
  { id: 'PHX', name: 'Pheonix Suns', owner: 'BT', conference: 'W', division: 'P' },
  { id: 'MIA', name: 'Miami Heat', owner: 'WT', conference: 'E', division: 'SE' },
  { id: 'NOP', name: 'New Orleans Pelicans', owner: 'ZD', conference: 'W', division: 'SW' },
  { id: 'ATL', name: 'Atlanta Hawks', owner: 'ZD', conference: 'E', division: 'SE' },
  { id: 'DET', name: 'Detroit Pistons', owner: 'JRS', conference: 'E', division: 'C' },
  { id: 'NYK', name: 'New York Knicks', owner: 'BT', conference: 'E', division: 'A' },
  { id: 'ORL', name: 'Orlando Magic', owner: 'MB', conference: 'E', division: 'SE' },
  { id: 'LAL', name: 'LA Lakers', owner: 'MM', conference: 'W', division: 'P' },
  { id: 'MIN', name: 'Minnesota Timberwolves', owner: 'WT', conference: 'W', division: 'NW' },
  { id: 'DEN', name: 'Denver Nuggets', owner: 'ZD', conference: 'W', division: 'NW' },
  { id: 'BKN', name: 'Brooklyn Nets', owner: 'MM', conference: 'E', division: 'A' },
  { id: 'SAC', name: 'Sacramento Kings', owner: 'AK', conference: 'W', division: 'P' },
  { id: 'MIL', name: 'Milwaukee Bucks', owner: 'CS', conference: 'E', division: 'C' },
  { id: 'UTA', name: 'Utah Jazz', owner: 'JS', conference: 'W', division: 'NW' },
  { id: 'PHI', name: 'Philadelphia 76ers', owner: 'BS', conference: 'E', division: 'A' },
  { id: 'BOS', name: 'Boston Celtics', owner: 'AK', conference: 'E', division: 'A' },
];
var divisions = [
  { id: 'A', name: 'Atlantic', conference: 'E' },
  { id: 'C', name: 'Central', conference: 'E' },
  { id: 'SE', name: 'Southeast', conference: 'E' },
  { id: 'NW', name: 'Northwest', conference: 'W' },
  { id: 'P', name: 'Pacific', conference: 'W' },
  { id: 'SW', name: 'Southwest', conference: 'W' },
];

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

var getGames = function(cb) {
  var games = [];
  fs.readdir('./game_scraper/final/', function(err, files) {
    //get newest file
    if (files.length > 0) {
      var file = files[files.length-1];
      var path = './game_scraper/final/' + file;
      fs.readFile(path, 'utf8', function(err, data) {
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
  });
}

var getGames2 = function(cb) {
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
  for(var i = 0; i < owners.length; i++) {
    var owner = owners[i];
    controller.addOwner(owner.id, owner.name, owner.first, owner.initial, owner.img, owner.color);
  }
  for(var i = 0; i < teams.length; i++) {
    var team = teams[i];
    controller.addTeam(team.id, team.name, team.owner, team.conference, team.division);
  }
  getGames2(function(games) {
    for(var i = 0; i < games.length; i++) {
      var game = games[i];
      controller.addGame(game.key, game.date, game.time, game.awayId, game.homeId, parseInt(game.awayScore),
                         parseInt(game.homeScore), game.isFinal == 'true');
    }
    getChallenges(function(challenges) {
      for (var i = 0; i < challenges.length; i++) {
        var challenge = challenges[i];
        controller.addChallenge(challenge.key, parseInt(challenge.acceptedChallenge), parseInt(challenge.newChallenge),
                                challenge.awayChallengeBit == 'true', challenge.homeChallengeBit == 'true');
      }
      controller.calculate();
      cb();
    })
  });
}
