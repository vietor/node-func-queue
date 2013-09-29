function Queue(callback_error, callback_successed, callback_thisArg) {
  var queue = [];
  var aborted = false;
  var executing = false;

  this.add = function(callback) {
    if(executing)
      throw new Error("The Queue already executed");

    queue.push(callback);
  };

  this.error = function() {
    aborted = true;
    callback_error.apply(callback_thisArg, arguments);
  };

  this.deliver = function() {
    if(queue.length < 1)
      callback_successed.apply(callback_thisArg, arguments);
    else
      queue.shift().apply(this, arguments);
  };

  this.execute = function() {
    if(executing)
      throw new Error("The Queue already executed");

    executing = true;

    if(queue.length < 1) {
      callback_successed.apply(callback_thisArg, arguments);
      return;
    }

    queue.shift().apply(this, arguments);
  };
};

module.exports.createQueue = function(callback_error, callback_successed, callback_thisArg) {
  return new Queue(callback_error, callback_successed, callback_thisArg);
}
