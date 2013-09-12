function Queue(callback_error, callback_successed) {
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
      callback_successed();
      return;
    }

    var wrapper = {
      error: function() {
        aborted = true;
        callback_error.apply(undefined, arguments);
      },
      deliver: function() {
        if(queue.length < 1)
          callback_successed.apply(undefined, arguments);
        else
          queue.shift().apply(wrapper, arguments);
      }
    };
    queue.shift().apply(wrapper, arguments);
  };
};

module.exports.createQueue = function(completed) {
  return new Queue(completed);
}
