var queue = require('../index');

var q = queue.createQueue(function(err) {
  if(err)
    console.log("error: " + err);
  else
    console.log("finished");
});
q.add(function() {
  console.log("1111");
  this.deliver(12, 13);
});
q.add(function( arg1, arg2) {
  console.log("2222, args1: " + arg1 + " args2: " + arg2);
  return this.deliver();
});
q.add(function( arg1, arg2) {
  console.log("3333");
  return this.error("last");
  console.log("This is never printed.");
});
q.execute();
