var fs = require("fs"),
    readline = require('readline'),
    parse_game_scores = require('./parse_game_scores');

var html = fs.readFileSync("./testdata/scoreboard", "utf8");

var games = parse_game_scores.parse(html);

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
    home_team: 'NYN',
    home_score: '83' },
  { away_team: 'ORL',
    away_score: '107',
    home_team: 'DET',
    home_score: '93' },
  { away_team: 'HOU',
    away_score: '93',
    home_team: 'MEG',
    home_score: '119' },
  { away_team: 'PHI',
    away_score: '75',
    home_team: 'SAS',
    home_score: '100' },
  { away_team: 'NOK',
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

