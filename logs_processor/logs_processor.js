var fs = require('fs');

var requests = [];  // array of all objs.
var requestHash = {};  // hash: key is request_id, value is obj.
var ips = []; // list of ip strings.
var ipHash = {}; // hash: key is ip string, value is array of obj.
var urls = [];  // list of url strings
var urlHash = {} // hash: key is url string, value is array of obj.
var userAgents = []; // list of user agent strings
var userAgentHash = {}; // hash: key is user agent string ,value is array of obj;


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

var addToIpHash = function(obj) {
  var ip = obj.ip_address;
  if (!ipHash[ip]) {
    ips.push(ip);
    ipHash[ip] = [];
  }
  ipHash[ip].push(obj);
}

var addToUrlHash = function(obj) {
  var url = obj.url;
  if (!urlHash[url]) {
    urls.push(url);
    urlHash[url] = [];
  }
  urlHash[url].push(obj);
}

var addToUserAgentHash = function(obj) {
  var userAgent = obj.user_agent;
  if (!userAgentHash[userAgent]) {
    userAgents.push(userAgent);
    userAgentHash[userAgent] = [];
  }
  userAgentHash[userAgent].push(obj);
}

var process_logs = function (logs_path) {
  logs_path = logs_path || '../logs/';
  var complete_logs = '';
  
  if (!fs.existsSync(logs_path)) {
    console.log("logs_path does not exists");
    return;
  }

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
      addToUrlHash(obj);
    } else if (logType === "User-agent:") {
      obj.user_agent = addSplits(split_log, 4);
      addToUserAgentHash(obj);
    } else if (logType === "IPAddress:") {
      obj.ip_address = addSplits(split_log, 4);
      addToIpHash(obj);
    } else if (logType === "Route") {
      obj.route = addSplits(split_log, 5);
    } else if (logType === "Returning") {
      obj.returning = addSplits(split_log, 4);
    }
  }

  return {
    requests: requests,
    requestHash: requestHash,
    ips: ips,
    ipHash: ipHash,
    urls: urls,
    urlHash: urlHash,
    userAgents:userAgents,
    userAgentHash: userAgentHash,
  };
}

// process_logs();

exports.process_logs = process_logs;