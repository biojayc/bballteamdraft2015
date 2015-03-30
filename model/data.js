var fs = require('fs');

var owners = [
  { id: 'MM', name: 'Mark Mullings', first: "Mark", initial: "M", color: "purple",  img: "/images/noimage.gif" },
  { id: 'WT', name: 'Wesley Thompson', first: "Wesley", initial: "W", color: "magenta", img: "/images/noimage.gif" },
  { id: 'CS', name: 'Chris Seiler', first: "Chris", initial: "C", color: "grey", img: "/images/cs.jpg" },
  { id: 'BT', name: 'Brian Turley', first: "Brian", initial: "Br", color: "green", img: "/images/bt.gif" },
  { id: 'AK', name: 'Aaron Knoles', first: "Aaron", initial: "A", color: "blue", img: "/images/ak.gif" },
  { id: 'JS', name: 'Jerry Seiler', first: "Jerry", initial: "Je", color: "#cc5500", img: "/images/js.jpg" },
  { id: 'JRS', name: 'Jamie Smith', first: "Jamie", initial: "Ja", color: "red", img: "/images/jrs.jpg" },
  { id: 'BS', name: 'Blake Smith', first: "Blake", initial: "Bl", color: "yellow", img: "/images/noimage.gif" }
];
var teams = [
  { id: 'CLE', name: 'Cleveland Cavaliers', owner: 'MM', conference: 'E' },
  { id: 'DAL', name: 'Dallas Mavericks', owner: 'WT', conference: 'W' },
  { id: 'SAS', name: 'San Antonio Spurs', owner: 'CS', conference: 'W' },
  { id: 'LAC', name: 'LA Clippers', owner: 'BT', conference: 'W' },
  { id: 'CHI', name: 'Chicago Bulls', owner: 'AK', conference: 'E' },
  { id: 'OKC', name: 'Oklahoma City Thunder', owner: 'JS', conference: 'W' },
  { id: 'HOU', name: 'Houston Rockets', owner: 'JRS', conference: 'W' },
  { id: 'GSW', name: 'Golden State Warriors', owner: 'JRS', conference: 'W' },
  { id: 'MEM', name: 'Memphis Grizzlies', owner: 'JS', conference: 'W' },
  { id: 'POR', name: 'Portland Trailblazers', owner: 'AK', conference: 'W' },
  { id: 'TOR', name: 'Toronto Raptors', owner: 'BT', conference: 'E' },
  { id: 'WAS', name: 'Washington Wizards', owner: 'CS', conference: 'E' },
  { id: 'IND', name: 'Indiana Pacers', owner: 'WT', conference: 'E' },
  { id: 'CHA', name: 'Charlotte Hornets', owner: 'MM', conference: 'E' },
  { id: 'PHX', name: 'Pheonix Suns', owner: 'BT', conference: 'W' },
  { id: 'MIA', name: 'Miami Heat', owner: 'AK', conference: 'E' },
  { id: 'NOP', name: 'New Orleans Pelicans', owner: 'JRS', conference: 'W' },
  { id: 'ATL', name: 'Atlanta Hawks', owner: 'JS', conference: 'E' },
  { id: 'DET', name: 'Detroit Pistons', owner: 'CS', conference: 'E' },
  { id: 'NYK', name: 'New York Knicks', owner: 'WT', conference: 'E' },
  { id: 'ORL', name: 'Orlando Magic', owner: 'MM', conference: 'E' },
  { id: 'LAL', name: 'LA Lakers', owner: 'MM', conference: 'W' },
  { id: 'MIN', name: 'Minnesota Timberwolves', owner: 'WT', conference: 'W' },
  { id: 'DEN', name: 'Denver Nuggets', owner: 'CS', conference: 'W' },
  { id: 'BKN', name: 'Brooklyn Nets', owner: 'JS', conference: 'E' },
  { id: 'SAC', name: 'Sacramento Kings', owner: 'JRS', conference: 'W' },
  { id: 'MIL', name: 'Milwaukee Bucks', owner: 'AK', conference: 'E' },
  { id: 'UTA', name: 'Utah Jazz', owner: 'BT', conference: 'W' },
  { id: 'PHI', name: 'Philadelphia 76ers', owner: 'BS', conference: 'E' },
  { id: 'BOS', name: 'Boston Celtics', owner: 'BS', conference: 'E' },
];

var makeGame = function(cols) {
  return {
    date: cols[0],
    time: cols[1],
    awayId: cols[2],
    homeId: cols[3],
    awayScore: cols[4],
    homeScore: cols[5],
    isFinal: cols[6],
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
          if (cols.length == 7) {
            games.push(makeGame(cols));
          }
        }
        cb(games);
      });

    }
  });
}

exports.injectData = function(controller, cb) {
  for(var i = 0; i < owners.length; i++) {
    var owner = owners[i];
    controller.addOwner(owner.id, owner.name, owner.first, owner.initial, owner.img, owner.color);
  }
  for(var i = 0; i < teams.length; i++) {
    var team = teams[i];
    controller.addTeam(team.id, team.name, team.owner, team.conference);
  }
  getGames(function(games) {
    for(var i = 0; i < games.length; i++) {
      var game = games[i];
      controller.addGame(game.date, game.time, game.awayId, game.homeId, parseInt(game.awayScore), parseInt(game.homeScore), game.isFinal == 'true');
    }
    cb();
  });
  
}
