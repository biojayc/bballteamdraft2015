var http = require('http'),
    fs = require('fs');

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

var run = function() {
  var date = new Date('10/28/2014');
  var today = new Date();
  var yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  while (date < yesterday) {
    console.log(getDateString(date) + '-after');
    var filename = 'cache/' + getDateString(date) + "-after";
    if (!fs.existsSync(filename)) {
      console.log(filename + " does not exists.");
      queryScores(date, filename);
    }
    date.setDate(new Date(date.getDate() + 1));
  }


  var finalDate = new Date('04/16/2015');
  while(date < finalDate) {
    console.log(getDateString(date) + "-before");
    var filename = 'cache/' + getDateString(date) + "-before";
    if (!fs.existsSync(filename)) {
      console.log(filename + " does not exists.");
      queryScores(date, filename);
    }
    date.setDate(new Date(date.getDate() + 1));
  }
}
exports.run = run;
