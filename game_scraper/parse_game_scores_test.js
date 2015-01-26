var fs = require("fs"),
    readline = require('readline'),
    parse_game_scores = require('./parse_game_scores');

/*var html = fs.readFileSync("./testdata/after", "utf8");

var games = parse_game_scores.parseAfter(html);

var results = 
[ { away_team: 'CHI',
    away_score: '98',
    home_team: 'LAC',
    home_score: '87' },
  { away_team: 'DAL',
    away_score: '107',
    home_team: 'CHA',
    home_score: '80' },
  { away_team: 'DEN',
    away_score: '106',
    home_team: 'CLE',
    home_score: '97' },
  { away_team: 'PHX',
    away_score: '118',
    home_team: 'BOS',
    home_score: '114' },
  { away_team: 'MIA',
    away_score: '95',
    home_team: 'BKN',
    home_score: '83' },
  { away_team: 'ORL',
    away_score: '107',
    home_team: 'DET',
    home_score: '93' },
  { away_team: 'HOU',
    away_score: '93',
    home_team: 'MEM',
    home_score: '119' },
  { away_team: 'PHI',
    away_score: '75',
    home_team: 'SAS',
    home_score: '100' },
  { away_team: 'NOP',
    away_score: '93',
    home_team: 'POR',
    home_score: '102' } ];

var pass = true;
for (var i = 0; i < games.length; i++) {
  var game = games[i];
  var result = results[i];
  if (game.away_team != result.away_team ||
      game.home_team != result.home_team ||
      game.away_score != result.away_score ||
      game.home_score != result.home_score) {
    pass = false;
    break;
  }
}

if (pass) {
  console.log("pass");
} else {
  console.log("fail");
}


var html = fs.readFileSync('./testdata/before', 'utf8');
var games = parse_game_scores.parseBefore(html);

var results = 
[ { away_team: 'NOP',
    home_team: 'BOS',
    time: '7:30 PM ET',
  },
  { away_team: 'HOU',
    home_team: 'BKN',
    time: '7:30 PM ET',
  },
  { away_team: 'DET',
    home_team: 'TOR',
    time: '7:30 PM ET',
  },
  { away_team: 'ORL',
    home_team: 'CHI',
    time: '8:00 PM ET',
  },
];

var pass = true;
for (var i = 0; i < games.length; i++) {
  var game = games[i];
  var result = results[i];
  if (game.away_team != result.away_team ||
      game.home_team != result.home_team ||
      game.time != result.time) {
    pass = false;
    break;
  }
}

if (pass) {
  console.log("pass");
} else {
  console.log("fail");
}*/


var html = fs.readFileSync('./testdata/during', 'utf8');
var games = parse_game_scores.parse(html);

var results = [
{
  status: '1:01 4th Qtr',
  away_team: 'MIL',
  away_score: '93',
  home_team: 'SAS',
  home_score: '97',
},
{
  status: '1:15 4th Qtr',
  away_team: 'DET',
  away_score: '102',
  home_team: 'TOR',
  home_score: '107',
},
{
  status: 'Halftime',
  away_team: 'BOS',
  away_score: '49',
  home_team: 'GSW',
  home_score: '56',
},
{
  status: 'Halftime',
  away_team: 'WAS',
  away_score: '59',
  home_team: 'DEN',
  home_score: '59',
},
{
  status: '9:30 PM ET',
  away_team: 'HOU',
  home_team: 'LAL',
  time: '9:30 PM ET',
},
{
  status: 'Final',
  away_team: 'MIA',
  away_score: '96',
  home_team: 'CHI',
  home_score: '84',
  isFinal: true,
},
{
  status: 'Final',
  away_team: 'OKC',
  away_score: '98',
  home_team: 'CLE',
  home_score: '108',
  isFinal: true,
},
{
  status: 'Final',
  away_team: 'LAC',
  away_score: '120',
  home_team: 'PHX',
  home_score: '100',
  isFinal: true,
},
{
  status: 'Final',
  away_team: 'DAL',
  away_score: '106',
  home_team: 'NOP',
  home_score: '109',
  isFinal: true,
},
{
  status: 'Final',
  away_team: 'MIN',
  away_score: '100',
  home_team: 'ATL',
  home_score: '112',
  isFinal: true,
},
{
  status: 'Final',
  away_team: 'IND',
  away_score: '106',
  home_team: 'ORL',
  home_score: '99',
  isFinal: true,
},
];

var pass = true;
for (var i = 0; i < games.length; i++) {
  var game = games[i];
  var result = results[i];
  if (game.status != result.status || game.away_team != result.away_team ||
      game.home_team != result.home_team || game.away_score != result.away_score ||
      game.home_score != result.home_score || game.isFinal != result.isFinal ||
      game.time != result.time) {
    pass = false;
    break;
  }
}

if (pass) {
  console.log("pass");
} else {
  console.log("fail");
}