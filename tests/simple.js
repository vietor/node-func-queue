var queue = require('../index');

console.log("Queue test:");
var q = queue.createQueue(function(err, code) {
  console.log("error: " + err + " code: " + code);
}, function() {
  console.log("finished");
});
q.add(function(arg1) {
  console.log("step1, arg1: " + arg1);
  q.deliver(2, 3);
});
q.add(function( arg1, arg2) {
  console.log("step2, arg1: " + arg1 + " arg2: " + arg2);
  q.deliver();
});
q.add(function() {
  console.log("step3");
  q.append(function() {
    console.log("step4");
    return q.error("last", 4);
    console.log("This is never printed.");
  });
  q.deliver();
});
q.execute(1);

console.log("QueueArray test:");
var qa = queue.createQueueArray(function(results) {
  console.log("QueueArray results:");
  for(var i=0; i<results.length; i++) {
    var result = results[i];
    console.log("key: %s, error: %j, successed: %j", result.key, result.error, result.successed);
  }
});
var q1 = qa.createQueue("k1");
q1.add(function() {
  console.log("k1, func1");
  q1.deliver("q1 successed", 999);
});
var q2 = qa.createQueue("k2");
q2.add(function() {
  console.log("k2, func1");
  q2.deliver();
});
q2.add(function() {
  console.log("k2, func2");
  q2.error("q2 error");
});
qa.execute();
