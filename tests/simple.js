var queue = require('../index');

console.log("Queue test:");
var q = queue.createQueue(function(err, code) {
  console.log("error: " + err + " code: " + code);
}, function() {
  console.log("finished");
});
q.add(function(arg1) {
  console.log("step1, arg1: " + arg1);
  q.deliver(++arg1);
});
q.add(function(arg1) {
  console.log("step2, arg1: " + arg1);
  q.append(function(arg1) {
    console.log("step3, arg1: " + arg1);
    return q.error("last", -1);
    console.log("This is never printed.");
  });
  q.deliver(++arg1);
});
q.execute(1);

console.log("PersistentQueue test:");
var pq = queue.createPersistentQueue(function(err, code) {
  console.log("error: " + err + " code: " + code);
}, function() {
  console.log("finished");
});
pq.add(function(i) {
  console.log("value: " + i);
});
pq.execute(1);
pq.execute(2);

console.log("ConcurrentQueue test:");
var qa = queue.createConcurrentQueue(function(results) {
  console.log("ConcurrentQueue results:");
  for(var i=0; i<results.length; i++) {
    var result = results[i];
    console.log("key: %s, error: %j, successed: %j", result.key, result.error, result.successed);
  }
});
var q1 = qa.createQueue("k1");
q1.add(function() {
  setTimeout(function() {
    console.log("k1, func1");
    q1.deliver("q1 successed", 999);
  }, 100);
});
var q2 = qa.createQueue("k2");
q2.add(function() {
  console.log("k2, func1");
  q2.deliver();
});
q2.add(function() {
  setTimeout(function() {
    console.log("k2, func2");
    q2.error("q2 error");
  }, 200);
});
qa.execute();
