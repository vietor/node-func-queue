node-func-queue
===============

A simple NodeJS function sequeue execute queue.

## Installation

```bash
$ npm install func-queue
```

## Usage

```javascript
var queue = require('func-queue');

var q = queue.createQueue(function(err, code) {
  console.log("error: " + err + " code: " + code);
}, function() {
  console.log("finished");
});
q.add(function(arg1) {
  console.log("1111, arg1: " + arg1);
  q.deliver(12, 13);
});
q.add(function( arg1, arg2) {
  console.log("2222, arg1: " + arg1 + " arg2: " + arg2);
  q.deliver();
});
q.add(function() {
  console.log("3333");
  q.append(function() {
    console.log("4444");
    return q.error("last", 999);
    console.log("This is never printed.");
  });
  q.deliver();
});
q.execute(11);
```

## API

### createQueue(callback_error, callback_succssed, [callback_thisArg])

Creates a new query Queue.

#### callback_error([...])

The callback function was called when the `Queue`'s function call `error()`.

#### callback_successed([...])

The callback function was called when the `Queue` executed completed. It's parameters come from the last function call `deliver()`.

#### callback_thisArg

The value of `this` provided for the call to `callback_error()` and `callback_successed()`.

### Queue.add(callback)

Add a delegate function. This query will be queued for execution until `execute()` was called by the `Queue`.
Calling `add()` on an already executing Queue has throws an Exception.

### Queue.append(callback)

Append a delegate function when the Queue already executing.

#### callback([...])

The current `Queue` object is its value of `this` when it called.

### error([...])

Call it when the delegate function catch a error.

### escape([...])

Call it when the delegate function escape the Queue as completed.

### deliver([...])

Deliver to the next delegate function in the Queue.

### Queue.execute([...])

Executes all function that were queued using `Queue.add` as sequence.
Calling `execute()` on an already executing Queue has throws an Exception.
