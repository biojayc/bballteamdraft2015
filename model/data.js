var games = require('./games').games,
    util = require('./util');

var people = [
  { id: 'MM', name: 'Mark Mullings', first: "Mark", initial: "M", img: "images/noimage.gif" },
  { id: 'WT', name: 'Wesley Thompson', first: "Wesley", initial: "W", img: "/images/noimage.gif" },
  { id: 'CS', name: 'Chris Seiler', first: "Chris", initial: "C", img: "images/cs.jpg" },
  { id: 'BT', name: 'Brian Turley', first: "Brian", initial: "Br", img: "images/bt.gif" },
  { id: 'AK', name: 'Aaron Knoles', first: "Aaron", initial: "A", img: "images/ak.gif" },
  { id: 'JS', name: 'Jerry Seiler', first: "Jerry", initial: "Je", img: "images/js.jpg" },
  { id: 'JRS', name: 'Jamie Smith', first: "Jamie", initial: "Ja", img: "images/jrs.jpg" },
  { id: 'BS', name: 'Blake Smith', first: "Blake", initial: "Bl", img: "images/noimage.gif" }
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

exports.injectData = function(controller) {
  for(var i = 0; i < people.length; i++) {
    var person = people[i];
    controller.addPerson(person.id, person.name, person.img);
  }
  for(var i = 0; i < teams.length; i++) {
    var team = teams[i];
    controller.addTeam(team.id, team.name, team.owner);
  }
  var todaysDate = util.getDateString();
  for(var i = 0; i < games.length; i++) {
    var game = games[i];
    if (game.awayScore && game.homeScore) {
      controller.addGame(game.date, game.time, game.awayId, game.homeId, game.awayScore, game.homeScore);
    }
    if (game.date == todaysDate) {
      controller.addTodaysGame(game.awayId, game.homeId, game.time);
    }
  }
}
