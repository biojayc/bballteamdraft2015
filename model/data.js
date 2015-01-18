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
  { id: 'CLE', name: 'Cleveland Cavaliers', owner: 'MM' },
  { id: 'DAL', name: 'Dallas Mavericks', owner: 'WT' },
  { id: 'SAS', name: 'San Antonio Spurs', owner: 'CS' },
  { id: 'LAC', name: 'LA Clippers', owner: 'BT' },
  { id: 'CHI', name: 'Chicago Bulls', owner: 'AK' },
  { id: 'OKC', name: 'Oklahoma City Thunder', owner: 'JS' },
  { id: 'HOU', name: 'Houston Rockets', owner: 'JRS' },
  { id: 'GSW', name: 'Golden State Warriors', owner: 'JRS' },
  { id: 'MEM', name: 'Memphis Grizzlies', owner: 'JS' },
  { id: 'POR', name: 'Portland Trailblazers', owner: 'AK' },
  { id: 'TOR', name: 'Toronto Raptors', owner: 'BT' },
  { id: 'WAS', name: 'Washington Wizards', owner: 'CS' },
  { id: 'IND', name: 'Indiana Pacers', owner: 'WT' },
  { id: 'CHA', name: 'Charlotte Hornets', owner: 'MM' },
  { id: 'PHX', name: 'Pheonix Suns', owner: 'BT' },
  { id: 'MIA', name: 'Miami Heat', owner: 'AK' },
  { id: 'NOP', name: 'New Orleans Pelicans', owner: 'JRS' },
  { id: 'ATL', name: 'Atlanta Hawks', owner: 'JS' },
  { id: 'DET', name: 'Detroit Pistons', owner: 'CS' },
  { id: 'NYK', name: 'New York Knicks', owner: 'WT' },
  { id: 'ORL', name: 'Orlando Magic', owner: 'MM' },
  { id: 'LAL', name: 'LA Lakers', owner: 'MM' },
  { id: 'MIN', name: 'Minnesota Timberwolves', owner: 'WT' },
  { id: 'DEN', name: 'Denver Nuggets', owner: 'CS' },
  { id: 'BKN', name: 'Brooklyn Nets', owner: 'JS' },
  { id: 'SAC', name: 'Sacramento Kings', owner: 'JRS' },
  { id: 'MIL', name: 'Milwaukee Bucks', owner: 'AK' },
  { id: 'UTA', name: 'Utah Jazz', owner: 'BT' },
  { id: 'PHI', name: 'Philadelphia 76ers', owner: 'BS'  },
  { id: 'BOS', name: 'Boston Celtics', owner: 'BS'  }
];

var makeGame = function(cols) {
  return {
    date: cols[0],
    time: cols[1],
    awayId: cols[2],
    homeId: cols[3],
    awayScore: cols[4],
    homeScore: cols[5],
  }
}

//TODO: get rid of the sync methods here.  We shouldn't use any sync methods on the web server.
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
          if (cols.length == 6) {
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
    controller.addTeam(team.id, team.name, team.owner);
  }
  getGames(function(games) {
    for(var i = 0; i < games.length; i++) {
      var game = games[i];
      controller.addGame(game.date, game.time, game.awayId, game.homeId, parseInt(game.awayScore), parseInt(game.homeScore));
    }
    cb();
  });
  
}
