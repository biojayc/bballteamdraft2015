var fs = require("fs"),
    readline = require('readline'),
    parse_game_scores = require('./parse_game_scores');

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



var html = fs.readFileSync('./testdata/after-new', 'utf8');
var games = parse_game_scores.parse(html);

var results = [
  { home_team: 'IND',
    home_score: '93',
    away_team: 'CHA',
    away_score: '74',
    isFinal: true },
  { home_team: 'WSH',
    home_score: '101',
    away_team: 'NY',
    away_score: '87',
    isFinal: true },
  { home_team: 'BOS',
    home_score: '101',
    away_team: 'MIL',
    away_score: '110',
    isFinal: true },
  { home_team: 'BKN',
    home_score: '114',
    away_team: 'TOR',
    away_score: '109',
    isFinal: true },
  { home_team: 'CHI',
    home_score: '88',
    away_team: 'DET',
    away_score: '82',
    isFinal: true },
  { home_team: 'MEM',
    home_score: '100',
    away_team: 'OKC',
    away_score: '92',
    isFinal: true },
  { home_team: 'MIN',
    home_score: '84',
    away_team: 'ORL',
    away_score: '97',
    isFinal: true },
  { home_team: 'SA',
    home_score: '123',
    away_team: 'DEN',
    away_score: '93',
    isFinal: true },
  { home_team: 'SAC',
    home_score: '95',
    away_team: 'NO',
    away_score: '101',
    isFinal: true },
  { home_team: 'LAL',
    home_score: '77',
    away_team: 'POR',
    away_score: '107',
    isFinal: true }
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