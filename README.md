node-func-queue
===============

A simple NodeJS function sequence & concurrent execute Queue.

## Installation

```bash
$ npm install func-queue
```

## Usage

```javascript
var queue = require('func-queue');

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
```
### Output
```
Queue test:
step1, arg1: 1
step2, arg1: 2
step3, arg1: 3
error: last code: -1
PersistentQueue test:
value: 1
value: 2
ConcurrentQueue test:
k2, func1
k1, func1
k2, func2
ConcurrentQueue results:
key: k1, error: null, successed: {"0":"q1 successed","1":999}
key: k2, error: {"0":"q2 error"}, successed: null
```

## API

***
### createQueue(callback_error, [callback_succssed], [callback_thisArg])

Creates a new query Queue.

#### callback_error([...])

The callback function was called when the `Queue`'s function call `error()`.

#### callback_successed([...])

The callback function was called when the `Queue` executed completed. It's parameters come from the last function call `deliver()`.
If the function was undefined or null, call callback_error with append new first parameter to null when completed.

#### callback_thisArg

The value of `this` provided for the call to `callback_error()` and `callback_successed()`.

### Queue.add(callback)

Add a delegate function. This query will be queued for execution until `execute()` was called by the `Queue`.
Calling `add()` on an already executing Queue has throws an Exception.

#### callback([...])

The current `Queue` object is its value of `this` when it called.

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

***
### createPersistentQueue(callback_error, callback_succssed, [callback_thisArg])

Creates a new query Queue.

#### callback_error([...])

The callback function was called when the `PersistentQueue`'s function call `error()`.

#### callback_successed([...])

The callback function was called when the `PersistentQueue` executed completed. It's parameters come from the last function call `deliver()`.

#### callback_thisArg

The value of `this` provided for the call to `callback_error()` and `callback_successed()`.

### PersistentQueue.add(callback)

Add a delegate function. This query will be queued for execution until `execute()` was called by the `PersistentQueue`.
Calling `add()` on an already executing Queue has throws an Exception.

#### callback([...])

The current `PersistentQueue` object is its value of `this` when it called.

### error([...])

Call it when the delegate function catch a error.

### escape([...])

Call it when the delegate function escape the Queue as completed.

### deliver([...])

Deliver to the next delegate function in the Queue.

### PersistentQueue.execute([...])

Executes all function that were queued using `PersistentQueue.add` as sequence.
Calling `execute()` on an already executing Queue has throws an Exception.

***
### createConcurrentQueue(callback_done, [callback_thisArg])

Creates a new query ConcurrentQueue.

#### callback_done(results)

The callback function was called when the `ConcurrentQueue`'s all child `Queue` was completed.

### ConcurrentQueue.createQueue([key])

Create and add a child `Queue`, return the new `Queue`'s instance. Don't direct call the `Queue`'s `execute()`, it automatic be called until `execute()` was called by the `ConcurrentQueue`.
Calling `createQueue()` on an already executing ConcurrentQueue has throws an Exception.

### ConcurrentQueue.execute()

Executes all child `Queue` that were created using `ConcurrentQueue.createQueue` as concurrented.
Calling `execute()` on an already executing ConcurrentQueue has throws an Exception.
