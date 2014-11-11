
var ui = ui || {};

ui.buildScoreTable = function(controller) {
  var people = controller.people;
  people.sort(function(a, b){return b.score-a.score});
  var table = document.getElementById('scoretable');
  for (var i = 0; i < people.length; i++) {
    var person = people[i];
	if (i==0) {
		ui.updateWinningImage(person.image);
	}
	var cols = [person.name, person.score];
	table.appendChild(ui.makeTableRow(cols));
    /*var name = document.createTextNode(person.name);
    var score = document.createTextNode(person.score);
    var tr = document.createElement("TR");
    table.appendChild(tr);
    var td1 = document.createElement("TD");
    td1.appendChild(name);
    var td2 = document.createElement("TD");
    td2.appendChild(score);
    tr.appendChild(td1);
    tr.appendChild(td2);*/
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
    var personName = "";
    if (person) { personName = person.name; }
	var cols = [team.name, team.wins, team.losses, personName];
	table.appendChild(ui.makeTableRow(cols));
    /*var name = document.createTextNode(team.name);
    var wins = document.createTextNode(team.wins);
    var losses = document.createTextNode(team.losses);
    var person = controller.findPerson(team.ownerId);
    var personname = "";
    if (person) { personname = person.name; }
    var owner = document.createTextNode(personname);
    var tr = document.createElement("TR");
    table.appendChild(tr);
    var td1 = document.createElement("TD");
    var td2 = document.createElement("TD");
    var td3 = document.createElement("TD");
    var td5 = document.createElement("TD");
    td1.appendChild(name);
    td2.appendChild(wins);
    td3.appendChild(losses);
    td5.appendChild(owner);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td5);*/
  }
}

ui.buildGamesTable = function(controller) {
  var games = controller.games;
  var table = document.getElementById('recentgamestable');
  for (var i = games.length - 1, count = 9; i >= 0 && count >= 0; i--,count--) {
    var game = games[i];
    var date = document.createTextNode(game.date);
    var awayteam = document.createTextNode(controller.findTeam(game.awayId).name + " (" + game.awayScore + ")");
    var hometeam = document.createTextNode(controller.findTeam(game.homeId).name + " (" + game.homeScore + ")");
    var person = controller.findPerson(game.winningOwnerId);
    var personName = "";
    if (person) { personName = person.name; }
    var winningOwner = document.createTextNode(personName);
    var tr = document.createElement("TR");
    table.appendChild(tr);
    var td0 = document.createElement("TD");
    var td1 = document.createElement("TD");
    var td2 = document.createElement("TD");
    var td5 = document.createElement("TD");
    td0.appendChild(date);
    td1.appendChild(awayteam);
    td2.appendChild(hometeam);
    td5.appendChild(winningOwner);
    tr.appendChild(td0);
    if (game.winningTeamId == game.awayId) {
      td1.className += td1.className ? ' winner' : 'winner';
    } else {
      td2.className += td1.className ? ' winner' : 'winner';
    }
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td5);
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
	var timeNode = document.createTextNode(game.time);
    var awayTeamNode = document.createTextNode(awayTeam.name + awayOwnerName);
    var homeTeamNode = document.createTextNode(homeTeam.name + homeOwnerName);
    var tr = document.createElement("TR");
    table.appendChild(tr);
    var td1 = document.createElement("TD");
    var td2 = document.createElement("TD");
    var td3 = document.createElement("TD");
    td1.appendChild(timeNode);
    td2.appendChild(awayTeamNode);
    td3.appendChild(homeTeamNode);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
  }
}

ui.updateWinningImage = function(img) {
  var winningImageImg = document.getElementById('winningimage');
  winningImageImg.src = img;
}

ui.makeTableRow = function(cols) {
  var tr = document.createElement("TR");
  for(var i = 0; i < cols.length; i++) {
	var textNode = document.createTextNode(cols[i]);
	var td = document.createElement("TD");
	td.appendChild(textNode);
	tr.appendChild(td);
  }
  return tr;
}
