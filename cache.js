// CacheManager is used for caching objects.
// Just new one, then use .get with a key, a calculation function,
// and optionally a number of seconds to cache.
// If the key exists, it will check for timeout, and if no timeout,
// it just returns the value without recalculating.
// If the key does not exist, or there is a timeout, it calls the
// calculation function (callback) and then caches the result and returns.
// 
// sample usage:
// var cache = new CacheManager();
// var value = cache.get('mykey', function() {
//   ... some calculation
//   return value;
// }, 3600);  // cache for an hour.
// 

var util = require('./model/util');

var CacheObject = function(value, timeout) {
  this.value = value;
  this.timeout = timeout;
}

var CacheManager = function() {
  this.cache = {};
}
CacheManager.prototype.get = function(key, callback, seconds) {
  if (!key) {
    return undefined;
  }
  var now = util.getCurrentTime();
  // if cache hit without timeout
  if (this.cache[key] && this.cache[key].timeout > now) {
    return this.cache[key].value;
  }
  
  if (callback) {
    var value = callback();
    this.cache[key] = new CacheObject(value, now + (seconds * 1000));
  }
  
  if (this.cache[key]) {
    return this.cache[key].value;
  }
  
  return undefined;
}
CacheManager.prototype.remove = function(key) {
  this.cache[key] = undefined;
}

exports.CacheManager = CacheManager;
