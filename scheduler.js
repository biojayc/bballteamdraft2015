
var Scheduler = function() {
  this.functs = [];
}
Scheduler.prototype.add = function(funct) {
  this.functs.push(funct);
  return this;
}
Scheduler.prototype.run = function(cb) {
  var current = 0;
  var that = this;
  var runner = function() {
    if (current < that.functs.length) {
      current++;
      that.functs[current-1](runner);
    } else if (cb) {
      cb();
    }
  }
  runner();
}
function create() {
  return new Scheduler();
}

exports.create = create;


var test = function() {
  var count = 0;
  create().add(function(cb) {
    count++;
    cb();
  }).add(function(cb) {
    count++;
    cb();
  }).run(function() {
    console.log(count);
  });
}