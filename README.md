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
  this.deliver(12, 13);
});
q.add(function( arg1, arg2) {
  console.log("2222, arg1: " + arg1 + " arg2: " + arg2);
  return this.deliver();
});
q.add(function() {
  console.log("3333");
  return this.error("last", 999);
  console.log("This is never printed.");
});
q.execute(11);
```

## API

### createQueue(callback_error, callback_succssed, [callback_thisArg])

Creates a new query Queue.

#### callback_error([...])

The callback function was called when the `Queue`'s function call `error()`.

#### callback_successed([...])

The callback function was called when the `Queue` executed completed. It's
parameters come from the last function call `deliver()`.

#### callback_thisArg

The value of `this` provided for the call to `callback_error()` and `callback_successed()`.

### Queue.add(callback)

Add a delegate function. This query will be queued for execution until `execute()`
is called on the `Queue`.
Calling `add()` on an already executing Queue has throws an Exception.

#### callback([...])

The callback function was the delegate function. It bind a object when it called.

##### this.error([...])

Call it when the delegate function catch a error.

##### this.deliver([...])

Deliver to the next delegate function in the Queue.

### Queue.execute([...])

Executes all function that were queued using `Queue.add` as sequence.
Calling `execute()` on an already executing Queue has throws an Exception.
