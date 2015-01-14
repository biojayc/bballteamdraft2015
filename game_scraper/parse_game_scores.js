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

var parseBefore = function(h) {
  var games = [];
  var game_re = /<div\s+id="\d+-gamebox"\s+class=.mod-container\s+mod-no-header-footer\s+mod-scorebox\s+mod-nba-scorebox/;
  var time_re = /<div\sclass="game-status"><p id="\d+-statusLine1">([\w\s:]+)<\/p><\/div>/;
  var team_re = /<a href="http:\/\/espn.go.com\/nba\/team\/_\/name\/\w+\/[\w-]+">([\w\s]+)<\/a>/;
  var html = h;
  while(html.match(game_re)) {
    var game = {};
    html = html.substr(html.search(game_re) + 50, html.length);
    game.time = html.match(time_re)[1];
    html = html.substr(html.search(time_re)[1] + 10, html.length);
    game.away_team = teams[html.match(team_re)[1]];
    html = html.substr(html.search(team_re) + 10, html.length);
    game.home_team = teams[html.match(team_re)[1]];
    html = html.substr(html.search(team_re) + 10, html.length);
    games.push(game);
  }
  
  return games;
}

var parseAfter = function(h) {
  var games = [];
  var game_re = /<div\s+id="\d+-gamebox"\s+class=.mod-container\s+mod-no-header-footer\s+mod-scorebox\s+mod-nba-scorebox/;
  var team_re = /<a href="http:\/\/espn.go.com\/nba\/team\/_\/name\/\w+\/[\w-]+">([\w\s]+)<\/a>/;
  var score_re = /<li id="\d+-\w+\d+" class="finalScore">(\d+)<\/li>/
  var html = h;
  while(html.match(game_re)) {
    var game = {};
    html = html.substr(html.search(game_re) + 50, html.length);
    game.away_team = teams[html.match(team_re)[1]];
    html = html.substr(html.search(team_re) + 10, html.length);
    game.away_score = html.match(score_re)[1];
    html = html.substr(html.search(score_re) + 10, html.length);
    game.home_team = teams[html.match(team_re)[1]];
    html = html.substr(html.search(team_re) + 10, html.length);
    game.home_score = html.match(score_re)[1];
    html = html.substr(html.search(score_re) + 10, html.length);
    games.push(game);
  }
  
  return games;
}

exports.parseBefore = parseBefore;
exports.parseAfter = parseAfter;
