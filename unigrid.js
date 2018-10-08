'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

var _regeneratorRuntime = (function (module) {
  /**
   * Copyright (c) 2014, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
   * additional grant of patent rights can be found in the PATENTS file in
   * the same directory.
   */

  !function (global) {
    "use strict";

    var hasOwn = Object.prototype.hasOwnProperty;
    var undefined; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    var inModule = typeof module === "object";
    var runtime = global.regeneratorRuntime;
    if (runtime) {
      if (inModule) {
        // If regeneratorRuntime is defined globally and we're in a module,
        // make the exports object identical to regeneratorRuntime.
        module.exports = runtime;
      }
      // Don't bother evaluating the rest of this file if the runtime was
      // already defined globally.
      return;
    }

    // Define the runtime globally (as expected by generated code) as either
    // module.exports (if we're in a module) or a new, empty object.
    runtime = global.regeneratorRuntime = inModule ? module.exports : {};

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided, then outerFn.prototype instanceof Generator.
      var generator = Object.create((outerFn || Generator).prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    runtime.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        prototype[method] = function (arg) {
          return this._invoke(method, arg);
        };
      });
    }

    runtime.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction ||
      // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    runtime.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `value instanceof AwaitArgument` to determine if the yielded value is
    // meant to be awaited. Some may consider the name of this method too
    // cutesy, but they are curmudgeons.
    runtime.awrap = function (arg) {
      return new AwaitArgument(arg);
    };

    function AwaitArgument(arg) {
      this.arg = arg;
    }

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value instanceof AwaitArgument) {
            return Promise.resolve(value.arg).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            resolve(result);
          }, reject);
        }
      }

      if (typeof process === "object" && process.domain) {
        invoke = process.domain.bind(invoke);
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
        // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    runtime.async = function (innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

      return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
              // A return or throw (when the delegate iterator has no throw
              // method) always terminates the yield* loop.
              context.delegate = null;

              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              var returnMethod = delegate.iterator["return"];
              if (returnMethod) {
                var record = tryCatch(returnMethod, delegate.iterator, arg);
                if (record.type === "throw") {
                  // If the return method threw an exception, let that
                  // exception prevail over the original return or throw.
                  method = "throw";
                  arg = record.arg;
                  continue;
                }
              }

              if (method === "return") {
                // Continue with the outer return, now that the delegate
                // iterator has been terminated.
                continue;
              }
            }

            var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);

            if (record.type === "throw") {
              context.delegate = null;

              // Like returning generator.throw(uncaught), but without the
              // overhead of an extra function call.
              method = "throw";
              arg = record.arg;
              continue;
            }

            // Delegate generator ran and handled its own exceptions so
            // regardless of what the method was, we continue as if it is
            // "next" with an undefined arg.
            method = "next";
            arg = undefined;

            var info = record.arg;
            if (info.done) {
              context[delegate.resultName] = info.value;
              context.next = delegate.nextLoc;
            } else {
              state = GenStateSuspendedYield;
              return info;
            }

            context.delegate = null;
          }

          if (method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = arg;
          } else if (method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw arg;
            }

            if (context.dispatchException(arg)) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              method = "next";
              arg = undefined;
            }
          } else if (method === "return") {
            context.abrupt("return", arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            var info = {
              value: record.arg,
              done: context.done
            };

            if (record.arg === ContinueSentinel) {
              if (context.delegate && method === "next") {
                // Deliberately forget the last sent value so that we don't
                // accidentally pass it on to the delegate.
                arg = undefined;
              }
            } else {
              return info;
            }
          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(arg) call above.
            method = "throw";
            arg = record.arg;
          }
        }
      };
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp[toStringTagSymbol] = "Generator";

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    runtime.keys = function (object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    runtime.values = values;

    function doneResult() {
      return { value: undefined, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function reset(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined;
        this.done = false;
        this.delegate = null;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined;
            }
          }
        }
      },

      stop: function stop() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function dispatchException(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;
          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.next = finallyEntry.finallyLoc;
        } else {
          this.complete(record);
        }

        return ContinueSentinel;
      },

      complete: function complete(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = record.arg;
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }
      },

      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function _catch(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        return ContinueSentinel;
      }
    };
  }(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global : typeof window === "object" ? window : typeof self === "object" ? self : this);
  return module.exports;
})({ exports: {} });

var _objectWithoutProperties = (function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
})

var _defineProperty = (function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
})

/*
Copyright (c) 2018, Grzegorz Junka
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// *** Data iterators ***

var isIterable = function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
};

var getIterator = function getIterator(pData, pSelect) {
  function addIterable(obj) {
    return _defineProperty({}, Symbol.iterator, function () {
      return obj;
    });
  }

  function makeAllIterator(data) {
    var nextIndex = 0;
    var obj = {
      next: function next() {
        return nextIndex < data.length ? { value: data[nextIndex++], done: false } : { done: true };
      }
    };
    return addIterable(obj);
  }

  function mkIterator(data, how, test) {
    var nTest = test || function () {
      return true;
    };
    var delivered = false;
    var obj = {
      next: function next() {
        if (!delivered && nTest(data)) {
          delivered = true;
          return { value: how(data), done: false };
        }
        return { done: true };
      }
    };
    return addIterable(obj);
  }

  function makeFirstIterator(data) {
    return mkIterator(data, function (d) {
      return d[Symbol.iterator]().next().value;
    });
  }

  function makeIteratorForItem(item) {
    return mkIterator(item, function (i) {
      return i;
    });
  }

  function makeNumberIterator(data, select) {
    var test = function test(d) {
      return select >= 0 && select < d.length;
    };
    return mkIterator(data, function (d) {
      return d[select];
    }, test);
  }

  function makeStringIterator(data, select) {
    if (select === 'all') {
      if (isIterable(data)) {
        return data;
      } else {
        return makeAllIterator(data);
      }
    } else if (select === 'first') {
      if (isIterable(data)) {
        return makeFirstIterator(data);
      } else {
        return makeIteratorForItem(data);
      }
    }
  }

  switch (typeof pSelect) {
    case 'number':
      return makeNumberIterator(pData, pSelect);
    case 'string':
      return makeStringIterator(pData, pSelect);
  }
  return undefined;
};

var _slicedToArray = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
})();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _classCallCheck = (function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
})

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _possibleConstructorReturn = (function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
})

var _inherits = (function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
})

/*
Copyright (c) 2018, Grzegorz Junka
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var UnigridEmptyCell = function UnigridEmptyCell(p) {
  var cleaned = cleanCellProps(p);
  var Tx = p.Tx;
  return React.createElement(Tx, cleaned);
};

var UnigridTextCell = function UnigridTextCell(p) {
  var cleaned = cleanCellProps(p);
  var Tx = p.Tx;
  return React.createElement(
    Tx,
    cleaned,
    p.cell
  );
};

var UnigridNumberCell = function UnigridNumberCell(p) {
  var cleaned = cleanCellProps(p);
  var Tx = p.Tx;
  return React.createElement(
    Tx,
    cleaned,
    p.cell.toString()
  );
};

/*
Copyright (c) 2018, Grzegorz Junka
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// *** Sorting functions ***

var _propertyFormatter = function _propertyFormatter(props) {
  var nested = props.show.split('.');

  var last = props.item;
  for (var i = 0; i < nested.length; i++) {
    if (!isDefined(last, nested[i])) {
      return undefined;
    }
    last = last[nested[i]];
  }
  return last;
};

var _functionFormatter = function _functionFormatter(props) {
  return props.show(props);
};

var applyFormatter = function applyFormatter(pProps) {
  var tShow = typeof pProps.show;
  switch (tShow) {
    case 'string':
      return _propertyFormatter(pProps);
    case 'function':
      return _functionFormatter(pProps);
  }
  return undefined;
};

var _compareString = function _compareString(a, b) {
  var la = a.toLowerCase();
  var lb = b.toLowerCase();

  if (la < lb) return -1;
  if (la > lb) return 1;
  return 0;
};

var _compareAttributes = function _compareAttributes(oAttrA, oAttrB) {
  var noA = oAttrA === undefined || oAttrA === null;
  var noB = oAttrB === undefined || oAttrB === null;
  if (noA && noB) return 0;
  if (noA) return 1; // put undefined/null last
  if (noB) return -1;

  var attrA = typeof oAttrA === 'object' ? oAttrA.valueOf() : oAttrA;
  var attrB = typeof oAttrB === 'object' ? oAttrB.valueOf() : oAttrB;

  var aType = typeof attrA;
  var bType = typeof attrB;

  if (aType !== bType) {
    if (aType === 'number' && bType === 'string') return -1;
    if (aType === 'string' && bType === 'number') return 1;
    return 0;
  }

  if (aType === 'string') {
    var retVal = _compareString(attrA, attrB);
    if (retVal !== 0) return retVal;
  } else if (aType === 'number') {
    var _retVal = attrA - attrB;
    if (_retVal !== 0) return _retVal;
  }
  return 0;
};

var _compareObjects = function _compareObjects(a, b, attrs, isAsc) {
  for (var i = 0; i < attrs.length; i++) {
    var aVal = applyFormatter({ show: attrs[i], item: a });
    var bVal = applyFormatter({ show: attrs[i], item: b });
    var retVal = _compareAttributes(aVal, bVal);
    if (retVal === 0) {
      continue;
    } else {
      return isAsc ? retVal : -retVal;
    }
  }
  return 0;
};

var getColumns = function getColumns(box, fields) {
  switch (typeof fields) {
    case 'undefined':
      return [box.column];
    case 'function':
      return fields(box.column) || [];
    case 'string':
      return [fields];
    default:
      return fields;
  }
};

// fields - The list of fields in the 'item' by which the input 'data'
//   should be sorted. If it's a function then it will be called, with the
//   selected column as its argument, to obtain the list of fields.
// defOrder - default order if 'box.order' isn't defined.
var _sorter = function _sorter(data, box, fields) {
  var defOrder = arguments.length <= 3 || arguments[3] === undefined ? 'asc' : arguments[3];

  var itemCounter = idMaker();
  var nColumns = getColumns(box, fields);
  var isAsc = (box.order || defOrder) === 'asc';
  var comparer = function comparer(a, b) {
    return _compareObjects(a, b, nColumns, isAsc);
  };
  var arr = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var i = _step.value;

      arr.push(Object.assign({}, { _unigridId: itemCounter.next().value }, i));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return arr.sort(comparer);
};

var getSorter = function getSorter(colToFields, defOrder) {
  return function (data, box) {
    return _sorter(data, box, colToFields, defOrder);
  };
};

// 'column' is used to track a change in sorting order. This name is supplied
//   to the sorter function, so if it's a name of a field in the data item
//   the default columnToFields mapper function can be used.
// 'order' is the order to be used when sorting. Its behaviour depends on
//     values supplied to this function in previous calls (if there were any).
//   Valid values are: undefined, 'alter', 'old:alter',
//     'asc', 'desc', 'new:asc' and 'new:desc'.
//   If undefined is supplied then 'new:asc' is used as default.
//   Value 'alter' means that subsequnt calls will alternate the order
//     ('asc' to 'desc' and 'desc' to 'asc').
//   Value 'old:alter' is similar to 'alter' but it will alternate only if the
//     supplied 'column' value is the same as supplied in the previous call.
//     If a new 'column' is supplied then it will leave the order unchanged.
//   Value 'asc' or 'desc' will unconditionally sort in ascending or
//     descending order.
//   Values 'new:asc' and 'new:desc' mean that the order (ascending or
//     descending) is to be used only if a new 'column' is supplied,
//     i.e. if 'box.column' != 'column. Otherwise the order will alternate.
// The first argument can be a function to override this with a new behaviour.
var updateBox = function updateBox(box, column, order) {
  var alternate = function alternate(o) {
    return o === 'asc' ? 'desc' : 'asc';
  };
  if (typeof column === 'function') {
    box = column(box, order);
  } else {
    var nOrder = order || 'new:asc';
    var _box = box;
    var bColumn = _box.column;
    var bOrder = _box.order;

    var isNew = !bColumn || bColumn !== column;
    bColumn = isNew ? column : bColumn;

    switch (nOrder) {
      case 'alter':
        bOrder = alternate(bOrder);
        break;
      case 'old:alter':
        bOrder = isNew ? bOrder : alternate(bOrder);
        break;
      case 'asc':
        bOrder = 'asc';
        break;
      case 'desc':
        bOrder = 'desc';
        break;
      case 'new:asc':
        bOrder = isNew ? 'asc' : alternate(bOrder);
        break;
      case 'new:desc':
        bOrder = isNew ? 'desc' : alternate(bOrder);
        break;
    }

    box = Object.assign({}, box, { column: bColumn, order: bOrder });
  }
  return box;
};

var sort = function sort(unigrid, column, order) {
  var box = unigrid.getBox();
  unigrid.setBox(updateBox(box, column, order));
};

/*
Copyright (c) 2018, Grzegorz Junka
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var UnigridRow = function (_React$Component) {
  _inherits(UnigridRow, _React$Component);

  function UnigridRow() {
    _classCallCheck(this, UnigridRow);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridRow).apply(this, arguments));
  }

  _createClass(UnigridRow, [{
    key: 'render',
    value: function render() {
      return UnigridRow.create(this.props);
    }
  }], [{
    key: 'mkProps',
    value: function mkProps(oCell, item, box, renderAs, rowAs, mixIn, addProp) {
      var cell = undefined;
      var props = Object.assign({}, addProp, mixIn);

      // Special case for deep merging 'cell'
      var cellMixIn = isDefined(props, 'cell') && typeof (props.cell === 'object') ? props.cell : false;

      // create a shallow copy to avoid mutating props
      if (typeof oCell === 'object') {
        Object.assign(props, oCell);
        // Re-merge the 'cell' objects from oCell and mixIn
        if (cellMixIn && isDefined(oCell, 'cell') && typeof oCell.cell === 'object') {
          props.cell = Object.assign({}, cellMixIn, oCell.cell);
        }
      } else {
        cell = oCell;
      }

      if (cell !== undefined) {
        Object.assign(props, { show: cell });
      }
      if (!isDefined(props, 'item') && item !== undefined) {
        Object.assign(props, { item: item });
      }
      if (!isDefined(props, 'box') && box !== undefined) {
        Object.assign(props, { box: box });
      }
      if (!isDefined(props, 'renderAs') && renderAs !== undefined) {
        Object.assign(props, { renderAs: renderAs });
      }
      if (!isDefined(props, 'rowAs') && rowAs !== undefined) {
        Object.assign(props, { rowAs: rowAs });
      }

      return props;
    }
  }, {
    key: 'cellTypeAndProps',
    value: function cellTypeAndProps(cell, item, box, renderAs, rowAs, mixIn, addProp) {
      if (cell === null) {
        var props = this.mkProps(undefined, item, box, renderAs, rowAs, mixIn, addProp);
        return ['empty', tryAmend(props, item, box, 'cell', 'cell')];
      }

      var cellProps = this.mkProps(cell, item, box, renderAs, rowAs, mixIn, addProp);

      if (!isDefined(cellProps, 'cell') && isDefined(cellProps, 'show')) {
        Object.assign(cellProps, { cell: applyFormatter(cellProps) });
      }

      cellProps = tryAmend(cellProps, item, box, 'cell', 'cell');

      if (isDefined(cellProps, 'as')) {
        return [cellProps.as, cellProps];
      }

      return [typeof cellProps.cell, cellProps];
    }
  }, {
    key: 'createCellForType',
    value: function createCellForType(cellTypes, type, oProps) {
      var show = oProps.show;
      var using = oProps.using;
      var as = oProps.as;
      var bindToCell = oProps.bindToCell;

      var nProps = _objectWithoutProperties(oProps, ['show', 'using', 'as', 'bindToCell']);

      var Tx = nProps.renderAs || (nProps.rowAs === 'header' ? 'th' : 'td');
      Object.assign(nProps, { Tx: Tx });

      if (typeof type !== 'string') {
        if (isDefined(type, 'type')) {
          return React.cloneElement(type, nProps);
        }
        return React.createElement(type, nProps);
      }

      if (cellTypes && isDefined(cellTypes, type)) {
        return React.createElement(cellTypes[type], nProps);
      }

      switch (type) {
        case 'string':
          return React.createElement(UnigridTextCell, nProps);
        case 'number':
          return React.createElement(UnigridNumberCell, nProps);
        case 'empty':
          return React.createElement(UnigridEmptyCell, nProps);
      }

      // 'undefined' type
      return React.createElement(UnigridTextCell, _extends({}, nProps, { cell: "Error: " + JSON.stringify(oProps) }));
    }
  }, {
    key: 'createAndProcessCell',
    value: function createAndProcessCell(cell, item, box, renderAs, rowAs, mixIn, cellTypes, oAddProp, idCounter) {
      var addProp = Object.assign({}, oAddProp, { key: idCounter.next().value });

      var _cellTypeAndProps = this.cellTypeAndProps(cell, item, box, renderAs, rowAs, mixIn, addProp);

      var _cellTypeAndProps2 = _slicedToArray(_cellTypeAndProps, 2);

      var type = _cellTypeAndProps2[0];
      var props = _cellTypeAndProps2[1];

      var binds = props.bindToCell || [];
      binds = typeof binds === 'string' ? [binds] : binds;
      var toAdd = [];

      var _loop = function _loop(i) {
        var funName = binds[i];
        var oldFun = props[funName];
        if (oldFun !== undefined) {
          var newFun = function newFun() {
            return oldFun.apply(this.unigridCell, arguments);
          };
          toAdd.push(newFun);
          props[funName] = newFun.bind(newFun);
        }
      };

      for (var i = 0; i < binds.length; i++) {
        _loop(i);
      }
      var component = this.createCellForType(cellTypes, type, props);
      for (var _i = 0; _i < toAdd.length; _i++) {
        toAdd[_i].unigridCell = component;
      }
      return component;
    }
  }, {
    key: 'create',
    value: function create(oCfg) {
      var elems = oCfg.cells || [];
      var arr = [];
      var idCounter = idMaker();
      var addProp = isDefined(oCfg, 'treeAmend') ? { treeAmend: oCfg.treeAmend } : undefined;

      var cfg = tryAmend(oCfg, oCfg.item, oCfg.box);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = elems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          arr.push(UnigridRow.createAndProcessCell(i, cfg.item, cfg.box, cfg.renderAs, cfg.rowAs, cfg.mixIn, cfg.cellTypes, addProp, idCounter));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var children = React.Children.map(cfg.children, function (child) {
        var chCfg = Object.assign({}, child.props, { as: child });
        arr.push(UnigridRow.createAndProcessCell(chCfg, cfg.item, cfg.box, cfg.renderAs, cfg.rowAs, cfg.mixIn, cfg.cellTypes, addProp, idCounter));
      });

      var cleaned = cleanProps(cfg);
      return React.createElement(cfg.renderAs || 'tr', cleaned, arr);
    }
  }]);

  return UnigridRow;
}(React.Component);

var UnigridHeaderRow = function UnigridHeaderRow(props) {
  return React.createElement(UnigridRow, _extends({ rowAs: 'header' }, props));
};

/*
Copyright (c) 2018, Grzegorz Junka
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var UnigridSection = function (_React$Component) {
  _inherits(UnigridSection, _React$Component);

  function UnigridSection() {
    _classCallCheck(this, UnigridSection);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridSection).apply(this, arguments));
  }

  _createClass(UnigridSection, [{
    key: 'makeElement',
    value: function makeElement(name) {
      var _props = this.props;
      var unfolded = _props.unfolded;
      var box = _props.box;
      var sectionCounter = _props.sectionCounter;
      var data = _props.data;
      var item = _props.item;

      var cfg = _objectWithoutProperties(_props, ['unfolded', 'box', 'sectionCounter', 'data', 'item']);

      var children = this.props.children;
      if (!unfolded) {
        children = createChildren(cfg, box, cfg, sectionCounter, data, item);
      }
      var cleaned = cleanProps(cfg);
      return React.createElement(name, cleaned, children);
    }
  }], [{
    key: '_getSectionComponent',
    value: function _getSectionComponent(section) {
      switch (section) {
        case 'header':
          return UnigridHeader;
        case 'body':
          return UnigridSegment;
        case 'footer':
          return UnigridFooter;
      }
    }
  }, {
    key: 'create',
    value: function create(cfg, box, props, counter, section, data, item) {
      var children = createChildren(cfg, box, props, counter, data, item);
      var cleaned = cleanProps(cfg);
      Object.assign(cleaned, {
        children: children, unfolded: true, key: counter.next().value
      });
      return React.createElement(this._getSectionComponent(section), cleaned);
    }
  }]);

  return UnigridSection;
}(React.Component);

var UnigridHeader = function (_UnigridSection) {
  _inherits(UnigridHeader, _UnigridSection);

  function UnigridHeader() {
    _classCallCheck(this, UnigridHeader);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridHeader).apply(this, arguments));
  }

  _createClass(UnigridHeader, [{
    key: 'render',
    value: function render() {
      return this.makeElement(this.props.renderAs || 'thead');
    }
  }]);

  return UnigridHeader;
}(UnigridSection);

var UnigridSegment = function (_UnigridSection2) {
  _inherits(UnigridSegment, _UnigridSection2);

  function UnigridSegment() {
    _classCallCheck(this, UnigridSegment);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridSegment).apply(this, arguments));
  }

  _createClass(UnigridSegment, [{
    key: 'render',
    value: function render() {
      return this.makeElement(this.props.renderAs || 'tbody');
    }
  }]);

  return UnigridSegment;
}(UnigridSection);

var UnigridFooter = function (_UnigridSection3) {
  _inherits(UnigridFooter, _UnigridSection3);

  function UnigridFooter() {
    _classCallCheck(this, UnigridFooter);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnigridFooter).apply(this, arguments));
  }

  _createClass(UnigridFooter, [{
    key: 'render',
    value: function render() {
      return this.makeElement(this.props.renderAs || 'tfoot');
    }
  }]);

  return UnigridFooter;
}(UnigridSection);

/*
Copyright (c) 2018, Grzegorz Junka
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var NODE_ENV = typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';

// *** Utility functions ***

var isDefined = function isDefined(obj, prop) {
  var undefined; // really undefined
  return !!obj && typeof obj === 'object' && obj.hasOwnProperty(prop) && obj[prop] !== undefined;
};

var cleanProps = function cleanProps(props) {
  var table = props.table;
  var data = props.data;
  var item = props.item;
  var box = props.box;
  var sectionCounter = props.sectionCounter;
  var cellTypes = props.cellTypes;
  var amend = props.amend;
  var treeAmend = props.treeAmend;
  var condition = props.condition;
  var fromProperty = props.fromProperty;
  var process = props.process;
  var select = props.select;
  var section = props.section;
  var cells = props.cells;
  var renderAs = props.renderAs;
  var rowAs = props.rowAs;
  var mixIn = props.mixIn;
  var $do = props.$do;
  var children = props.children;
  var bindToElement = props.bindToElement;

  var other = _objectWithoutProperties(props, ['table', 'data', 'item', 'box', 'sectionCounter', 'cellTypes', 'amend', 'treeAmend', 'condition', 'fromProperty', 'process', 'select', 'section', 'cells', 'renderAs', 'rowAs', 'mixIn', '$do', 'children', 'bindToElement']);

  return other;
};

var cleanCellProps = function cleanCellProps(props) {
  var cell = props.cell;
  var show = props.show;
  var item = props.item;
  var box = props.box;
  var renderAs = props.renderAs;
  var rowAs = props.rowAs;
  var amend = props.amend;
  var bindToCell = props.bindToCell;
  var treeAmend = props.treeAmend;
  var Tx = props.Tx;

  var other = _objectWithoutProperties(props, ['cell', 'show', 'item', 'box', 'renderAs', 'rowAs', 'amend', 'bindToCell', 'treeAmend', 'Tx']);

  return other;
};

var idMaker = _regeneratorRuntime.mark(function idMaker() {
  var index;
  return _regeneratorRuntime.wrap(function idMaker$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          index = 0;

        case 1:
          

          _context.next = 4;
          return index++;

        case 4:
          _context.next = 1;
          break;

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, idMaker, this);
});

// *** Processing expression objects ***

function _applyAmend(cfg, item, box, fun) {
  return Object.assign({}, cfg, fun(cfg, item, box));
}

function _amend(cfg, expr, item, box, how, def) {
  if (typeof how === 'function') {
    if (expr === def || !expr) {
      return _applyAmend(cfg, item, box, how);
    }
  } else if (expr && isDefined(how, expr)) {
    return _applyAmend(cfg, item, box, how[expr]);
  }
  return cfg;
}

var tryAmend = function tryAmend(pCfg, pItem, pBox, pExpr, pDef) {
  if (isDefined(pCfg, 'amend')) {
    return _amend(pCfg, pExpr, pItem, pBox, pCfg.amend, pDef);
  } else if (isDefined(pCfg, 'treeAmend')) {
    return _amend(pCfg, pExpr, pItem, pBox, pCfg.treeAmend, pDef);
  }
  return pCfg;
};

// *** Unigrid rendering functions ***

var prepAmend = function prepAmend(iCfg, iItem, iBox, expr) {
  if (isDefined(iCfg, expr)) {
    var aCfg = tryAmend(iCfg, iItem, iBox, expr);
    if (isDefined(aCfg, expr)) {
      return aCfg;
    }
  }
  return false;
};

function _isSupported(elem) {
  var isUnigrid = elem.type && elem.type.isUnigrid && elem.type.isUnigrid();
  /*
  // Maybe once react supports returning multiple children from a render function
  acc.push(<Unigrid table={nCfg} data={data} item={item} box={this.props.box}
  cellTypes={this.props.cellTypes} isChildUnigrid={true} />);
  */
  return !isUnigrid;
}

function _processChild(child, props) {
  // Pass null and undefined to React
  if (!child) {
    return child;
  }

  var binds = child.props.bindToElement || [];
  binds = typeof binds === 'string' ? [binds] : binds;
  var toAdd = [];

  var _loop = function _loop(i) {
    var funName = binds[i];
    var oldFun = child.props[funName];
    if (oldFun !== undefined) {
      var newFun = function newFun() {
        return oldFun.apply(this.unigridElement, arguments);
      };
      toAdd.push(newFun);
      props[funName] = newFun.bind(newFun);
    }
  };

  for (var i = 0; i < binds.length; i++) {
    _loop(i);
  }
  var component = React.cloneElement(child, props);
  for (var _i = 0; _i < toAdd.length; _i++) {
    toAdd[_i].unigridElement = component;
  }
  return component;
}

function _getChildren(cfg, box, counter, data, item, cTypes) {
  var props = {
    box: box, data: data, item: item, cellTypes: cTypes,
    sectionCounter: counter, key: counter.next().value
  };
  if (isDefined(cfg, 'treeAmend')) {
    Object.assign(props, { treeAmend: cfg.treeAmend });
  }
  if (isDefined(cfg, 'renderAs')) {
    Object.assign(props, { renderAs: cfg.renderAs });
  }
  return React.Children.map(cfg.children, function (child) {
    return _processChild(child, props);
  });
}

function _shouldRender(condition, item) {
  var exists = isDefined(condition, 'property') && isDefined(item, condition.property);

  switch (condition.ifDoes) {
    case 'exist':
      return exists;
    case 'notExist':
      return !exists;
    case 'equal':
      return exists && isDefined(condition, 'value') && item[condition.property] === condition.value;
    case 'notEqual':
      return !exists || !isDefined(condition, 'value') || item[condition.property] !== condition.value;
  }
  return true;
}

function addRows(cfg, box, props, counter, acc, data, item) {
  var aCfg = prepAmend(cfg, item, box, 'condition');
  if (aCfg) {
    if (!_shouldRender(aCfg.condition, item)) return;
  }

  aCfg = prepAmend(cfg, item, box, 'fromProperty');
  if (aCfg) {
    var _aCfg = aCfg;
    var condition = _aCfg.condition;
    var fromProperty = _aCfg.fromProperty;

    var nCfg = _objectWithoutProperties(_aCfg, ['condition', 'fromProperty']);

    var nData = item[aCfg.fromProperty];

    if (NODE_ENV !== 'production') {
      if (!nData || typeof nData !== 'object') {
        throw new Error('Invalid value supplied to "fromProperty": ' + aCfg.fromProperty + '. ' + 'The property could not be found in the data supplied to Unigrid. ' + 'Consider adding the "ifDoes" exist condition.');
      }
    }

    addChildren(nCfg, box, props, counter, acc, nData, undefined);
    return;
  }

  aCfg = prepAmend(cfg, item, box, 'process');
  if (aCfg) {
    var _aCfg2 = aCfg;
    var _condition = _aCfg2.condition;
    var _fromProperty = _aCfg2.fromProperty;
    var _process = _aCfg2.process;

    var _nCfg = _objectWithoutProperties(_aCfg2, ['condition', 'fromProperty', 'process']);

    var _nData = aCfg.process(data, box);

    if (NODE_ENV !== 'production') {
      if (!_nData || typeof _nData !== 'object') {
        throw new Error('Invalid data returned from the "process" function.');
      }
    }

    addChildren(_nCfg, box, props, counter, acc, _nData, undefined);
    return;
  }

  aCfg = prepAmend(cfg, item, box, 'select');
  if (aCfg) {
    var _aCfg3 = aCfg;
    var _condition2 = _aCfg3.condition;
    var _fromProperty2 = _aCfg3.fromProperty;
    var _process2 = _aCfg3.process;
    var select = _aCfg3.select;

    var _nCfg2 = _objectWithoutProperties(_aCfg3, ['condition', 'fromProperty', 'process', 'select']);

    executeSelect(_nCfg2, box, props, counter, acc, aCfg.select, data);
    return;
  }

  aCfg = prepAmend(cfg, item, box, 'section');
  if (aCfg) {
    var _aCfg4 = aCfg;
    var _condition3 = _aCfg4.condition;
    var _fromProperty3 = _aCfg4.fromProperty;
    var _process3 = _aCfg4.process;
    var _select = _aCfg4.select;
    var section = _aCfg4.section;

    var _nCfg3 = _objectWithoutProperties(_aCfg4, ['condition', 'fromProperty', 'process', 'select', 'section']);

    acc.push(UnigridSection.create(_nCfg3, box, props, counter, aCfg.section, data, item));
    return;
  }

  var cTypes = props.cellTypes;
  aCfg = prepAmend(cfg, item, box, 'cells');
  if (aCfg) {
    var _aCfg5 = aCfg;
    var _condition4 = _aCfg5.condition;
    var _fromProperty4 = _aCfg5.fromProperty;
    var _process4 = _aCfg5.process;
    var _select2 = _aCfg5.select;
    var _section = _aCfg5.section;
    var _children = _aCfg5.children;

    var _nCfg4 = _objectWithoutProperties(_aCfg5, ['condition', 'fromProperty', 'process', 'select', 'section', 'children']);

    var nId = counter.next().value;
    var key = isDefined(item, '_unigridId') ? item._unigridId + '-' + nId : nId;
    acc.push(UnigridRow.create(Object.assign(_nCfg4, { box: box, item: item, cellTypes: cTypes, key: key })));
  }

  aCfg = prepAmend(cfg, item, box, '$do');
  if (aCfg) {
    var addProp = isDefined(aCfg, 'treeAmend') ? { treeAmend: aCfg.treeAmend } : undefined;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = aCfg.$do[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var i = _step.value;

        var _nCfg5 = addProp ? Object.assign({}, addProp, i) : i;
        addChildren(_nCfg5, box, props, counter, acc, data, item);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  var children = _getChildren(cfg, box, counter, data, item, cTypes) || [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _i2 = _step2.value;

      if (_isSupported(_i2)) {
        acc.push(_i2);
      } else {
        addChildren(_i2.props, box, props, counter, acc, data, item);
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}

function executeSelect(cfg, box, props, counter, acc, select, data) {
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = getIterator(data, select)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var i = _step3.value;

      addRows(cfg, box, props, counter, acc, data, i);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
}

function addChildren(cfg, box, props, counter, acc, data, item) {
  if (item === undefined) {
    executeSelect(cfg, box, props, counter, acc, 'first', data);
  } else {
    addRows(cfg, box, props, counter, acc, data, item);
  }
}

var createChildren = function createChildren(cfg, box, props, counter, data, item) {
  var acc = [];
  addChildren(cfg, box, props, counter, acc, data, item);
  return acc;
};

var newChildren = function newChildren(cfg, box, props, data, item) {
  var counter = idMaker();
  return createChildren(cfg, box, props, counter, data, item);
};

/*
Copyright (c) 2018, Grzegorz Junka
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var Unigrid = function (_React$Component) {
  _inherits(Unigrid, _React$Component);

  function Unigrid(props) {
    _classCallCheck(this, Unigrid);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Unigrid).call(this, props));

    _this.state = isDefined(_this.props, 'box') ? _this.props.box : undefined;
    return _this;
  }

  _createClass(Unigrid, [{
    key: 'getBox',
    value: function getBox() {
      return this.box || this.props.box || {};
    }
  }, {
    key: 'setBox',
    value: function setBox(box) {
      this.box = box;
      this.setState(box);
    }
  }, {
    key: 'render',
    value: function render() {
      return Unigrid.create(this.props, this.getBox());
    }
  }], [{
    key: 'isUnigrid',
    value: function isUnigrid() {
      return true;
    }
  }, {
    key: 'create',
    value: function create(oProps, oBox) {
      var nProps = Object.assign({}, oProps.table || {}, oProps);
      var table = nProps.table;
      var data = nProps.data;
      var item = nProps.item;
      var box = nProps.box;
      var cellTypes = nProps.cellTypes;

      var cfg = _objectWithoutProperties(nProps, ['table', 'data', 'item', 'box', 'cellTypes']);

      var children = newChildren(cfg, oBox, oProps, data, item);
      var cleaned = cleanProps(nProps);
      return React.createElement(cfg.renderAs || 'table', cleaned, children);
    }
  }]);

  return Unigrid;
}(React.Component);

/*
Copyright (c) 2018, Grzegorz Junka
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

exports.Unigrid = Unigrid;
exports.isDefined = isDefined;
exports.cleanCellProps = cleanCellProps;
exports.idMaker = idMaker;
exports.getSorter = getSorter;
exports.updateBox = updateBox;
exports.sort = sort;
exports.UnigridEmptyCell = UnigridEmptyCell;
exports.UnigridTextCell = UnigridTextCell;
exports.UnigridNumberCell = UnigridNumberCell;
exports.UnigridHeader = UnigridHeader;
exports.UnigridSegment = UnigridSegment;
exports.UnigridFooter = UnigridFooter;
exports.UnigridRow = UnigridRow;
exports.UnigridHeaderRow = UnigridHeaderRow;

//# sourceMappingURL=unigrid.js.map