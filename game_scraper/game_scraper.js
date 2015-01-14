var fs = require('fs'),
    parse_game_scores = require('./parse_game_scores');


var formatDate = function(dateStr) {
  var year = dateStr.substr(0, 4);
  var month = dateStr.substr(4, 2);
  var day = dateStr.substr(6, 2);
  var newDate = month + '/' + day + '/' + year;
  return newDate;
}

var files = fs.readdirSync('cache');
for (var i = 0; i < files.length; i++) {
  var filename = files[i];
  var cachefile = 'cache/' + filename;
  var datafile = 'data/' + filename;
  if (filename.indexOf('after') > -1 || filename.indexOf('before') > -1) {
    if (!fs.existsSync(datafile)) {
      var date = filename.substr(0, 8);
      var html = fs.readFileSync(cachefile, 'utf8');
      // console.log(html);
      if (filename.indexOf('after') > -1) {
        var games = parse_game_scores.parseAfter(html);
      } else if (filename.indexOf('before') > -1) {
        var games = parse_game_scores.parseBefore(html);
      }
      var result = "";
      for (var j = 0; j < games.length; j++) {
        var game = games[j];
        result += formatDate(date) + "\t" + (game.time ? game.time : '') + "\t" + game.away_team + "\t" + game.home_team + "\t" +
                  (game.away_score ? game.away_score : '') + "\t" + (game.home_score ? game.home_score : '');
        if (j+1 < games.length) {
          result+= "\n";
        }
      }
      console.log(result);
      fs.writeFileSync(datafile, result);
    }
  } else if (filename == '1seed') {
    if (!fs.existsSync(datafile)) {
      console.log('Copying seed file.');
      var data = fs.readFileSync(cachefile, 'utf8');
      fs.writeFileSync(datafile, data);
    }
  }
}