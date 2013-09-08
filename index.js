function Queue(completed) {
  var queue = [];
  var aborted = false;
  var executing = false;

  this.add = function(callback) {
    if(executing)
      throw new Error("The Queue already executed");

    queue.push(callback);
  };

  this.execute = function() {
    if(executing)
      throw new Error("The Queue already executed");

    executing = true;

    if(queue.length < 1) {
      completed(null);
      return;
    }

    var wrapper = {
      error: function(err) {
        aborted = true;
        completed(err);
      },
      deliver: function() {
        if(queue.length < 1)
          completed(null);
        else
          queue.shift().apply(wrapper, arguments);
      }
    };
    queue.shift().apply(wrapper, []);
  };
};

module.exports.createQueue = function(completed) {
  return new Queue(completed);
}
