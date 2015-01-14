var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    parse_game_scores = require('./parse_game_scores');

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

var queryScores = function(date, path) {
  var headers = { 
      'Content-Length': 0, 
      'Content-Type': 'text/html'
  };
  var options = {
      hostname: 'scores.espn.go.com', 
      port: 80,
      path: '/nba/scoreboard?date=' + getDateString(date),
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
      fs.writeFileSync(path, responseString);
    });
  });


  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.end();
}

var date = new Date('10/28/2014');
var today = new Date();
today.setDate(today.getDate());
var tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
while (date < today) {
  console.log(getDateString(date) + '-after');
  var filename = 'cache/' + getDateString(date) + "-after";
  var list = [];
  if (!fs.existsSync(filename)) {
    console.log(filename + " does not exists.");
    list.push({ 
      date: date, 
      func: function() {
        queryScores(date, filename);
      }
    });
  }

  for (var i = 0; i < list.length; i++) {
    var obj = list[i];
    console.log('Downloading ' + getDateString(obj.date));
    obj.func();
    
  }
  date.setDate(new Date(date.getDate() + 1));
}

var filename = 'cache/' + getDateString(tomorrow) + "-before";
console.log(getDateString(tomorrow) + "-before");
if (!fs.existsSync(filename)) {
  queryScores(tomorrow, filename);
}
