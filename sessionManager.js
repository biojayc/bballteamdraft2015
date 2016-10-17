var fs = require("fs"),
    log = require('./log');

var sessions = [];
var sessionsHash = {};
var sessionFile = "";

var getSession = function(id) {
  if (sessionsHash[id] == null) {
    sessionsHash[id] = {};
    sessionsHash[id].id = id;
    sessions.push(sessionsHash[id]);
  }
  return sessionsHash[id];
}
var loadSession = function(obj) {
  sessions.push(obj);
  sessionsHash[obj.id] = obj;
}
var saveSessions = function() {
  // save them to disk
  log.info("Saving sessions...");
  var data = "";
  for(var i = 0; i < sessions.length; i++) {
    var session = sessions[i];
    data += session.id + "\t" + session.owner + "\n";
  }
  fs.writeFile(sessionFile, data, 'utf8', function(err) {
    if (err) {
      log.error(err);
    }
  });
}

var init = function(filename) {
  sessionFile = filename;
  fs.readFile(sessionFile, 'utf8', function(err, data) {
    var rows = data.split('\n');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var cols = row.split('\t');
      if (cols.length == 2) {
        var session = {
          id: cols[0],
          owner: (cols[1] != "undefined" && cols[1] != "null" ? cols[1] : "") ,
        };
        loadSession(session);
      }
    }
  });
  setInterval(saveSessions, 5 * 60 * 1000);
}

exports.init = init;
exports.getSession = getSession;