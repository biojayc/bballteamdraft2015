var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    parse_game_scores = require('./parse_game_scores');

var headers = { 
    'Content-Length': 0, 
    'Content-Type': 'text/html'
};
var options = {
    hostname: 'scores.espn.go.com', 
    port: 80,
    path: '/nba/scoreboard',
    method: 'GET',
    //headers: headers
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  var responseString = '';
  res.on('data', function (data) {
    responseString += data;
  });
  
  res.on('end', function() {
    var games = parse_game_scores.parse(responseString);
    
    var result = "";
    for (var i = 0; i < games.length; i++) {
      var game = games[i];
      result += game.away_team + "\t" + game.home_team + "\t" +
                game.away_score + "\t" + game.home_score + "\n";
    }
    fs.appendFileSync('scores', result);
  });
});


req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();
