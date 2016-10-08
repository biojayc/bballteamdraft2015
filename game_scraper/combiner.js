var fs = require('fs');

var getDateString = function(date) {
  var dd = date.getDate();
  var mm = date.getMonth()+1; //January is 0!
  var yyyy = date.getFullYear();

  if(dd<10) {
    dd='0'+dd
  } 

  if(mm<10) {
    mm='0'+mm
  } 

  return "" + yyyy + mm + dd;
}

var makeGame = function(cols) {
  return {
    key: cols[0],
    date: cols[1],
    time: cols[2],
    awayTeam: cols[3],
    homeTeam: cols[4],
    awayScore: cols[5],
    homeScore: cols[6],
    isFinal: cols[7],
  }
}

var run = function() {
  var files = fs.readdirSync('data');
  var games = [];
  var gameHash = {};
  for (var i = 0; i < files.length; i++) {
    var filename = files[i];
    var date = filename;
    // console.log(date);

    var data = fs.readFileSync('data/' + filename, 'utf8');
    // console.log(data);
    // console.log(data.split('\n').length);
    var rows = data.split('\n');
    for (var j = 0; j < rows.length; j++) {
      var row = rows[j];
      var cols = row.split('\t');
      if (cols.length == 8) {
        var tempGame = makeGame(cols);
        // if we already have the game and are just updating, add new data.
        if (gameHash[tempGame.key]) {
          var game = gameHash[tempGame.key];
          if (game.awayScore.length == 0 || parseInt(tempGame.awayScore) > parseInt(game.awayScore)) {
            game.awayScore = tempGame.awayScore;
          }
          if (game.homeScore.length == 0 || parseInt(tempGame.homeScore) > parseInt(game.homeScore)) {
            game.homeScore = tempGame.homeScore;
          }
          if (tempGame.isFinal === 'true') {
            game.isFinal = true;
          }
          if (tempGame.time) {
            game.time = tempGame.time;
          }
        } else {
          // if we don't have the game yet, just make it and add.
          gameHash[tempGame.key] = tempGame;
          games.push(tempGame);
        }
      }
    }
  }

  var result = "";
  for (var i = 0; i < games.length; i++) {
    var game = games[i];
    result += game.key + "\t" + game.date + "\t" + game.time + "\t" + game.awayTeam + "\t" + 
              game.homeTeam + "\t" + game.awayScore + "\t" + game.homeScore +
              "\t" + game.isFinal;
    if (i+1 < games.length) {
      result += "\n";
    }
  }
  var filename = 'final/' + getDateString(new Date()) + '-final';
  fs.writeFileSync(filename, result);
  return filename;
}
exports.run = run;
run();
