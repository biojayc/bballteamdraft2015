var teams = {};
teams["Bulls"] = "CHI";
teams["Clippers"] = "LAC";
teams["Mavericks"] = "DAL";
teams["Hornets"] = "CHA";
teams["Nuggets"] = "DEN";
teams["Cavaliers"] = "CLE";
teams["Suns"] = "PHX";
teams["Celtics"] = "BOS";
teams["Heat"] = "MIA";
teams["Nets"] = "BKN";
teams["Magic"] = "ORL";
teams["Pistons"] = "DET";
teams["Rockets"] = "HOU";
teams["Grizzlies"] = "MEM";
teams["76ers"] = "PHI";
teams["Spurs"] = "SAS";
teams["Pelicans"] = "NOP";
teams["Trail Blazers"] = "POR";
teams["Lakers"] = "LAL";
teams["Hawks"] = "ATL";
teams["Knicks"] = "NYK";
teams["Bucks"] = "MIL";
teams["Thunder"] = "OKC";
teams["Jazz"] = "UTA";
teams["Kings"] = "SAC";
teams["Pacers"] = "IND";
teams["Wizards"] = "WAS";
teams["Raptors"] = "TOR";
teams["Timberwolves"] = "MIN";
teams["Warriors"] = "GSW";

var parse = function(h) {
  var games = [];
  try {
    var game_data = JSON.parse(h);
    for (var i = 0; i < game_data.events.length; i++) {
      var gevent = game_data.events[i];
      var game = {};
      for (var j = 0; j < gevent.competitions.length; j++) {
        var competition = gevent.competitions[j];

        // interpret data to get time.
        // TODO(jamiesmith) finish this.  For now, we already have all
        // dates for all games so I don't care about completing this.
        // Will need for next season.
        /*var date = competition.date.substr(
             competition.date.indexOf('T')+1, 5);  // e.g. 2015-04-03T23:00Z

        var hour = date.substr(0, date.indexOf(':'));
        var hour = hour - 5;
        var hour = hour < 0 ? hour + 24 : hour;
        var hour = hour > 12 ? hour - 12 : hour;
        console.log(hour);
        */
        game.time = competition.date;
        for (var k = 0; k < competition.competitors.length; k++) {
          var competitor = competition.competitors[k];
          if (competitor.homeAway == "home") {
            game.home_team = teams[competitor.team.name];
            game.home_score = competitor.score;
          } else {
            game.away_team = teams[competitor.team.name];
            game.away_score = competitor.score;
          }
        }
        if (competition.status.type.state == "post" &&
            competition.status.type.name != "STATUS_POSTPONED") {
          game.isFinal = true;
        }
      }
      
      if (game.home_team != undefined) // prevent the allstar game from crashing front end
        games.push(game);
    }
  } catch(e) {
    console.log("Wasn't able to parse file.");
  }
  
  return games;
}

exports.parse = parse;
