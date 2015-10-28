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
      'Content-Type': 'text/html',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
  };
  var options = {
      hostname: 'site.api.espn.com', 
      port: 80,
      path: '/apis/site/v2/sports/basketball/nba/scoreboard?calendartype=blacklist&dates=' + getDateString(date),
      method: 'GET',
      headers: headers
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
  var startdate = new Date('10/27/2015');
  var date = new Date('10/27/2015');
  var today = new Date();
  var yesterday = new Date();
  var finalDate = new Date('04/14/2016');
  yesterday.setDate(today.getDate() - 1);
  while (date < yesterday && date < finalDate) {
    // console.log(getDateString(date) + '-after');
    var filename = 'cache/' + getDateString(date) + "-postgame";
    if (!fs.existsSync(filename)) {
      console.log(filename + " does not exists.");
      queryScores(date, filename);
    }
    date.setDate(new Date(date.getDate() + 1));
  }

  //during
  if (today > startdate && today < finalDate) {
    // console.log(getDateString(date) + '-during');
    var filename = 'cache/live';
    queryScores(date, filename);
  }

  while(date < finalDate) {
    // console.log(getDateString(date) + "-before");
    var filename = 'cache/' + getDateString(date);
    if (!fs.existsSync(filename)) {
      console.log(filename + " does not exists.");
      queryScores(date, filename);
    }
    date.setDate(new Date(date.getDate() + 1));
  }
}
exports.run = run;
