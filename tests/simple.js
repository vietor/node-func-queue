var queue = require('../index');

var q = queue.createQueue(function(err, code) {
  console.log("error: " + err + " code: " + code);
}, function() {
  console.log("finished");
});
q.add(function(arg1) {
  console.log("1111, arg1: " + arg1);
  this.deliver(12, 13);
});
q.add(function( arg1, arg2) {
  console.log("2222, arg1: " + arg1 + " arg2: " + arg2);
  return this.deliver();
});
q.add(function() {
  console.log("3333");
  return this.error("last", 999);
  console.log("This is never printed.");
});
q.execute(11);
