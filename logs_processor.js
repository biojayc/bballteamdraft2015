var fs = require('fs');

var requests = [];  // array of all objs.
var requestHash = {};

var addSplits = function(arr, first, last) {
  var result = '';
  last = last || arr.length - 1;
  for (var i = first; i <= last; i++) {
    result += arr[i];
    if (i != last) {
      result += ' ';
    }
  }
  return result;
}

var process_logs = function (logs_path, callback) {
  logs_path = logs_path || './logs/';
  var complete_logs = '';

  fs.exists(logs_path, function(exists) {
    if (exists) {
      // TODO: get rid of this sync method!!
      var files = fs.readdirSync(logs_path);
      for (var i = 0; i < files.length; i++) {
        complete_logs += fs.readFileSync(logs_path + files[i], 'utf8');
      }

      var logs = complete_logs.split('\n');
      for (var i = 0; i < logs.length; i++) {
        var log = logs[i];
        if (log.length == 0) {
          continue;
        }
        var obj = {};
        var split_log = log.split(' ');
        obj.date = split_log[1];
        obj.date = obj.date.substr(0, obj.date.indexOf(':'));
        obj.time = split_log[1];
        obj.time = obj.time.substr(obj.time.indexOf(':')+1, obj.time.length);
        if (obj.time[obj.time.length-1] === ":") {
          obj.time = obj.time.substr(0, obj.time.length-1);
        } else {
          obj.request_id = split_log[2].substr(1, split_log[2].length-3);
        }
        if (!obj.request_id) {
          continue;  // we only care about logs that come from a request, not internal logs.
        }
        if (requestHash[obj.request_id]) {
          obj = requestHash[obj.request_id];
        } else {
          requestHash[obj.request_id] = obj;
          requests.push(obj);
        }

        // see what kind of log it is.
        var logType = split_log[3];
        if (logType === "Incoming") {
          obj.method = split_log[6];
          obj.url = addSplits(split_log, 7);
        } else if (logType === "User-agent:") {
          obj.user_agent = addSplits(split_log, 4);
        } else if (logType === "IPAddress:") {
          obj.ip_address = addSplits(split_log, 4);
        } else if (logType === "Route") {
          obj.route = addSplits(split_log, 5);
        } else if (logType === "Returning") {
          obj.returning = addSplits(split_log, 4);
        }
      }

      callback(requests);
    } else {
      console.log("logs_path does not exists");
      callback();
    }
  });
}

// process_logs();

exports.process_logs = process_logs;