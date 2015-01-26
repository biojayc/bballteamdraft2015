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

var makeGame = function(date, time, awayTeam, homeTeam, awayScore, homeScore) {
	return {
		date: date,
		time: time,
    awayTeam: awayTeam,
    homeTeam: homeTeam,
    awayScore: awayScore,
    homeScore: homeScore,
	};
}

var makeGame = function(cols) {
  return {
    date: cols[0],
    time: cols[1],
    awayTeam: cols[2],
    homeTeam: cols[3],
    awayScore: cols[4],
    homeScore: cols[5],
    isFinal: cols[6],
  }
}

var makeKey = function(game) {
  return game.date + "-" + game.homeTeam;
}

var run = function() {
  var files = fs.readdirSync('data');
  var games = [];
  var gameHash = {};
  for (var i = 0; i < files.length; i++) {
    var filename = files[i];
    var date = filename.substr(0, filename.indexOf('-'));
    // console.log(date);

    var data = fs.readFileSync('data/' + filename, 'utf8');
    // console.log(data);
    // console.log(data.split('\n').length);
    var rows = data.split('\n');
    for (var j = 0; j < rows.length; j++) {
      var row = rows[j];

      var cols = row.split('\t');
      if (cols.length == 7) {
        var tempGame = makeGame(cols);
        // if we already have the game and are just updating, add new data.
        if (gameHash[makeKey(tempGame)]) {
          var game = gameHash[makeKey(tempGame)];
          if (tempGame.awayScore) {
            game.awayScore = tempGame.awayScore;
          }
          if (tempGame.homeScore) {
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
          gameHash[makeKey(tempGame)] = tempGame;
          games.push(tempGame);
        }
      }
    }
  }

  var result = "";
  for (var i = 0; i < games.length; i++) {
    var game = games[i];
    result += game.date + "\t" + game.time + "\t" + game.awayTeam + "\t" + 
              game.homeTeam + "\t" + game.awayScore + "\t" + game.homeScore +
              "\t" + game.isFinal;
    if (i+1 < games.length) {
      result += "\n";
    }
  }

  fs.writeFileSync('final/' + getDateString(new Date()) + '-final', result);
}
exports.run = run;