var Controller = require('../model/controller').Controller,
    CacheManager = require('../cache').CacheManager,
    data = require('../model/data'),
    log = require('../log');

var cache = new CacheManager();
exports.init = function() {
  cache.add('controller', function(cb) {
    var controller = cache.get('controller');
    if (controller) {
      controller.saveChallenges(function() {
        log.info("Reloading controller into cache.");
        var c = new Controller();
        data.injectData(c, function() {
          cb(c);
        });
      });
    } else {
      log.info("Reloading controller into cache.");
      var c = new Controller();
      data.injectData(c, function() {
        cb(c);
      });
    }
  }, 5 * 60 * 1000);
}

exports.controller = function() {
  return cache.get('controller');
}

exports.redirectToLogin = function(res) {
  res.writeHead(302, {'Location': '/login'});
  res.end("");
}

exports.redirectToHome = function(res) {
  res.writeHead(302, {'Location': '/'});
  res.end("");
}

exports.redirectTo = function(res, path) {
  res.writeHead(302, {'Location': path});
  res.end("");
}

var formatWinningPercent = function(pct) {
  var winningPercent = Math.round(pct * 1000);
  if (winningPercent == 0) {
    winningPercent = "000";
  } else if (winningPercent < 100) {
    winningPercent = "0" + winningPercent;
  } else if (winningPercent == 1000) {
    return "1.00";
  }
  return "." + winningPercent;
}
exports.formatWinningPercent = formatWinningPercent;

var timezones = {};
timezones.EASTERN = -5;
timezones.CENTRAL = -6;
timezones.MOUNTAIN = -7;
timezones.PACIFIC = -8;
exports.timezones = timezones;
exports.formatTimeZone = function(tz, t) {
  var time = t.substr(
       t.indexOf('T')+1, 5);  // e.g. 2015-04-03T23:00Z
  var month = Number(t.substr(5, 2));
  var day = Number(t.substr(8, 2));
  var hour = time.substr(0, time.indexOf(':'));
  var m = "am";
  var hour = Number(hour) + tz; // add timezone offset

  if (hour < 0) {
    hour += 24;
    day--;
  }

  if (month < 11 || (month == 11 && day == 1)) {
    hour++; // dst
  }

  if (hour > 12) {
    hour -= 12;
    m = "pm";
  }
  var minute = time.substr(time.indexOf(':') + 1, 2);
  return hour + ":" + minute + m;
}

exports.createScores = function(controller) {
  var scores = [];
  var owners = controller.owners.slice();
  owners.sort(function(a, b){return (b.points-a.points) * 1000 + (b.pct - a.pct);});
  for (var i = 0; i < owners.length; i++) {
    var owner = owners[i];
    scores.push({ name: owner.name, wins: owner.points, pct: formatWinningPercent(owner.pct), 
                id: owner.id, color: owner.color });
  }
  return scores;
}

exports.getWinningImage = function(controller) {
  var owners = controller.owners.slice();
  owners.sort(function(a, b){return b.points-a.points});
  return owners[0].image;
}