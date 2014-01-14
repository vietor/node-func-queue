var queue = require('../index');

console.log("Queue benchmark test:");

var i = 0;
var begin = new Date().getTime();
var on_test = function(on_end) {
  var q = queue.createQueue(function(err) {
    on_end();
  }, function() {
    on_end();
  });
  for(var i=0; i<100; ++i) {
    q.add(function(arg1) {
      q.deliver(++arg1);
    });
  }
  q.execute(1);
};
var on_end = function()
{
  if(i < 100000) {
    ++i;
    setImmediate(function() {
      on_test(on_end);
    });
  }
  else {
    var end = new Date().getTime();
    console.log("times: %j", end - begin);
  }
};

on_test(on_end);
