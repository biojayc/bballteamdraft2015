var ui = ui || {};
 
ui.buildScoreTable = function(controller) {
  var people = controller.people;
  people.sort(function(a, b){return b.wins-a.wins});
  var table = document.getElementById('scoretable');
  for (var i = 0; i < people.length; i++) {
    var person = people[i];
    if (i==0) {
        ui.updateWinningImage(person.image);
    }
    var cols = [person.name, person.wins];
    table.appendChild(ui.makeTableRow(cols));
  }
}
 
ui.buildTeamsTable = function(controller) {
  var teams = controller.teams;
  teams.sort(function(a, b){
    return (b.wins*1000 - b.losses) - (a.wins*1000 - a.losses);
  });
  var table = document.getElementById('teamstable');
  for (var i = 0; i < teams.length; i++) {
    var team = teams[i];
    var person = controller.findPerson(team.ownerId);
    var cols = [team.name, team.wins, team.losses, person ? person.name : ""];
    table.appendChild(ui.makeTableRow(cols));
  }
}
 
ui.buildGamesTable = function(controller) {
  var games = controller.games;
  var table = document.getElementById('recentgamestable');
  for (var i = games.length - 1, count = 9; i >= 0 && count >= 0; i--,count--) {
    var game = games[i];
    var awayTeam, homeTeam;
    var awayTeam = controller.findTeam(game.awayId).name + " (" + game.awayScore + ")";
    var homeTeam = controller.findTeam(game.homeId).name + " (" + game.homeScore + ")";
    var person = controller.findPerson(game.winningOwnerId);
    if (game.winningTeamId == game.awayId) {
      var cols = [game.date, ui.addClassName(awayTeam, "winner"), homeTeam, person ? person.name : ""];
    } else {
      var cols = [game.date, awayTeam, ui.addClassName(homeTeam, "winner"),  person ? person.name : ""];
    }
    table.appendChild(ui.makeTableRow(cols));
  }
}
 
ui.buildTodaysGamesTable = function(controller) {
  var games = controller.todaysGames;
  var table = document.getElementById('todaysgamestable');
  for (var i = 0; i < games.length; i++) {
    var game = games[i];
    var awayTeam = controller.findTeam(game.awayId);
    var homeTeam = controller.findTeam(game.homeId);
    var awayOwner = controller.findPerson(awayTeam.ownerId);
    var homeOwner = controller.findPerson(homeTeam.ownerId);
    var awayOwnerName = "";
    var homeOwnerName = "";
    if (awayOwner) { awayOwnerName = " (" + awayOwner.name + ")"; }
    if (homeOwner) { homeOwnerName = " (" + homeOwner.name + ")"; }
    var cols = [game.time, awayTeam.name + awayOwnerName, homeTeam.name + homeOwnerName];
    table.appendChild(ui.makeTableRow(cols));
  }
}
 
ui.updateWinningImage = function(img) {
  var winningImageImg = document.getElementById('winningimage');
  winningImageImg.src = img;
}
ui.addClassName = function(text, className) {
    return { value: text, className: className };
}
ui.makeTableRow = function(cols) {
  var tr = document.createElement("TR");
  for(var i = 0; i < cols.length; i++) {
    var value = cols[i];
    var className = "";
    if (typeof(cols[i]) == "object") {
        value = cols[i].value;
        className = cols[i].className;
    }
    var textNode = document.createTextNode(value);
    var td = document.createElement("TD");
    if (className) {
      td.className = className;
    }
    td.appendChild(textNode);
    tr.appendChild(td);
  }
  return tr;
}
