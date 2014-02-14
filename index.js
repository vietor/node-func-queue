var TYPE_NORMAL = 0;
var TYPE_PERSISTENT = 1;

function Queue(store_type, callback_error, callback_successed, callback_thisArg) {
  var queue = [];
  var self = this;
  var pos = 0, size = 0;
  var executing = false;

  this.add = function(callback) {
    if(executing)
      throw new Error("The Queue already executed");
    ++size;
    queue.push(callback);
  };

  this.append = function(callback) {
    if(!executing)
      throw new Error("The Queue not executed");
    if(store_type != TYPE_NORMAL)
      throw new Error("The Queue not support append");
    ++size;
    queue.push(callback);
  };

  function done_error(args) {
    callback_error.apply(callback_thisArg, args);
  }

  function done_success(args) {
    if(callback_successed)
      callback_successed.apply(callback_thisArg, args);
    else {
      [].unshift.call(args, null);
      callback_error.apply(callback_thisArg, args);
    }
  }

  function abort(error, args) {
    if(store_type == TYPE_NORMAL) {
      while(pos < size)
        queue[pos++] = null;
    }
    if(error)
      done_error(args);
    else
      done_success(args);
  }

  this.error = function() {
    abort(true, arguments);
  };

  this.escape = function() {
    abort(false, arguments);
  };

  function step(args) {
    if(pos >= size)
      done_success(args);
    else {
      if(store_type == TYPE_NORMAL && pos > 1)
        queue[pos - 1] = null;
      queue[pos++].apply(self, args);
    }
  }

  this.deliver = function() {
    step(arguments);
  };

  this.execute = function() {
    if(store_type != TYPE_NORMAL)
      pos = 0;
    else {
      if(executing)
        throw new Error("The Queue already executed");
    }
    executing = true;
    step(arguments);
  };
};

module.exports.createQueue = function(callback_error, callback_successed, callback_thisArg) {
  return new Queue(TYPE_NORMAL, callback_error, callback_successed, callback_thisArg);
};

module.exports.createPersistentQueue = function(callback_error, callback_successed, callback_thisArg) {
  return new Queue(TYPE_PERSISTENT, callback_error, callback_successed, callback_thisArg);
};

function ConcurrentQueue(callback_done, callback_thisArg) {
  var array = [];
  var results = [];
  var completed = 0;
  var executing = false;

  function checkAndProcessDone() {
    ++ completed;
    if(completed >= array.length) {
      callback_done.apply(callback_thisArg, [results]);
    }
  }

  this.createQueue = function(key) {
    if(executing)
      throw new Error("The QueueArray already executed");
    var result = {key: key, error: null, successed: null};
    var queue = new Queue(TYPE_NORMAL, function() {
      result.error = arguments;
      checkAndProcessDone();
    }, function() {
      result.successed = arguments;
      checkAndProcessDone();
    });
    array.push(queue);
    results.push(result);
    return queue;
  };

  this.execute = function() {
    if(executing)
      throw new Error("The QueueArray already executed");
    executing = true;
    if(array.length < 1)
      callback_done.apply(callback_thisArg, [results]);
    else {
      for(var i = 0; i < array.length; ++i)
        array[i].execute();
    }
  };
}

module.exports.createConcurrentQueue = function(callback_done, callback_thisArg) {
  return new ConcurrentQueue(callback_done, callback_thisArg);
};
