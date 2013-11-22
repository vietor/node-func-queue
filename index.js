function Queue(callback_error, callback_successed, callback_thisArg) {
  var queue = [];
  var self = this;
  var aborted = false;
  var executing = false;

  this.add = function(callback) {
    if(executing)
      throw new Error("The Queue already executed");
    queue.push(callback);
  };

  this.append = function(callback) {
    if(!executing)
      throw new Error("The Queue not executed");
    queue.push(callback);
  };

  function abort(error, args) {
    aborted = true;
    while(queue.length > 0)
      queue.shift();
    if(error)
      callback_error.apply(callback_thisArg, args);
    else
      callback_successed.apply(callback_thisArg, args);
  }

  this.error = function() {
    abort(true, arguments);
  };

  this.escape = function() {
    abort(false, arguments);
  };

  function step(args) {
    if(queue.length < 1)
      callback_successed.apply(callback_thisArg, args);
    else
      queue.shift().apply(self, args);
  }

  this.deliver = function() {
    step(arguments);
  };

  this.execute = function() {
    if(executing)
      throw new Error("The Queue already executed");
    executing = true;
    step(arguments);
  };
};

module.exports.createQueue = function(callback_error, callback_successed, callback_thisArg) {
  return new Queue(callback_error, callback_successed, callback_thisArg);
};
