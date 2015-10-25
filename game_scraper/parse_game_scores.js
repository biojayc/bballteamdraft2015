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
  var game_re = /<div\s+id="\d+-gamebox"\s+class=.mod-container\s+mod-no-header-footer\s+mod-scorebox\s+mod-nba-scorebox/;
  var status_re = /<div\s+class="game-status"><p\s+id="\d+-statusLine1">([\w\d:\s\/]+)<\/p><\/div>/
  var team_re = /<a href="http:\/\/espn.go.com\/nba\/team\/_\/name\/\w+\/[\w-]+">([\w\s]+)<\/a>/;
  var score_re = /<li id="\d+-\w+\d+" class="finalScore">(\d+)<\/li>/
  var html = h;
  while(html.match(game_re)) {
    var game = {};
    html = html.substr(html.search(game_re) + 50, html.length);
    // console.log(html.match(status_re));
    game.status = html.match(status_re)[1];
    if (!html.match(team_re)) { // this gets us passed the allstar game, which would cause problems
      continue;
    }
    game.away_team = teams[html.match(team_re)[1]];
    html = html.substr(html.search(team_re) + 10, html.length);

    if (game.status.indexOf('ET') === -1 && game.status.indexOf('Postponed') === -1) {
      game.away_score = html.match(score_re)[1];
      html = html.substr(html.search(score_re) + 10, html.length);
    } else {
      game.time = game.status;
    }

    game.home_team = teams[html.match(team_re)[1]];
    html = html.substr(html.search(team_re) + 10, html.length);

    if (game.status.indexOf('ET') === -1 && game.status.indexOf('Postponed') === -1) {
      game.home_score = html.match(score_re)[1];
      html = html.substr(html.search(score_re) + 10, html.length);
    }

    if (game.status.indexOf('Final') > -1) {
      game.isFinal = true;
    }
    games.push(game);
  }

  if (games.length == 0) {
    // For new espn page
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
          if (competition.status.type.state == "post") {
            game.isFinal = true;
          }
        }
        games.push(game);
      }
    } catch(e) {
      console.log("Wasn't able to parse file.");
    }
  }
  
  return games;
}

exports.parse = parse;
