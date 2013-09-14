function Queue(callback_error, callback_successed, callback_thisArg) {
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
        callback_error.apply(callback_thisArg, arguments);
      },
      deliver: function() {
        if(queue.length < 1)
          callback_successed.apply(callback_thisArg, arguments);
        else
          queue.shift().apply(wrapper, arguments);
      }
    };
    queue.shift().apply(wrapper, arguments);
  };
};

module.exports.createQueue = function(callback_error, callback_successed, callback_thisArg) {
  return new Queue(callback_error, callback_successed, callback_thisArg);
}
