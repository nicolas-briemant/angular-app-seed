(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/app.unit.js":[function(require,module,exports){
'use strict';

require('angular-mocks'); // extend angular with a mock property

describe('Unit: SeedController', function() {
  beforeEach(angular.mock.module('SeedApp'));

  var ctrl, scope;
  // inject the $controller and $rootScope services in the beforeEach block
  beforeEach(angular.mock.inject(function($controller, $rootScope) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('SeedController', { $scope: scope });
  }));

  it('should create $scope.hi when calling sayHi', function() {
    expect(scope.hi).toBeUndefined();
    scope.sayHi();
    expect(scope.hi).toEqual('Hi John');
  });
});

},{"angular-mocks":"/home/nicolas/bird/angular-app-seed/node_modules/angular-mocks/angular-mocks.js"}],"/home/nicolas/bird/angular-app-seed/node_modules/angular-mocks/angular-mocks.js":[function(require,module,exports){
/**
 * @license AngularJS v1.2.22
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {

'use strict';

/**
 * @ngdoc object
 * @name angular.mock
 * @description
 *
 * Namespace from 'angular-mocks.js' which contains testing related code.
 */
angular.mock = {};

/**
 * ! This is a private undocumented service !
 *
 * @name $browser
 *
 * @description
 * This service is a mock implementation of {@link ng.$browser}. It provides fake
 * implementation for commonly used browser apis that are hard to test, e.g. setTimeout, xhr,
 * cookies, etc...
 *
 * The api of this service is the same as that of the real {@link ng.$browser $browser}, except
 * that there are several helper methods available which can be used in tests.
 */
angular.mock.$BrowserProvider = function() {
  this.$get = function() {
    return new angular.mock.$Browser();
  };
};

angular.mock.$Browser = function() {
  var self = this;

  this.isMock = true;
  self.$$url = "http://server/";
  self.$$lastUrl = self.$$url; // used by url polling fn
  self.pollFns = [];

  // TODO(vojta): remove this temporary api
  self.$$completeOutstandingRequest = angular.noop;
  self.$$incOutstandingRequestCount = angular.noop;


  // register url polling fn

  self.onUrlChange = function(listener) {
    self.pollFns.push(
      function() {
        if (self.$$lastUrl != self.$$url) {
          self.$$lastUrl = self.$$url;
          listener(self.$$url);
        }
      }
    );

    return listener;
  };

  self.cookieHash = {};
  self.lastCookieHash = {};
  self.deferredFns = [];
  self.deferredNextId = 0;

  self.defer = function(fn, delay) {
    delay = delay || 0;
    self.deferredFns.push({time:(self.defer.now + delay), fn:fn, id: self.deferredNextId});
    self.deferredFns.sort(function(a,b){ return a.time - b.time;});
    return self.deferredNextId++;
  };


  /**
   * @name $browser#defer.now
   *
   * @description
   * Current milliseconds mock time.
   */
  self.defer.now = 0;


  self.defer.cancel = function(deferId) {
    var fnIndex;

    angular.forEach(self.deferredFns, function(fn, index) {
      if (fn.id === deferId) fnIndex = index;
    });

    if (fnIndex !== undefined) {
      self.deferredFns.splice(fnIndex, 1);
      return true;
    }

    return false;
  };


  /**
   * @name $browser#defer.flush
   *
   * @description
   * Flushes all pending requests and executes the defer callbacks.
   *
   * @param {number=} number of milliseconds to flush. See {@link #defer.now}
   */
  self.defer.flush = function(delay) {
    if (angular.isDefined(delay)) {
      self.defer.now += delay;
    } else {
      if (self.deferredFns.length) {
        self.defer.now = self.deferredFns[self.deferredFns.length-1].time;
      } else {
        throw new Error('No deferred tasks to be flushed');
      }
    }

    while (self.deferredFns.length && self.deferredFns[0].time <= self.defer.now) {
      self.deferredFns.shift().fn();
    }
  };

  self.$$baseHref = '';
  self.baseHref = function() {
    return this.$$baseHref;
  };
};
angular.mock.$Browser.prototype = {

/**
  * @name $browser#poll
  *
  * @description
  * run all fns in pollFns
  */
  poll: function poll() {
    angular.forEach(this.pollFns, function(pollFn){
      pollFn();
    });
  },

  addPollFn: function(pollFn) {
    this.pollFns.push(pollFn);
    return pollFn;
  },

  url: function(url, replace) {
    if (url) {
      this.$$url = url;
      return this;
    }

    return this.$$url;
  },

  cookies:  function(name, value) {
    if (name) {
      if (angular.isUndefined(value)) {
        delete this.cookieHash[name];
      } else {
        if (angular.isString(value) &&       //strings only
            value.length <= 4096) {          //strict cookie storage limits
          this.cookieHash[name] = value;
        }
      }
    } else {
      if (!angular.equals(this.cookieHash, this.lastCookieHash)) {
        this.lastCookieHash = angular.copy(this.cookieHash);
        this.cookieHash = angular.copy(this.cookieHash);
      }
      return this.cookieHash;
    }
  },

  notifyWhenNoOutstandingRequests: function(fn) {
    fn();
  }
};


/**
 * @ngdoc provider
 * @name $exceptionHandlerProvider
 *
 * @description
 * Configures the mock implementation of {@link ng.$exceptionHandler} to rethrow or to log errors
 * passed into the `$exceptionHandler`.
 */

/**
 * @ngdoc service
 * @name $exceptionHandler
 *
 * @description
 * Mock implementation of {@link ng.$exceptionHandler} that rethrows or logs errors passed
 * into it. See {@link ngMock.$exceptionHandlerProvider $exceptionHandlerProvider} for configuration
 * information.
 *
 *
 * ```js
 *   describe('$exceptionHandlerProvider', function() {
 *
 *     it('should capture log messages and exceptions', function() {
 *
 *       module(function($exceptionHandlerProvider) {
 *         $exceptionHandlerProvider.mode('log');
 *       });
 *
 *       inject(function($log, $exceptionHandler, $timeout) {
 *         $timeout(function() { $log.log(1); });
 *         $timeout(function() { $log.log(2); throw 'banana peel'; });
 *         $timeout(function() { $log.log(3); });
 *         expect($exceptionHandler.errors).toEqual([]);
 *         expect($log.assertEmpty());
 *         $timeout.flush();
 *         expect($exceptionHandler.errors).toEqual(['banana peel']);
 *         expect($log.log.logs).toEqual([[1], [2], [3]]);
 *       });
 *     });
 *   });
 * ```
 */

angular.mock.$ExceptionHandlerProvider = function() {
  var handler;

  /**
   * @ngdoc method
   * @name $exceptionHandlerProvider#mode
   *
   * @description
   * Sets the logging mode.
   *
   * @param {string} mode Mode of operation, defaults to `rethrow`.
   *
   *   - `rethrow`: If any errors are passed into the handler in tests, it typically
   *                means that there is a bug in the application or test, so this mock will
   *                make these tests fail.
   *   - `log`: Sometimes it is desirable to test that an error is thrown, for this case the `log`
   *            mode stores an array of errors in `$exceptionHandler.errors`, to allow later
   *            assertion of them. See {@link ngMock.$log#assertEmpty assertEmpty()} and
   *            {@link ngMock.$log#reset reset()}
   */
  this.mode = function(mode) {
    switch(mode) {
      case 'rethrow':
        handler = function(e) {
          throw e;
        };
        break;
      case 'log':
        var errors = [];

        handler = function(e) {
          if (arguments.length == 1) {
            errors.push(e);
          } else {
            errors.push([].slice.call(arguments, 0));
          }
        };

        handler.errors = errors;
        break;
      default:
        throw new Error("Unknown mode '" + mode + "', only 'log'/'rethrow' modes are allowed!");
    }
  };

  this.$get = function() {
    return handler;
  };

  this.mode('rethrow');
};


/**
 * @ngdoc service
 * @name $log
 *
 * @description
 * Mock implementation of {@link ng.$log} that gathers all logged messages in arrays
 * (one array per logging level). These arrays are exposed as `logs` property of each of the
 * level-specific log function, e.g. for level `error` the array is exposed as `$log.error.logs`.
 *
 */
angular.mock.$LogProvider = function() {
  var debug = true;

  function concat(array1, array2, index) {
    return array1.concat(Array.prototype.slice.call(array2, index));
  }

  this.debugEnabled = function(flag) {
    if (angular.isDefined(flag)) {
      debug = flag;
      return this;
    } else {
      return debug;
    }
  };

  this.$get = function () {
    var $log = {
      log: function() { $log.log.logs.push(concat([], arguments, 0)); },
      warn: function() { $log.warn.logs.push(concat([], arguments, 0)); },
      info: function() { $log.info.logs.push(concat([], arguments, 0)); },
      error: function() { $log.error.logs.push(concat([], arguments, 0)); },
      debug: function() {
        if (debug) {
          $log.debug.logs.push(concat([], arguments, 0));
        }
      }
    };

    /**
     * @ngdoc method
     * @name $log#reset
     *
     * @description
     * Reset all of the logging arrays to empty.
     */
    $log.reset = function () {
      /**
       * @ngdoc property
       * @name $log#log.logs
       *
       * @description
       * Array of messages logged using {@link ngMock.$log#log}.
       *
       * @example
       * ```js
       * $log.log('Some Log');
       * var first = $log.log.logs.unshift();
       * ```
       */
      $log.log.logs = [];
      /**
       * @ngdoc property
       * @name $log#info.logs
       *
       * @description
       * Array of messages logged using {@link ngMock.$log#info}.
       *
       * @example
       * ```js
       * $log.info('Some Info');
       * var first = $log.info.logs.unshift();
       * ```
       */
      $log.info.logs = [];
      /**
       * @ngdoc property
       * @name $log#warn.logs
       *
       * @description
       * Array of messages logged using {@link ngMock.$log#warn}.
       *
       * @example
       * ```js
       * $log.warn('Some Warning');
       * var first = $log.warn.logs.unshift();
       * ```
       */
      $log.warn.logs = [];
      /**
       * @ngdoc property
       * @name $log#error.logs
       *
       * @description
       * Array of messages logged using {@link ngMock.$log#error}.
       *
       * @example
       * ```js
       * $log.error('Some Error');
       * var first = $log.error.logs.unshift();
       * ```
       */
      $log.error.logs = [];
        /**
       * @ngdoc property
       * @name $log#debug.logs
       *
       * @description
       * Array of messages logged using {@link ngMock.$log#debug}.
       *
       * @example
       * ```js
       * $log.debug('Some Error');
       * var first = $log.debug.logs.unshift();
       * ```
       */
      $log.debug.logs = [];
    };

    /**
     * @ngdoc method
     * @name $log#assertEmpty
     *
     * @description
     * Assert that the all of the logging methods have no logged messages. If messages present, an
     * exception is thrown.
     */
    $log.assertEmpty = function() {
      var errors = [];
      angular.forEach(['error', 'warn', 'info', 'log', 'debug'], function(logLevel) {
        angular.forEach($log[logLevel].logs, function(log) {
          angular.forEach(log, function (logItem) {
            errors.push('MOCK $log (' + logLevel + '): ' + String(logItem) + '\n' +
                        (logItem.stack || ''));
          });
        });
      });
      if (errors.length) {
        errors.unshift("Expected $log to be empty! Either a message was logged unexpectedly, or "+
          "an expected log message was not checked and removed:");
        errors.push('');
        throw new Error(errors.join('\n---------\n'));
      }
    };

    $log.reset();
    return $log;
  };
};


/**
 * @ngdoc service
 * @name $interval
 *
 * @description
 * Mock implementation of the $interval service.
 *
 * Use {@link ngMock.$interval#flush `$interval.flush(millis)`} to
 * move forward by `millis` milliseconds and trigger any functions scheduled to run in that
 * time.
 *
 * @param {function()} fn A function that should be called repeatedly.
 * @param {number} delay Number of milliseconds between each function call.
 * @param {number=} [count=0] Number of times to repeat. If not set, or 0, will repeat
 *   indefinitely.
 * @param {boolean=} [invokeApply=true] If set to `false` skips model dirty checking, otherwise
 *   will invoke `fn` within the {@link ng.$rootScope.Scope#$apply $apply} block.
 * @returns {promise} A promise which will be notified on each iteration.
 */
angular.mock.$IntervalProvider = function() {
  this.$get = ['$rootScope', '$q',
       function($rootScope,   $q) {
    var repeatFns = [],
        nextRepeatId = 0,
        now = 0;

    var $interval = function(fn, delay, count, invokeApply) {
      var deferred = $q.defer(),
          promise = deferred.promise,
          iteration = 0,
          skipApply = (angular.isDefined(invokeApply) && !invokeApply);

      count = (angular.isDefined(count)) ? count : 0;
      promise.then(null, null, fn);

      promise.$$intervalId = nextRepeatId;

      function tick() {
        deferred.notify(iteration++);

        if (count > 0 && iteration >= count) {
          var fnIndex;
          deferred.resolve(iteration);

          angular.forEach(repeatFns, function(fn, index) {
            if (fn.id === promise.$$intervalId) fnIndex = index;
          });

          if (fnIndex !== undefined) {
            repeatFns.splice(fnIndex, 1);
          }
        }

        if (!skipApply) $rootScope.$apply();
      }

      repeatFns.push({
        nextTime:(now + delay),
        delay: delay,
        fn: tick,
        id: nextRepeatId,
        deferred: deferred
      });
      repeatFns.sort(function(a,b){ return a.nextTime - b.nextTime;});

      nextRepeatId++;
      return promise;
    };
    /**
     * @ngdoc method
     * @name $interval#cancel
     *
     * @description
     * Cancels a task associated with the `promise`.
     *
     * @param {promise} promise A promise from calling the `$interval` function.
     * @returns {boolean} Returns `true` if the task was successfully cancelled.
     */
    $interval.cancel = function(promise) {
      if(!promise) return false;
      var fnIndex;

      angular.forEach(repeatFns, function(fn, index) {
        if (fn.id === promise.$$intervalId) fnIndex = index;
      });

      if (fnIndex !== undefined) {
        repeatFns[fnIndex].deferred.reject('canceled');
        repeatFns.splice(fnIndex, 1);
        return true;
      }

      return false;
    };

    /**
     * @ngdoc method
     * @name $interval#flush
     * @description
     *
     * Runs interval tasks scheduled to be run in the next `millis` milliseconds.
     *
     * @param {number=} millis maximum timeout amount to flush up until.
     *
     * @return {number} The amount of time moved forward.
     */
    $interval.flush = function(millis) {
      now += millis;
      while (repeatFns.length && repeatFns[0].nextTime <= now) {
        var task = repeatFns[0];
        task.fn();
        task.nextTime += task.delay;
        repeatFns.sort(function(a,b){ return a.nextTime - b.nextTime;});
      }
      return millis;
    };

    return $interval;
  }];
};


/* jshint -W101 */
/* The R_ISO8061_STR regex is never going to fit into the 100 char limit!
 * This directive should go inside the anonymous function but a bug in JSHint means that it would
 * not be enacted early enough to prevent the warning.
 */
var R_ISO8061_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?:\:?(\d\d)(?:\:?(\d\d)(?:\.(\d{3}))?)?)?(Z|([+-])(\d\d):?(\d\d)))?$/;

function jsonStringToDate(string) {
  var match;
  if (match = string.match(R_ISO8061_STR)) {
    var date = new Date(0),
        tzHour = 0,
        tzMin  = 0;
    if (match[9]) {
      tzHour = int(match[9] + match[10]);
      tzMin = int(match[9] + match[11]);
    }
    date.setUTCFullYear(int(match[1]), int(match[2]) - 1, int(match[3]));
    date.setUTCHours(int(match[4]||0) - tzHour,
                     int(match[5]||0) - tzMin,
                     int(match[6]||0),
                     int(match[7]||0));
    return date;
  }
  return string;
}

function int(str) {
  return parseInt(str, 10);
}

function padNumber(num, digits, trim) {
  var neg = '';
  if (num < 0) {
    neg =  '-';
    num = -num;
  }
  num = '' + num;
  while(num.length < digits) num = '0' + num;
  if (trim)
    num = num.substr(num.length - digits);
  return neg + num;
}


/**
 * @ngdoc type
 * @name angular.mock.TzDate
 * @description
 *
 * *NOTE*: this is not an injectable instance, just a globally available mock class of `Date`.
 *
 * Mock of the Date type which has its timezone specified via constructor arg.
 *
 * The main purpose is to create Date-like instances with timezone fixed to the specified timezone
 * offset, so that we can test code that depends on local timezone settings without dependency on
 * the time zone settings of the machine where the code is running.
 *
 * @param {number} offset Offset of the *desired* timezone in hours (fractions will be honored)
 * @param {(number|string)} timestamp Timestamp representing the desired time in *UTC*
 *
 * @example
 * !!!! WARNING !!!!!
 * This is not a complete Date object so only methods that were implemented can be called safely.
 * To make matters worse, TzDate instances inherit stuff from Date via a prototype.
 *
 * We do our best to intercept calls to "unimplemented" methods, but since the list of methods is
 * incomplete we might be missing some non-standard methods. This can result in errors like:
 * "Date.prototype.foo called on incompatible Object".
 *
 * ```js
 * var newYearInBratislava = new TzDate(-1, '2009-12-31T23:00:00Z');
 * newYearInBratislava.getTimezoneOffset() => -60;
 * newYearInBratislava.getFullYear() => 2010;
 * newYearInBratislava.getMonth() => 0;
 * newYearInBratislava.getDate() => 1;
 * newYearInBratislava.getHours() => 0;
 * newYearInBratislava.getMinutes() => 0;
 * newYearInBratislava.getSeconds() => 0;
 * ```
 *
 */
angular.mock.TzDate = function (offset, timestamp) {
  var self = new Date(0);
  if (angular.isString(timestamp)) {
    var tsStr = timestamp;

    self.origDate = jsonStringToDate(timestamp);

    timestamp = self.origDate.getTime();
    if (isNaN(timestamp))
      throw {
        name: "Illegal Argument",
        message: "Arg '" + tsStr + "' passed into TzDate constructor is not a valid date string"
      };
  } else {
    self.origDate = new Date(timestamp);
  }

  var localOffset = new Date(timestamp).getTimezoneOffset();
  self.offsetDiff = localOffset*60*1000 - offset*1000*60*60;
  self.date = new Date(timestamp + self.offsetDiff);

  self.getTime = function() {
    return self.date.getTime() - self.offsetDiff;
  };

  self.toLocaleDateString = function() {
    return self.date.toLocaleDateString();
  };

  self.getFullYear = function() {
    return self.date.getFullYear();
  };

  self.getMonth = function() {
    return self.date.getMonth();
  };

  self.getDate = function() {
    return self.date.getDate();
  };

  self.getHours = function() {
    return self.date.getHours();
  };

  self.getMinutes = function() {
    return self.date.getMinutes();
  };

  self.getSeconds = function() {
    return self.date.getSeconds();
  };

  self.getMilliseconds = function() {
    return self.date.getMilliseconds();
  };

  self.getTimezoneOffset = function() {
    return offset * 60;
  };

  self.getUTCFullYear = function() {
    return self.origDate.getUTCFullYear();
  };

  self.getUTCMonth = function() {
    return self.origDate.getUTCMonth();
  };

  self.getUTCDate = function() {
    return self.origDate.getUTCDate();
  };

  self.getUTCHours = function() {
    return self.origDate.getUTCHours();
  };

  self.getUTCMinutes = function() {
    return self.origDate.getUTCMinutes();
  };

  self.getUTCSeconds = function() {
    return self.origDate.getUTCSeconds();
  };

  self.getUTCMilliseconds = function() {
    return self.origDate.getUTCMilliseconds();
  };

  self.getDay = function() {
    return self.date.getDay();
  };

  // provide this method only on browsers that already have it
  if (self.toISOString) {
    self.toISOString = function() {
      return padNumber(self.origDate.getUTCFullYear(), 4) + '-' +
            padNumber(self.origDate.getUTCMonth() + 1, 2) + '-' +
            padNumber(self.origDate.getUTCDate(), 2) + 'T' +
            padNumber(self.origDate.getUTCHours(), 2) + ':' +
            padNumber(self.origDate.getUTCMinutes(), 2) + ':' +
            padNumber(self.origDate.getUTCSeconds(), 2) + '.' +
            padNumber(self.origDate.getUTCMilliseconds(), 3) + 'Z';
    };
  }

  //hide all methods not implemented in this mock that the Date prototype exposes
  var unimplementedMethods = ['getUTCDay',
      'getYear', 'setDate', 'setFullYear', 'setHours', 'setMilliseconds',
      'setMinutes', 'setMonth', 'setSeconds', 'setTime', 'setUTCDate', 'setUTCFullYear',
      'setUTCHours', 'setUTCMilliseconds', 'setUTCMinutes', 'setUTCMonth', 'setUTCSeconds',
      'setYear', 'toDateString', 'toGMTString', 'toJSON', 'toLocaleFormat', 'toLocaleString',
      'toLocaleTimeString', 'toSource', 'toString', 'toTimeString', 'toUTCString', 'valueOf'];

  angular.forEach(unimplementedMethods, function(methodName) {
    self[methodName] = function() {
      throw new Error("Method '" + methodName + "' is not implemented in the TzDate mock");
    };
  });

  return self;
};

//make "tzDateInstance instanceof Date" return true
angular.mock.TzDate.prototype = Date.prototype;
/* jshint +W101 */

angular.mock.animate = angular.module('ngAnimateMock', ['ng'])

  .config(['$provide', function($provide) {

    var reflowQueue = [];
    $provide.value('$$animateReflow', function(fn) {
      var index = reflowQueue.length;
      reflowQueue.push(fn);
      return function cancel() {
        reflowQueue.splice(index, 1);
      };
    });

    $provide.decorator('$animate', function($delegate, $$asyncCallback) {
      var animate = {
        queue : [],
        enabled : $delegate.enabled,
        triggerCallbacks : function() {
          $$asyncCallback.flush();
        },
        triggerReflow : function() {
          angular.forEach(reflowQueue, function(fn) {
            fn();
          });
          reflowQueue = [];
        }
      };

      angular.forEach(
        ['enter','leave','move','addClass','removeClass','setClass'], function(method) {
        animate[method] = function() {
          animate.queue.push({
            event : method,
            element : arguments[0],
            args : arguments
          });
          $delegate[method].apply($delegate, arguments);
        };
      });

      return animate;
    });

  }]);


/**
 * @ngdoc function
 * @name angular.mock.dump
 * @description
 *
 * *NOTE*: this is not an injectable instance, just a globally available function.
 *
 * Method for serializing common angular objects (scope, elements, etc..) into strings, useful for
 * debugging.
 *
 * This method is also available on window, where it can be used to display objects on debug
 * console.
 *
 * @param {*} object - any object to turn into string.
 * @return {string} a serialized string of the argument
 */
angular.mock.dump = function(object) {
  return serialize(object);

  function serialize(object) {
    var out;

    if (angular.isElement(object)) {
      object = angular.element(object);
      out = angular.element('<div></div>');
      angular.forEach(object, function(element) {
        out.append(angular.element(element).clone());
      });
      out = out.html();
    } else if (angular.isArray(object)) {
      out = [];
      angular.forEach(object, function(o) {
        out.push(serialize(o));
      });
      out = '[ ' + out.join(', ') + ' ]';
    } else if (angular.isObject(object)) {
      if (angular.isFunction(object.$eval) && angular.isFunction(object.$apply)) {
        out = serializeScope(object);
      } else if (object instanceof Error) {
        out = object.stack || ('' + object.name + ': ' + object.message);
      } else {
        // TODO(i): this prevents methods being logged,
        // we should have a better way to serialize objects
        out = angular.toJson(object, true);
      }
    } else {
      out = String(object);
    }

    return out;
  }

  function serializeScope(scope, offset) {
    offset = offset ||  '  ';
    var log = [offset + 'Scope(' + scope.$id + '): {'];
    for ( var key in scope ) {
      if (Object.prototype.hasOwnProperty.call(scope, key) && !key.match(/^(\$|this)/)) {
        log.push('  ' + key + ': ' + angular.toJson(scope[key]));
      }
    }
    var child = scope.$$childHead;
    while(child) {
      log.push(serializeScope(child, offset + '  '));
      child = child.$$nextSibling;
    }
    log.push('}');
    return log.join('\n' + offset);
  }
};

/**
 * @ngdoc service
 * @name $httpBackend
 * @description
 * Fake HTTP backend implementation suitable for unit testing applications that use the
 * {@link ng.$http $http service}.
 *
 * *Note*: For fake HTTP backend implementation suitable for end-to-end testing or backend-less
 * development please see {@link ngMockE2E.$httpBackend e2e $httpBackend mock}.
 *
 * During unit testing, we want our unit tests to run quickly and have no external dependencies so
 * we donâ€™t want to send [XHR](https://developer.mozilla.org/en/xmlhttprequest) or
 * [JSONP](http://en.wikipedia.org/wiki/JSONP) requests to a real server. All we really need is
 * to verify whether a certain request has been sent or not, or alternatively just let the
 * application make requests, respond with pre-trained responses and assert that the end result is
 * what we expect it to be.
 *
 * This mock implementation can be used to respond with static or dynamic responses via the
 * `expect` and `when` apis and their shortcuts (`expectGET`, `whenPOST`, etc).
 *
 * When an Angular application needs some data from a server, it calls the $http service, which
 * sends the request to a real server using $httpBackend service. With dependency injection, it is
 * easy to inject $httpBackend mock (which has the same API as $httpBackend) and use it to verify
 * the requests and respond with some testing data without sending a request to a real server.
 *
 * There are two ways to specify what test data should be returned as http responses by the mock
 * backend when the code under test makes http requests:
 *
 * - `$httpBackend.expect` - specifies a request expectation
 * - `$httpBackend.when` - specifies a backend definition
 *
 *
 * # Request Expectations vs Backend Definitions
 *
 * Request expectations provide a way to make assertions about requests made by the application and
 * to define responses for those requests. The test will fail if the expected requests are not made
 * or they are made in the wrong order.
 *
 * Backend definitions allow you to define a fake backend for your application which doesn't assert
 * if a particular request was made or not, it just returns a trained response if a request is made.
 * The test will pass whether or not the request gets made during testing.
 *
 *
 * <table class="table">
 *   <tr><th width="220px"></th><th>Request expectations</th><th>Backend definitions</th></tr>
 *   <tr>
 *     <th>Syntax</th>
 *     <td>.expect(...).respond(...)</td>
 *     <td>.when(...).respond(...)</td>
 *   </tr>
 *   <tr>
 *     <th>Typical usage</th>
 *     <td>strict unit tests</td>
 *     <td>loose (black-box) unit testing</td>
 *   </tr>
 *   <tr>
 *     <th>Fulfills multiple requests</th>
 *     <td>NO</td>
 *     <td>YES</td>
 *   </tr>
 *   <tr>
 *     <th>Order of requests matters</th>
 *     <td>YES</td>
 *     <td>NO</td>
 *   </tr>
 *   <tr>
 *     <th>Request required</th>
 *     <td>YES</td>
 *     <td>NO</td>
 *   </tr>
 *   <tr>
 *     <th>Response required</th>
 *     <td>optional (see below)</td>
 *     <td>YES</td>
 *   </tr>
 * </table>
 *
 * In cases where both backend definitions and request expectations are specified during unit
 * testing, the request expectations are evaluated first.
 *
 * If a request expectation has no response specified, the algorithm will search your backend
 * definitions for an appropriate response.
 *
 * If a request didn't match any expectation or if the expectation doesn't have the response
 * defined, the backend definitions are evaluated in sequential order to see if any of them match
 * the request. The response from the first matched definition is returned.
 *
 *
 * # Flushing HTTP requests
 *
 * The $httpBackend used in production always responds to requests asynchronously. If we preserved
 * this behavior in unit testing, we'd have to create async unit tests, which are hard to write,
 * to follow and to maintain. But neither can the testing mock respond synchronously; that would
 * change the execution of the code under test. For this reason, the mock $httpBackend has a
 * `flush()` method, which allows the test to explicitly flush pending requests. This preserves
 * the async api of the backend, while allowing the test to execute synchronously.
 *
 *
 * # Unit testing with mock $httpBackend
 * The following code shows how to setup and use the mock backend when unit testing a controller.
 * First we create the controller under test:
 *
  ```js
  // The controller code
  function MyController($scope, $http) {
    var authToken;

    $http.get('/auth.py').success(function(data, status, headers) {
      authToken = headers('A-Token');
      $scope.user = data;
    });

    $scope.saveMessage = function(message) {
      var headers = { 'Authorization': authToken };
      $scope.status = 'Saving...';

      $http.post('/add-msg.py', message, { headers: headers } ).success(function(response) {
        $scope.status = '';
      }).error(function() {
        $scope.status = 'ERROR!';
      });
    };
  }
  ```
 *
 * Now we setup the mock backend and create the test specs:
 *
  ```js
    // testing controller
    describe('MyController', function() {
       var $httpBackend, $rootScope, createController;

       beforeEach(inject(function($injector) {
         // Set up the mock http service responses
         $httpBackend = $injector.get('$httpBackend');
         // backend definition common for all tests
         $httpBackend.when('GET', '/auth.py').respond({userId: 'userX'}, {'A-Token': 'xxx'});

         // Get hold of a scope (i.e. the root scope)
         $rootScope = $injector.get('$rootScope');
         // The $controller service is used to create instances of controllers
         var $controller = $injector.get('$controller');

         createController = function() {
           return $controller('MyController', {'$scope' : $rootScope });
         };
       }));


       afterEach(function() {
         $httpBackend.verifyNoOutstandingExpectation();
         $httpBackend.verifyNoOutstandingRequest();
       });


       it('should fetch authentication token', function() {
         $httpBackend.expectGET('/auth.py');
         var controller = createController();
         $httpBackend.flush();
       });


       it('should send msg to server', function() {
         var controller = createController();
         $httpBackend.flush();

         // now you donâ€™t care about the authentication, but
         // the controller will still send the request and
         // $httpBackend will respond without you having to
         // specify the expectation and response for this request

         $httpBackend.expectPOST('/add-msg.py', 'message content').respond(201, '');
         $rootScope.saveMessage('message content');
         expect($rootScope.status).toBe('Saving...');
         $httpBackend.flush();
         expect($rootScope.status).toBe('');
       });


       it('should send auth header', function() {
         var controller = createController();
         $httpBackend.flush();

         $httpBackend.expectPOST('/add-msg.py', undefined, function(headers) {
           // check if the header was send, if it wasn't the expectation won't
           // match the request and the test will fail
           return headers['Authorization'] == 'xxx';
         }).respond(201, '');

         $rootScope.saveMessage('whatever');
         $httpBackend.flush();
       });
    });
   ```
 */
angular.mock.$HttpBackendProvider = function() {
  this.$get = ['$rootScope', createHttpBackendMock];
};

/**
 * General factory function for $httpBackend mock.
 * Returns instance for unit testing (when no arguments specified):
 *   - passing through is disabled
 *   - auto flushing is disabled
 *
 * Returns instance for e2e testing (when `$delegate` and `$browser` specified):
 *   - passing through (delegating request to real backend) is enabled
 *   - auto flushing is enabled
 *
 * @param {Object=} $delegate Real $httpBackend instance (allow passing through if specified)
 * @param {Object=} $browser Auto-flushing enabled if specified
 * @return {Object} Instance of $httpBackend mock
 */
function createHttpBackendMock($rootScope, $delegate, $browser) {
  var definitions = [],
      expectations = [],
      responses = [],
      responsesPush = angular.bind(responses, responses.push),
      copy = angular.copy;

  function createResponse(status, data, headers, statusText) {
    if (angular.isFunction(status)) return status;

    return function() {
      return angular.isNumber(status)
          ? [status, data, headers, statusText]
          : [200, status, data];
    };
  }

  // TODO(vojta): change params to: method, url, data, headers, callback
  function $httpBackend(method, url, data, callback, headers, timeout, withCredentials) {
    var xhr = new MockXhr(),
        expectation = expectations[0],
        wasExpected = false;

    function prettyPrint(data) {
      return (angular.isString(data) || angular.isFunction(data) || data instanceof RegExp)
          ? data
          : angular.toJson(data);
    }

    function wrapResponse(wrapped) {
      if (!$browser && timeout && timeout.then) timeout.then(handleTimeout);

      return handleResponse;

      function handleResponse() {
        var response = wrapped.response(method, url, data, headers);
        xhr.$$respHeaders = response[2];
        callback(copy(response[0]), copy(response[1]), xhr.getAllResponseHeaders(),
                 copy(response[3] || ''));
      }

      function handleTimeout() {
        for (var i = 0, ii = responses.length; i < ii; i++) {
          if (responses[i] === handleResponse) {
            responses.splice(i, 1);
            callback(-1, undefined, '');
            break;
          }
        }
      }
    }

    if (expectation && expectation.match(method, url)) {
      if (!expectation.matchData(data))
        throw new Error('Expected ' + expectation + ' with different data\n' +
            'EXPECTED: ' + prettyPrint(expectation.data) + '\nGOT:      ' + data);

      if (!expectation.matchHeaders(headers))
        throw new Error('Expected ' + expectation + ' with different headers\n' +
                        'EXPECTED: ' + prettyPrint(expectation.headers) + '\nGOT:      ' +
                        prettyPrint(headers));

      expectations.shift();

      if (expectation.response) {
        responses.push(wrapResponse(expectation));
        return;
      }
      wasExpected = true;
    }

    var i = -1, definition;
    while ((definition = definitions[++i])) {
      if (definition.match(method, url, data, headers || {})) {
        if (definition.response) {
          // if $browser specified, we do auto flush all requests
          ($browser ? $browser.defer : responsesPush)(wrapResponse(definition));
        } else if (definition.passThrough) {
          $delegate(method, url, data, callback, headers, timeout, withCredentials);
        } else throw new Error('No response defined !');
        return;
      }
    }
    throw wasExpected ?
        new Error('No response defined !') :
        new Error('Unexpected request: ' + method + ' ' + url + '\n' +
                  (expectation ? 'Expected ' + expectation : 'No more request expected'));
  }

  /**
   * @ngdoc method
   * @name $httpBackend#when
   * @description
   * Creates a new backend definition.
   *
   * @param {string} method HTTP method.
   * @param {string|RegExp} url HTTP url.
   * @param {(string|RegExp|function(string))=} data HTTP request body or function that receives
   *   data string and returns true if the data is as expected.
   * @param {(Object|function(Object))=} headers HTTP headers or function that receives http header
   *   object and returns true if the headers match the current definition.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   *   request is handled.
   *
   *  - respond â€“
   *      `{function([status,] data[, headers, statusText])
   *      | function(function(method, url, data, headers)}`
   *    â€“ The respond method takes a set of static data to be returned or a function that can
   *    return an array containing response status (number), response data (string), response
   *    headers (Object), and the text for the status (string).
   */
  $httpBackend.when = function(method, url, data, headers) {
    var definition = new MockHttpExpectation(method, url, data, headers),
        chain = {
          respond: function(status, data, headers, statusText) {
            definition.response = createResponse(status, data, headers, statusText);
          }
        };

    if ($browser) {
      chain.passThrough = function() {
        definition.passThrough = true;
      };
    }

    definitions.push(definition);
    return chain;
  };

  /**
   * @ngdoc method
   * @name $httpBackend#whenGET
   * @description
   * Creates a new backend definition for GET requests. For more info see `when()`.
   *
   * @param {string|RegExp} url HTTP url.
   * @param {(Object|function(Object))=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   * request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#whenHEAD
   * @description
   * Creates a new backend definition for HEAD requests. For more info see `when()`.
   *
   * @param {string|RegExp} url HTTP url.
   * @param {(Object|function(Object))=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   * request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#whenDELETE
   * @description
   * Creates a new backend definition for DELETE requests. For more info see `when()`.
   *
   * @param {string|RegExp} url HTTP url.
   * @param {(Object|function(Object))=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   * request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#whenPOST
   * @description
   * Creates a new backend definition for POST requests. For more info see `when()`.
   *
   * @param {string|RegExp} url HTTP url.
   * @param {(string|RegExp|function(string))=} data HTTP request body or function that receives
   *   data string and returns true if the data is as expected.
   * @param {(Object|function(Object))=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   * request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#whenPUT
   * @description
   * Creates a new backend definition for PUT requests.  For more info see `when()`.
   *
   * @param {string|RegExp} url HTTP url.
   * @param {(string|RegExp|function(string))=} data HTTP request body or function that receives
   *   data string and returns true if the data is as expected.
   * @param {(Object|function(Object))=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   * request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#whenJSONP
   * @description
   * Creates a new backend definition for JSONP requests. For more info see `when()`.
   *
   * @param {string|RegExp} url HTTP url.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   * request is handled.
   */
  createShortMethods('when');


  /**
   * @ngdoc method
   * @name $httpBackend#expect
   * @description
   * Creates a new request expectation.
   *
   * @param {string} method HTTP method.
   * @param {string|RegExp} url HTTP url.
   * @param {(string|RegExp|function(string)|Object)=} data HTTP request body or function that
   *  receives data string and returns true if the data is as expected, or Object if request body
   *  is in JSON format.
   * @param {(Object|function(Object))=} headers HTTP headers or function that receives http header
   *   object and returns true if the headers match the current expectation.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   *  request is handled.
   *
   *  - respond â€“
   *    `{function([status,] data[, headers, statusText])
   *    | function(function(method, url, data, headers)}`
   *    â€“ The respond method takes a set of static data to be returned or a function that can
   *    return an array containing response status (number), response data (string), response
   *    headers (Object), and the text for the status (string).
   */
  $httpBackend.expect = function(method, url, data, headers) {
    var expectation = new MockHttpExpectation(method, url, data, headers);
    expectations.push(expectation);
    return {
      respond: function (status, data, headers, statusText) {
        expectation.response = createResponse(status, data, headers, statusText);
      }
    };
  };


  /**
   * @ngdoc method
   * @name $httpBackend#expectGET
   * @description
   * Creates a new request expectation for GET requests. For more info see `expect()`.
   *
   * @param {string|RegExp} url HTTP url.
   * @param {Object=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   * request is handled. See #expect for more info.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#expectHEAD
   * @description
   * Creates a new request expectation for HEAD requests. For more info see `expect()`.
   *
   * @param {string|RegExp} url HTTP url.
   * @param {Object=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   *   request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#expectDELETE
   * @description
   * Creates a new request expectation for DELETE requests. For more info see `expect()`.
   *
   * @param {string|RegExp} url HTTP url.
   * @param {Object=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   *   request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#expectPOST
   * @description
   * Creates a new request expectation for POST requests. For more info see `expect()`.
   *
   * @param {string|RegExp} url HTTP url.
   * @param {(string|RegExp|function(string)|Object)=} data HTTP request body or function that
   *  receives data string and returns true if the data is as expected, or Object if request body
   *  is in JSON format.
   * @param {Object=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   *   request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#expectPUT
   * @description
   * Creates a new request expectation for PUT requests. For more info see `expect()`.
   *
   * @param {string|RegExp} url HTTP url.
   * @param {(string|RegExp|function(string)|Object)=} data HTTP request body or function that
   *  receives data string and returns true if the data is as expected, or Object if request body
   *  is in JSON format.
   * @param {Object=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   *   request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#expectPATCH
   * @description
   * Creates a new request expectation for PATCH requests. For more info see `expect()`.
   *
   * @param {string|RegExp} url HTTP url.
   * @param {(string|RegExp|function(string)|Object)=} data HTTP request body or function that
   *  receives data string and returns true if the data is as expected, or Object if request body
   *  is in JSON format.
   * @param {Object=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   *   request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#expectJSONP
   * @description
   * Creates a new request expectation for JSONP requests. For more info see `expect()`.
   *
   * @param {string|RegExp} url HTTP url.
   * @returns {requestHandler} Returns an object with `respond` method that control how a matched
   *   request is handled.
   */
  createShortMethods('expect');


  /**
   * @ngdoc method
   * @name $httpBackend#flush
   * @description
   * Flushes all pending requests using the trained responses.
   *
   * @param {number=} count Number of responses to flush (in the order they arrived). If undefined,
   *   all pending requests will be flushed. If there are no pending requests when the flush method
   *   is called an exception is thrown (as this typically a sign of programming error).
   */
  $httpBackend.flush = function(count) {
    $rootScope.$digest();
    if (!responses.length) throw new Error('No pending request to flush !');

    if (angular.isDefined(count)) {
      while (count--) {
        if (!responses.length) throw new Error('No more pending request to flush !');
        responses.shift()();
      }
    } else {
      while (responses.length) {
        responses.shift()();
      }
    }
    $httpBackend.verifyNoOutstandingExpectation();
  };


  /**
   * @ngdoc method
   * @name $httpBackend#verifyNoOutstandingExpectation
   * @description
   * Verifies that all of the requests defined via the `expect` api were made. If any of the
   * requests were not made, verifyNoOutstandingExpectation throws an exception.
   *
   * Typically, you would call this method following each test case that asserts requests using an
   * "afterEach" clause.
   *
   * ```js
   *   afterEach($httpBackend.verifyNoOutstandingExpectation);
   * ```
   */
  $httpBackend.verifyNoOutstandingExpectation = function() {
    $rootScope.$digest();
    if (expectations.length) {
      throw new Error('Unsatisfied requests: ' + expectations.join(', '));
    }
  };


  /**
   * @ngdoc method
   * @name $httpBackend#verifyNoOutstandingRequest
   * @description
   * Verifies that there are no outstanding requests that need to be flushed.
   *
   * Typically, you would call this method following each test case that asserts requests using an
   * "afterEach" clause.
   *
   * ```js
   *   afterEach($httpBackend.verifyNoOutstandingRequest);
   * ```
   */
  $httpBackend.verifyNoOutstandingRequest = function() {
    if (responses.length) {
      throw new Error('Unflushed requests: ' + responses.length);
    }
  };


  /**
   * @ngdoc method
   * @name $httpBackend#resetExpectations
   * @description
   * Resets all request expectations, but preserves all backend definitions. Typically, you would
   * call resetExpectations during a multiple-phase test when you want to reuse the same instance of
   * $httpBackend mock.
   */
  $httpBackend.resetExpectations = function() {
    expectations.length = 0;
    responses.length = 0;
  };

  return $httpBackend;


  function createShortMethods(prefix) {
    angular.forEach(['GET', 'DELETE', 'JSONP'], function(method) {
     $httpBackend[prefix + method] = function(url, headers) {
       return $httpBackend[prefix](method, url, undefined, headers);
     };
    });

    angular.forEach(['PUT', 'POST', 'PATCH'], function(method) {
      $httpBackend[prefix + method] = function(url, data, headers) {
        return $httpBackend[prefix](method, url, data, headers);
      };
    });
  }
}

function MockHttpExpectation(method, url, data, headers) {

  this.data = data;
  this.headers = headers;

  this.match = function(m, u, d, h) {
    if (method != m) return false;
    if (!this.matchUrl(u)) return false;
    if (angular.isDefined(d) && !this.matchData(d)) return false;
    if (angular.isDefined(h) && !this.matchHeaders(h)) return false;
    return true;
  };

  this.matchUrl = function(u) {
    if (!url) return true;
    if (angular.isFunction(url.test)) return url.test(u);
    return url == u;
  };

  this.matchHeaders = function(h) {
    if (angular.isUndefined(headers)) return true;
    if (angular.isFunction(headers)) return headers(h);
    return angular.equals(headers, h);
  };

  this.matchData = function(d) {
    if (angular.isUndefined(data)) return true;
    if (data && angular.isFunction(data.test)) return data.test(d);
    if (data && angular.isFunction(data)) return data(d);
    if (data && !angular.isString(data)) return angular.equals(data, angular.fromJson(d));
    return data == d;
  };

  this.toString = function() {
    return method + ' ' + url;
  };
}

function createMockXhr() {
  return new MockXhr();
}

function MockXhr() {

  // hack for testing $http, $httpBackend
  MockXhr.$$lastInstance = this;

  this.open = function(method, url, async) {
    this.$$method = method;
    this.$$url = url;
    this.$$async = async;
    this.$$reqHeaders = {};
    this.$$respHeaders = {};
  };

  this.send = function(data) {
    this.$$data = data;
  };

  this.setRequestHeader = function(key, value) {
    this.$$reqHeaders[key] = value;
  };

  this.getResponseHeader = function(name) {
    // the lookup must be case insensitive,
    // that's why we try two quick lookups first and full scan last
    var header = this.$$respHeaders[name];
    if (header) return header;

    name = angular.lowercase(name);
    header = this.$$respHeaders[name];
    if (header) return header;

    header = undefined;
    angular.forEach(this.$$respHeaders, function(headerVal, headerName) {
      if (!header && angular.lowercase(headerName) == name) header = headerVal;
    });
    return header;
  };

  this.getAllResponseHeaders = function() {
    var lines = [];

    angular.forEach(this.$$respHeaders, function(value, key) {
      lines.push(key + ': ' + value);
    });
    return lines.join('\n');
  };

  this.abort = angular.noop;
}


/**
 * @ngdoc service
 * @name $timeout
 * @description
 *
 * This service is just a simple decorator for {@link ng.$timeout $timeout} service
 * that adds a "flush" and "verifyNoPendingTasks" methods.
 */

angular.mock.$TimeoutDecorator = function($delegate, $browser) {

  /**
   * @ngdoc method
   * @name $timeout#flush
   * @description
   *
   * Flushes the queue of pending tasks.
   *
   * @param {number=} delay maximum timeout amount to flush up until
   */
  $delegate.flush = function(delay) {
    $browser.defer.flush(delay);
  };

  /**
   * @ngdoc method
   * @name $timeout#verifyNoPendingTasks
   * @description
   *
   * Verifies that there are no pending tasks that need to be flushed.
   */
  $delegate.verifyNoPendingTasks = function() {
    if ($browser.deferredFns.length) {
      throw new Error('Deferred tasks to flush (' + $browser.deferredFns.length + '): ' +
          formatPendingTasksAsString($browser.deferredFns));
    }
  };

  function formatPendingTasksAsString(tasks) {
    var result = [];
    angular.forEach(tasks, function(task) {
      result.push('{id: ' + task.id + ', ' + 'time: ' + task.time + '}');
    });

    return result.join(', ');
  }

  return $delegate;
};

angular.mock.$RAFDecorator = function($delegate) {
  var queue = [];
  var rafFn = function(fn) {
    var index = queue.length;
    queue.push(fn);
    return function() {
      queue.splice(index, 1);
    };
  };

  rafFn.supported = $delegate.supported;

  rafFn.flush = function() {
    if(queue.length === 0) {
      throw new Error('No rAF callbacks present');
    }

    var length = queue.length;
    for(var i=0;i<length;i++) {
      queue[i]();
    }

    queue = [];
  };

  return rafFn;
};

angular.mock.$AsyncCallbackDecorator = function($delegate) {
  var callbacks = [];
  var addFn = function(fn) {
    callbacks.push(fn);
  };
  addFn.flush = function() {
    angular.forEach(callbacks, function(fn) {
      fn();
    });
    callbacks = [];
  };
  return addFn;
};

/**
 *
 */
angular.mock.$RootElementProvider = function() {
  this.$get = function() {
    return angular.element('<div ng-app></div>');
  };
};

/**
 * @ngdoc module
 * @name ngMock
 * @packageName angular-mocks
 * @description
 *
 * # ngMock
 *
 * The `ngMock` module provides support to inject and mock Angular services into unit tests.
 * In addition, ngMock also extends various core ng services such that they can be
 * inspected and controlled in a synchronous manner within test code.
 *
 *
 * <div doc-module-components="ngMock"></div>
 *
 */
angular.module('ngMock', ['ng']).provider({
  $browser: angular.mock.$BrowserProvider,
  $exceptionHandler: angular.mock.$ExceptionHandlerProvider,
  $log: angular.mock.$LogProvider,
  $interval: angular.mock.$IntervalProvider,
  $httpBackend: angular.mock.$HttpBackendProvider,
  $rootElement: angular.mock.$RootElementProvider
}).config(['$provide', function($provide) {
  $provide.decorator('$timeout', angular.mock.$TimeoutDecorator);
  $provide.decorator('$$rAF', angular.mock.$RAFDecorator);
  $provide.decorator('$$asyncCallback', angular.mock.$AsyncCallbackDecorator);
}]);

/**
 * @ngdoc module
 * @name ngMockE2E
 * @module ngMockE2E
 * @packageName angular-mocks
 * @description
 *
 * The `ngMockE2E` is an angular module which contains mocks suitable for end-to-end testing.
 * Currently there is only one mock present in this module -
 * the {@link ngMockE2E.$httpBackend e2e $httpBackend} mock.
 */
angular.module('ngMockE2E', ['ng']).config(['$provide', function($provide) {
  $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
}]);

/**
 * @ngdoc service
 * @name $httpBackend
 * @module ngMockE2E
 * @description
 * Fake HTTP backend implementation suitable for end-to-end testing or backend-less development of
 * applications that use the {@link ng.$http $http service}.
 *
 * *Note*: For fake http backend implementation suitable for unit testing please see
 * {@link ngMock.$httpBackend unit-testing $httpBackend mock}.
 *
 * This implementation can be used to respond with static or dynamic responses via the `when` api
 * and its shortcuts (`whenGET`, `whenPOST`, etc) and optionally pass through requests to the
 * real $httpBackend for specific requests (e.g. to interact with certain remote apis or to fetch
 * templates from a webserver).
 *
 * As opposed to unit-testing, in an end-to-end testing scenario or in scenario when an application
 * is being developed with the real backend api replaced with a mock, it is often desirable for
 * certain category of requests to bypass the mock and issue a real http request (e.g. to fetch
 * templates or static files from the webserver). To configure the backend with this behavior
 * use the `passThrough` request handler of `when` instead of `respond`.
 *
 * Additionally, we don't want to manually have to flush mocked out requests like we do during unit
 * testing. For this reason the e2e $httpBackend flushes mocked out requests
 * automatically, closely simulating the behavior of the XMLHttpRequest object.
 *
 * To setup the application to run with this http backend, you have to create a module that depends
 * on the `ngMockE2E` and your application modules and defines the fake backend:
 *
 * ```js
 *   myAppDev = angular.module('myAppDev', ['myApp', 'ngMockE2E']);
 *   myAppDev.run(function($httpBackend) {
 *     phones = [{name: 'phone1'}, {name: 'phone2'}];
 *
 *     // returns the current list of phones
 *     $httpBackend.whenGET('/phones').respond(phones);
 *
 *     // adds a new phone to the phones array
 *     $httpBackend.whenPOST('/phones').respond(function(method, url, data) {
 *       var phone = angular.fromJson(data);
 *       phones.push(phone);
 *       return [200, phone, {}];
 *     });
 *     $httpBackend.whenGET(/^\/templates\//).passThrough();
 *     //...
 *   });
 * ```
 *
 * Afterwards, bootstrap your app with this new module.
 */

/**
 * @ngdoc method
 * @name $httpBackend#when
 * @module ngMockE2E
 * @description
 * Creates a new backend definition.
 *
 * @param {string} method HTTP method.
 * @param {string|RegExp} url HTTP url.
 * @param {(string|RegExp)=} data HTTP request body.
 * @param {(Object|function(Object))=} headers HTTP headers or function that receives http header
 *   object and returns true if the headers match the current definition.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled.
 *
 *  - respond â€“
 *    `{function([status,] data[, headers, statusText])
 *    | function(function(method, url, data, headers)}`
 *    â€“ The respond method takes a set of static data to be returned or a function that can return
 *    an array containing response status (number), response data (string), response headers
 *    (Object), and the text for the status (string).
 *  - passThrough â€“ `{function()}` â€“ Any request matching a backend definition with
 *    `passThrough` handler will be passed through to the real backend (an XHR request will be made
 *    to the server.)
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenGET
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for GET requests. For more info see `when()`.
 *
 * @param {string|RegExp} url HTTP url.
 * @param {(Object|function(Object))=} headers HTTP headers.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled.
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenHEAD
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for HEAD requests. For more info see `when()`.
 *
 * @param {string|RegExp} url HTTP url.
 * @param {(Object|function(Object))=} headers HTTP headers.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled.
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenDELETE
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for DELETE requests. For more info see `when()`.
 *
 * @param {string|RegExp} url HTTP url.
 * @param {(Object|function(Object))=} headers HTTP headers.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled.
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenPOST
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for POST requests. For more info see `when()`.
 *
 * @param {string|RegExp} url HTTP url.
 * @param {(string|RegExp)=} data HTTP request body.
 * @param {(Object|function(Object))=} headers HTTP headers.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled.
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenPUT
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for PUT requests.  For more info see `when()`.
 *
 * @param {string|RegExp} url HTTP url.
 * @param {(string|RegExp)=} data HTTP request body.
 * @param {(Object|function(Object))=} headers HTTP headers.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled.
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenPATCH
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for PATCH requests.  For more info see `when()`.
 *
 * @param {string|RegExp} url HTTP url.
 * @param {(string|RegExp)=} data HTTP request body.
 * @param {(Object|function(Object))=} headers HTTP headers.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled.
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenJSONP
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for JSONP requests. For more info see `when()`.
 *
 * @param {string|RegExp} url HTTP url.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled.
 */
angular.mock.e2e = {};
angular.mock.e2e.$httpBackendDecorator =
  ['$rootScope', '$delegate', '$browser', createHttpBackendMock];


angular.mock.clearDataCache = function() {
  var key,
      cache = angular.element.cache;

  for(key in cache) {
    if (Object.prototype.hasOwnProperty.call(cache,key)) {
      var handle = cache[key].handle;

      handle && angular.element(handle.elem).off();
      delete cache[key];
    }
  }
};


if(window.jasmine || window.mocha) {

  var currentSpec = null,
      isSpecRunning = function() {
        return !!currentSpec;
      };


  (window.beforeEach || window.setup)(function() {
    currentSpec = this;
  });

  (window.afterEach || window.teardown)(function() {
    var injector = currentSpec.$injector;

    angular.forEach(currentSpec.$modules, function(module) {
      if (module && module.$$hashKey) {
        module.$$hashKey = undefined;
      }
    });

    currentSpec.$injector = null;
    currentSpec.$modules = null;
    currentSpec = null;

    if (injector) {
      injector.get('$rootElement').off();
      injector.get('$browser').pollFns.length = 0;
    }

    angular.mock.clearDataCache();

    // clean up jquery's fragment cache
    angular.forEach(angular.element.fragments, function(val, key) {
      delete angular.element.fragments[key];
    });

    MockXhr.$$lastInstance = null;

    angular.forEach(angular.callbacks, function(val, key) {
      delete angular.callbacks[key];
    });
    angular.callbacks.counter = 0;
  });

  /**
   * @ngdoc function
   * @name angular.mock.module
   * @description
   *
   * *NOTE*: This function is also published on window for easy access.<br>
   *
   * This function registers a module configuration code. It collects the configuration information
   * which will be used when the injector is created by {@link angular.mock.inject inject}.
   *
   * See {@link angular.mock.inject inject} for usage example
   *
   * @param {...(string|Function|Object)} fns any number of modules which are represented as string
   *        aliases or as anonymous module initialization functions. The modules are used to
   *        configure the injector. The 'ng' and 'ngMock' modules are automatically loaded. If an
   *        object literal is passed they will be registered as values in the module, the key being
   *        the module name and the value being what is returned.
   */
  window.module = angular.mock.module = function() {
    var moduleFns = Array.prototype.slice.call(arguments, 0);
    return isSpecRunning() ? workFn() : workFn;
    /////////////////////
    function workFn() {
      if (currentSpec.$injector) {
        throw new Error('Injector already created, can not register a module!');
      } else {
        var modules = currentSpec.$modules || (currentSpec.$modules = []);
        angular.forEach(moduleFns, function(module) {
          if (angular.isObject(module) && !angular.isArray(module)) {
            modules.push(function($provide) {
              angular.forEach(module, function(value, key) {
                $provide.value(key, value);
              });
            });
          } else {
            modules.push(module);
          }
        });
      }
    }
  };

  /**
   * @ngdoc function
   * @name angular.mock.inject
   * @description
   *
   * *NOTE*: This function is also published on window for easy access.<br>
   *
   * The inject function wraps a function into an injectable function. The inject() creates new
   * instance of {@link auto.$injector $injector} per test, which is then used for
   * resolving references.
   *
   *
   * ## Resolving References (Underscore Wrapping)
   * Often, we would like to inject a reference once, in a `beforeEach()` block and reuse this
   * in multiple `it()` clauses. To be able to do this we must assign the reference to a variable
   * that is declared in the scope of the `describe()` block. Since we would, most likely, want
   * the variable to have the same name of the reference we have a problem, since the parameter
   * to the `inject()` function would hide the outer variable.
   *
   * To help with this, the injected parameters can, optionally, be enclosed with underscores.
   * These are ignored by the injector when the reference name is resolved.
   *
   * For example, the parameter `_myService_` would be resolved as the reference `myService`.
   * Since it is available in the function body as _myService_, we can then assign it to a variable
   * defined in an outer scope.
   *
   * ```
   * // Defined out reference variable outside
   * var myService;
   *
   * // Wrap the parameter in underscores
   * beforeEach( inject( function(_myService_){
   *   myService = _myService_;
   * }));
   *
   * // Use myService in a series of tests.
   * it('makes use of myService', function() {
   *   myService.doStuff();
   * });
   *
   * ```
   *
   * See also {@link angular.mock.module angular.mock.module}
   *
   * ## Example
   * Example of what a typical jasmine tests looks like with the inject method.
   * ```js
   *
   *   angular.module('myApplicationModule', [])
   *       .value('mode', 'app')
   *       .value('version', 'v1.0.1');
   *
   *
   *   describe('MyApp', function() {
   *
   *     // You need to load modules that you want to test,
   *     // it loads only the "ng" module by default.
   *     beforeEach(module('myApplicationModule'));
   *
   *
   *     // inject() is used to inject arguments of all given functions
   *     it('should provide a version', inject(function(mode, version) {
   *       expect(version).toEqual('v1.0.1');
   *       expect(mode).toEqual('app');
   *     }));
   *
   *
   *     // The inject and module method can also be used inside of the it or beforeEach
   *     it('should override a version and test the new version is injected', function() {
   *       // module() takes functions or strings (module aliases)
   *       module(function($provide) {
   *         $provide.value('version', 'overridden'); // override version here
   *       });
   *
   *       inject(function(version) {
   *         expect(version).toEqual('overridden');
   *       });
   *     });
   *   });
   *
   * ```
   *
   * @param {...Function} fns any number of functions which will be injected using the injector.
   */



  var ErrorAddingDeclarationLocationStack = function(e, errorForStack) {
    this.message = e.message;
    this.name = e.name;
    if (e.line) this.line = e.line;
    if (e.sourceId) this.sourceId = e.sourceId;
    if (e.stack && errorForStack)
      this.stack = e.stack + '\n' + errorForStack.stack;
    if (e.stackArray) this.stackArray = e.stackArray;
  };
  ErrorAddingDeclarationLocationStack.prototype.toString = Error.prototype.toString;

  window.inject = angular.mock.inject = function() {
    var blockFns = Array.prototype.slice.call(arguments, 0);
    var errorForStack = new Error('Declaration Location');
    return isSpecRunning() ? workFn.call(currentSpec) : workFn;
    /////////////////////
    function workFn() {
      var modules = currentSpec.$modules || [];

      modules.unshift('ngMock');
      modules.unshift('ng');
      var injector = currentSpec.$injector;
      if (!injector) {
        injector = currentSpec.$injector = angular.injector(modules);
      }
      for(var i = 0, ii = blockFns.length; i < ii; i++) {
        try {
          /* jshint -W040 *//* Jasmine explicitly provides a `this` object when calling functions */
          injector.invoke(blockFns[i] || angular.noop, this);
          /* jshint +W040 */
        } catch (e) {
          if (e.stack && errorForStack) {
            throw new ErrorAddingDeclarationLocationStack(e, errorForStack);
          }
          throw e;
        } finally {
          errorForStack = null;
        }
      }
    }
  };
}


})(window, window.angular);
},{}]},{},["./src/app.unit.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pY29sYXMvYmlyZC9hbmd1bGFyLWFwcC1hdXRvbWF0aW9uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9hcHAudW5pdC5qcyIsIi9ob21lL25pY29sYXMvYmlyZC9hbmd1bGFyLWFwcC1zZWVkL25vZGVfbW9kdWxlcy9hbmd1bGFyLW1vY2tzL2FuZ3VsYXItbW9ja3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJ2FuZ3VsYXItbW9ja3MnKTsgLy8gZXh0ZW5kIGFuZ3VsYXIgd2l0aCBhIG1vY2sgcHJvcGVydHlcblxuZGVzY3JpYmUoJ1VuaXQ6IFNlZWRDb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XG4gIGJlZm9yZUVhY2goYW5ndWxhci5tb2NrLm1vZHVsZSgnU2VlZEFwcCcpKTtcblxuICB2YXIgY3RybCwgc2NvcGU7XG4gIC8vIGluamVjdCB0aGUgJGNvbnRyb2xsZXIgYW5kICRyb290U2NvcGUgc2VydmljZXMgaW4gdGhlIGJlZm9yZUVhY2ggYmxvY2tcbiAgYmVmb3JlRWFjaChhbmd1bGFyLm1vY2suaW5qZWN0KGZ1bmN0aW9uKCRjb250cm9sbGVyLCAkcm9vdFNjb3BlKSB7XG4gICAgLy8gQ3JlYXRlIGEgbmV3IHNjb3BlIHRoYXQncyBhIGNoaWxkIG9mIHRoZSAkcm9vdFNjb3BlXG4gICAgc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcbiAgICAvLyBDcmVhdGUgdGhlIGNvbnRyb2xsZXJcbiAgICBjdHJsID0gJGNvbnRyb2xsZXIoJ1NlZWRDb250cm9sbGVyJywgeyAkc2NvcGU6IHNjb3BlIH0pO1xuICB9KSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgJHNjb3BlLmhpIHdoZW4gY2FsbGluZyBzYXlIaScsIGZ1bmN0aW9uKCkge1xuICAgIGV4cGVjdChzY29wZS5oaSkudG9CZVVuZGVmaW5lZCgpO1xuICAgIHNjb3BlLnNheUhpKCk7XG4gICAgZXhwZWN0KHNjb3BlLmhpKS50b0VxdWFsKCdIaSBKb2huJyk7XG4gIH0pO1xufSk7XG4iLCIvKipcbiAqIEBsaWNlbnNlIEFuZ3VsYXJKUyB2MS4yLjIyXG4gKiAoYykgMjAxMC0yMDE0IEdvb2dsZSwgSW5jLiBodHRwOi8vYW5ndWxhcmpzLm9yZ1xuICogTGljZW5zZTogTUlUXG4gKi9cbihmdW5jdGlvbih3aW5kb3csIGFuZ3VsYXIsIHVuZGVmaW5lZCkge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5nZG9jIG9iamVjdFxuICogQG5hbWUgYW5ndWxhci5tb2NrXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBOYW1lc3BhY2UgZnJvbSAnYW5ndWxhci1tb2Nrcy5qcycgd2hpY2ggY29udGFpbnMgdGVzdGluZyByZWxhdGVkIGNvZGUuXG4gKi9cbmFuZ3VsYXIubW9jayA9IHt9O1xuXG4vKipcbiAqICEgVGhpcyBpcyBhIHByaXZhdGUgdW5kb2N1bWVudGVkIHNlcnZpY2UgIVxuICpcbiAqIEBuYW1lICRicm93c2VyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGlzIHNlcnZpY2UgaXMgYSBtb2NrIGltcGxlbWVudGF0aW9uIG9mIHtAbGluayBuZy4kYnJvd3Nlcn0uIEl0IHByb3ZpZGVzIGZha2VcbiAqIGltcGxlbWVudGF0aW9uIGZvciBjb21tb25seSB1c2VkIGJyb3dzZXIgYXBpcyB0aGF0IGFyZSBoYXJkIHRvIHRlc3QsIGUuZy4gc2V0VGltZW91dCwgeGhyLFxuICogY29va2llcywgZXRjLi4uXG4gKlxuICogVGhlIGFwaSBvZiB0aGlzIHNlcnZpY2UgaXMgdGhlIHNhbWUgYXMgdGhhdCBvZiB0aGUgcmVhbCB7QGxpbmsgbmcuJGJyb3dzZXIgJGJyb3dzZXJ9LCBleGNlcHRcbiAqIHRoYXQgdGhlcmUgYXJlIHNldmVyYWwgaGVscGVyIG1ldGhvZHMgYXZhaWxhYmxlIHdoaWNoIGNhbiBiZSB1c2VkIGluIHRlc3RzLlxuICovXG5hbmd1bGFyLm1vY2suJEJyb3dzZXJQcm92aWRlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLiRnZXQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IGFuZ3VsYXIubW9jay4kQnJvd3NlcigpO1xuICB9O1xufTtcblxuYW5ndWxhci5tb2NrLiRCcm93c2VyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB0aGlzLmlzTW9jayA9IHRydWU7XG4gIHNlbGYuJCR1cmwgPSBcImh0dHA6Ly9zZXJ2ZXIvXCI7XG4gIHNlbGYuJCRsYXN0VXJsID0gc2VsZi4kJHVybDsgLy8gdXNlZCBieSB1cmwgcG9sbGluZyBmblxuICBzZWxmLnBvbGxGbnMgPSBbXTtcblxuICAvLyBUT0RPKHZvanRhKTogcmVtb3ZlIHRoaXMgdGVtcG9yYXJ5IGFwaVxuICBzZWxmLiQkY29tcGxldGVPdXRzdGFuZGluZ1JlcXVlc3QgPSBhbmd1bGFyLm5vb3A7XG4gIHNlbGYuJCRpbmNPdXRzdGFuZGluZ1JlcXVlc3RDb3VudCA9IGFuZ3VsYXIubm9vcDtcblxuXG4gIC8vIHJlZ2lzdGVyIHVybCBwb2xsaW5nIGZuXG5cbiAgc2VsZi5vblVybENoYW5nZSA9IGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgc2VsZi5wb2xsRm5zLnB1c2goXG4gICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHNlbGYuJCRsYXN0VXJsICE9IHNlbGYuJCR1cmwpIHtcbiAgICAgICAgICBzZWxmLiQkbGFzdFVybCA9IHNlbGYuJCR1cmw7XG4gICAgICAgICAgbGlzdGVuZXIoc2VsZi4kJHVybCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuXG4gICAgcmV0dXJuIGxpc3RlbmVyO1xuICB9O1xuXG4gIHNlbGYuY29va2llSGFzaCA9IHt9O1xuICBzZWxmLmxhc3RDb29raWVIYXNoID0ge307XG4gIHNlbGYuZGVmZXJyZWRGbnMgPSBbXTtcbiAgc2VsZi5kZWZlcnJlZE5leHRJZCA9IDA7XG5cbiAgc2VsZi5kZWZlciA9IGZ1bmN0aW9uKGZuLCBkZWxheSkge1xuICAgIGRlbGF5ID0gZGVsYXkgfHwgMDtcbiAgICBzZWxmLmRlZmVycmVkRm5zLnB1c2goe3RpbWU6KHNlbGYuZGVmZXIubm93ICsgZGVsYXkpLCBmbjpmbiwgaWQ6IHNlbGYuZGVmZXJyZWROZXh0SWR9KTtcbiAgICBzZWxmLmRlZmVycmVkRm5zLnNvcnQoZnVuY3Rpb24oYSxiKXsgcmV0dXJuIGEudGltZSAtIGIudGltZTt9KTtcbiAgICByZXR1cm4gc2VsZi5kZWZlcnJlZE5leHRJZCsrO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEBuYW1lICRicm93c2VyI2RlZmVyLm5vd1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3VycmVudCBtaWxsaXNlY29uZHMgbW9jayB0aW1lLlxuICAgKi9cbiAgc2VsZi5kZWZlci5ub3cgPSAwO1xuXG5cbiAgc2VsZi5kZWZlci5jYW5jZWwgPSBmdW5jdGlvbihkZWZlcklkKSB7XG4gICAgdmFyIGZuSW5kZXg7XG5cbiAgICBhbmd1bGFyLmZvckVhY2goc2VsZi5kZWZlcnJlZEZucywgZnVuY3Rpb24oZm4sIGluZGV4KSB7XG4gICAgICBpZiAoZm4uaWQgPT09IGRlZmVySWQpIGZuSW5kZXggPSBpbmRleDtcbiAgICB9KTtcblxuICAgIGlmIChmbkluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHNlbGYuZGVmZXJyZWRGbnMuc3BsaWNlKGZuSW5kZXgsIDEpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEBuYW1lICRicm93c2VyI2RlZmVyLmZsdXNoXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBGbHVzaGVzIGFsbCBwZW5kaW5nIHJlcXVlc3RzIGFuZCBleGVjdXRlcyB0aGUgZGVmZXIgY2FsbGJhY2tzLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZmx1c2guIFNlZSB7QGxpbmsgI2RlZmVyLm5vd31cbiAgICovXG4gIHNlbGYuZGVmZXIuZmx1c2ggPSBmdW5jdGlvbihkZWxheSkge1xuICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChkZWxheSkpIHtcbiAgICAgIHNlbGYuZGVmZXIubm93ICs9IGRlbGF5O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc2VsZi5kZWZlcnJlZEZucy5sZW5ndGgpIHtcbiAgICAgICAgc2VsZi5kZWZlci5ub3cgPSBzZWxmLmRlZmVycmVkRm5zW3NlbGYuZGVmZXJyZWRGbnMubGVuZ3RoLTFdLnRpbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGRlZmVycmVkIHRhc2tzIHRvIGJlIGZsdXNoZWQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aGlsZSAoc2VsZi5kZWZlcnJlZEZucy5sZW5ndGggJiYgc2VsZi5kZWZlcnJlZEZuc1swXS50aW1lIDw9IHNlbGYuZGVmZXIubm93KSB7XG4gICAgICBzZWxmLmRlZmVycmVkRm5zLnNoaWZ0KCkuZm4oKTtcbiAgICB9XG4gIH07XG5cbiAgc2VsZi4kJGJhc2VIcmVmID0gJyc7XG4gIHNlbGYuYmFzZUhyZWYgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kJGJhc2VIcmVmO1xuICB9O1xufTtcbmFuZ3VsYXIubW9jay4kQnJvd3Nlci5wcm90b3R5cGUgPSB7XG5cbi8qKlxuICAqIEBuYW1lICRicm93c2VyI3BvbGxcbiAgKlxuICAqIEBkZXNjcmlwdGlvblxuICAqIHJ1biBhbGwgZm5zIGluIHBvbGxGbnNcbiAgKi9cbiAgcG9sbDogZnVuY3Rpb24gcG9sbCgpIHtcbiAgICBhbmd1bGFyLmZvckVhY2godGhpcy5wb2xsRm5zLCBmdW5jdGlvbihwb2xsRm4pe1xuICAgICAgcG9sbEZuKCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgYWRkUG9sbEZuOiBmdW5jdGlvbihwb2xsRm4pIHtcbiAgICB0aGlzLnBvbGxGbnMucHVzaChwb2xsRm4pO1xuICAgIHJldHVybiBwb2xsRm47XG4gIH0sXG5cbiAgdXJsOiBmdW5jdGlvbih1cmwsIHJlcGxhY2UpIHtcbiAgICBpZiAodXJsKSB7XG4gICAgICB0aGlzLiQkdXJsID0gdXJsO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJCR1cmw7XG4gIH0sXG5cbiAgY29va2llczogIGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICBkZWxldGUgdGhpcy5jb29raWVIYXNoW25hbWVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcodmFsdWUpICYmICAgICAgIC8vc3RyaW5ncyBvbmx5XG4gICAgICAgICAgICB2YWx1ZS5sZW5ndGggPD0gNDA5NikgeyAgICAgICAgICAvL3N0cmljdCBjb29raWUgc3RvcmFnZSBsaW1pdHNcbiAgICAgICAgICB0aGlzLmNvb2tpZUhhc2hbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWFuZ3VsYXIuZXF1YWxzKHRoaXMuY29va2llSGFzaCwgdGhpcy5sYXN0Q29va2llSGFzaCkpIHtcbiAgICAgICAgdGhpcy5sYXN0Q29va2llSGFzaCA9IGFuZ3VsYXIuY29weSh0aGlzLmNvb2tpZUhhc2gpO1xuICAgICAgICB0aGlzLmNvb2tpZUhhc2ggPSBhbmd1bGFyLmNvcHkodGhpcy5jb29raWVIYXNoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmNvb2tpZUhhc2g7XG4gICAgfVxuICB9LFxuXG4gIG5vdGlmeVdoZW5Ob091dHN0YW5kaW5nUmVxdWVzdHM6IGZ1bmN0aW9uKGZuKSB7XG4gICAgZm4oKTtcbiAgfVxufTtcblxuXG4vKipcbiAqIEBuZ2RvYyBwcm92aWRlclxuICogQG5hbWUgJGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQ29uZmlndXJlcyB0aGUgbW9jayBpbXBsZW1lbnRhdGlvbiBvZiB7QGxpbmsgbmcuJGV4Y2VwdGlvbkhhbmRsZXJ9IHRvIHJldGhyb3cgb3IgdG8gbG9nIGVycm9yc1xuICogcGFzc2VkIGludG8gdGhlIGAkZXhjZXB0aW9uSGFuZGxlcmAuXG4gKi9cblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJGV4Y2VwdGlvbkhhbmRsZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIE1vY2sgaW1wbGVtZW50YXRpb24gb2Yge0BsaW5rIG5nLiRleGNlcHRpb25IYW5kbGVyfSB0aGF0IHJldGhyb3dzIG9yIGxvZ3MgZXJyb3JzIHBhc3NlZFxuICogaW50byBpdC4gU2VlIHtAbGluayBuZ01vY2suJGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlciAkZXhjZXB0aW9uSGFuZGxlclByb3ZpZGVyfSBmb3IgY29uZmlndXJhdGlvblxuICogaW5mb3JtYXRpb24uXG4gKlxuICpcbiAqIGBgYGpzXG4gKiAgIGRlc2NyaWJlKCckZXhjZXB0aW9uSGFuZGxlclByb3ZpZGVyJywgZnVuY3Rpb24oKSB7XG4gKlxuICogICAgIGl0KCdzaG91bGQgY2FwdHVyZSBsb2cgbWVzc2FnZXMgYW5kIGV4Y2VwdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAqXG4gKiAgICAgICBtb2R1bGUoZnVuY3Rpb24oJGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlcikge1xuICogICAgICAgICAkZXhjZXB0aW9uSGFuZGxlclByb3ZpZGVyLm1vZGUoJ2xvZycpO1xuICogICAgICAgfSk7XG4gKlxuICogICAgICAgaW5qZWN0KGZ1bmN0aW9uKCRsb2csICRleGNlcHRpb25IYW5kbGVyLCAkdGltZW91dCkge1xuICogICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHsgJGxvZy5sb2coMSk7IH0pO1xuICogICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHsgJGxvZy5sb2coMik7IHRocm93ICdiYW5hbmEgcGVlbCc7IH0pO1xuICogICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHsgJGxvZy5sb2coMyk7IH0pO1xuICogICAgICAgICBleHBlY3QoJGV4Y2VwdGlvbkhhbmRsZXIuZXJyb3JzKS50b0VxdWFsKFtdKTtcbiAqICAgICAgICAgZXhwZWN0KCRsb2cuYXNzZXJ0RW1wdHkoKSk7XG4gKiAgICAgICAgICR0aW1lb3V0LmZsdXNoKCk7XG4gKiAgICAgICAgIGV4cGVjdCgkZXhjZXB0aW9uSGFuZGxlci5lcnJvcnMpLnRvRXF1YWwoWydiYW5hbmEgcGVlbCddKTtcbiAqICAgICAgICAgZXhwZWN0KCRsb2cubG9nLmxvZ3MpLnRvRXF1YWwoW1sxXSwgWzJdLCBbM11dKTtcbiAqICAgICAgIH0pO1xuICogICAgIH0pO1xuICogICB9KTtcbiAqIGBgYFxuICovXG5cbmFuZ3VsYXIubW9jay4kRXhjZXB0aW9uSGFuZGxlclByb3ZpZGVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBoYW5kbGVyO1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRleGNlcHRpb25IYW5kbGVyUHJvdmlkZXIjbW9kZVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU2V0cyB0aGUgbG9nZ2luZyBtb2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZSBNb2RlIG9mIG9wZXJhdGlvbiwgZGVmYXVsdHMgdG8gYHJldGhyb3dgLlxuICAgKlxuICAgKiAgIC0gYHJldGhyb3dgOiBJZiBhbnkgZXJyb3JzIGFyZSBwYXNzZWQgaW50byB0aGUgaGFuZGxlciBpbiB0ZXN0cywgaXQgdHlwaWNhbGx5XG4gICAqICAgICAgICAgICAgICAgIG1lYW5zIHRoYXQgdGhlcmUgaXMgYSBidWcgaW4gdGhlIGFwcGxpY2F0aW9uIG9yIHRlc3QsIHNvIHRoaXMgbW9jayB3aWxsXG4gICAqICAgICAgICAgICAgICAgIG1ha2UgdGhlc2UgdGVzdHMgZmFpbC5cbiAgICogICAtIGBsb2dgOiBTb21ldGltZXMgaXQgaXMgZGVzaXJhYmxlIHRvIHRlc3QgdGhhdCBhbiBlcnJvciBpcyB0aHJvd24sIGZvciB0aGlzIGNhc2UgdGhlIGBsb2dgXG4gICAqICAgICAgICAgICAgbW9kZSBzdG9yZXMgYW4gYXJyYXkgb2YgZXJyb3JzIGluIGAkZXhjZXB0aW9uSGFuZGxlci5lcnJvcnNgLCB0byBhbGxvdyBsYXRlclxuICAgKiAgICAgICAgICAgIGFzc2VydGlvbiBvZiB0aGVtLiBTZWUge0BsaW5rIG5nTW9jay4kbG9nI2Fzc2VydEVtcHR5IGFzc2VydEVtcHR5KCl9IGFuZFxuICAgKiAgICAgICAgICAgIHtAbGluayBuZ01vY2suJGxvZyNyZXNldCByZXNldCgpfVxuICAgKi9cbiAgdGhpcy5tb2RlID0gZnVuY3Rpb24obW9kZSkge1xuICAgIHN3aXRjaChtb2RlKSB7XG4gICAgICBjYXNlICdyZXRocm93JzpcbiAgICAgICAgaGFuZGxlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xvZyc6XG4gICAgICAgIHZhciBlcnJvcnMgPSBbXTtcblxuICAgICAgICBoYW5kbGVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvcnMucHVzaChbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBoYW5kbGVyLmVycm9ycyA9IGVycm9ycztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG1vZGUgJ1wiICsgbW9kZSArIFwiJywgb25seSAnbG9nJy8ncmV0aHJvdycgbW9kZXMgYXJlIGFsbG93ZWQhXCIpO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLiRnZXQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gaGFuZGxlcjtcbiAgfTtcblxuICB0aGlzLm1vZGUoJ3JldGhyb3cnKTtcbn07XG5cblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJGxvZ1xuICpcbiAqIEBkZXNjcmlwdGlvblxuICogTW9jayBpbXBsZW1lbnRhdGlvbiBvZiB7QGxpbmsgbmcuJGxvZ30gdGhhdCBnYXRoZXJzIGFsbCBsb2dnZWQgbWVzc2FnZXMgaW4gYXJyYXlzXG4gKiAob25lIGFycmF5IHBlciBsb2dnaW5nIGxldmVsKS4gVGhlc2UgYXJyYXlzIGFyZSBleHBvc2VkIGFzIGBsb2dzYCBwcm9wZXJ0eSBvZiBlYWNoIG9mIHRoZVxuICogbGV2ZWwtc3BlY2lmaWMgbG9nIGZ1bmN0aW9uLCBlLmcuIGZvciBsZXZlbCBgZXJyb3JgIHRoZSBhcnJheSBpcyBleHBvc2VkIGFzIGAkbG9nLmVycm9yLmxvZ3NgLlxuICpcbiAqL1xuYW5ndWxhci5tb2NrLiRMb2dQcm92aWRlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVidWcgPSB0cnVlO1xuXG4gIGZ1bmN0aW9uIGNvbmNhdChhcnJheTEsIGFycmF5MiwgaW5kZXgpIHtcbiAgICByZXR1cm4gYXJyYXkxLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnJheTIsIGluZGV4KSk7XG4gIH1cblxuICB0aGlzLmRlYnVnRW5hYmxlZCA9IGZ1bmN0aW9uKGZsYWcpIHtcbiAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoZmxhZykpIHtcbiAgICAgIGRlYnVnID0gZmxhZztcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGVidWc7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuJGdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGxvZyA9IHtcbiAgICAgIGxvZzogZnVuY3Rpb24oKSB7ICRsb2cubG9nLmxvZ3MucHVzaChjb25jYXQoW10sIGFyZ3VtZW50cywgMCkpOyB9LFxuICAgICAgd2FybjogZnVuY3Rpb24oKSB7ICRsb2cud2Fybi5sb2dzLnB1c2goY29uY2F0KFtdLCBhcmd1bWVudHMsIDApKTsgfSxcbiAgICAgIGluZm86IGZ1bmN0aW9uKCkgeyAkbG9nLmluZm8ubG9ncy5wdXNoKGNvbmNhdChbXSwgYXJndW1lbnRzLCAwKSk7IH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oKSB7ICRsb2cuZXJyb3IubG9ncy5wdXNoKGNvbmNhdChbXSwgYXJndW1lbnRzLCAwKSk7IH0sXG4gICAgICBkZWJ1ZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChkZWJ1Zykge1xuICAgICAgICAgICRsb2cuZGVidWcubG9ncy5wdXNoKGNvbmNhdChbXSwgYXJndW1lbnRzLCAwKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAqIEBuYW1lICRsb2cjcmVzZXRcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJlc2V0IGFsbCBvZiB0aGUgbG9nZ2luZyBhcnJheXMgdG8gZW1wdHkuXG4gICAgICovXG4gICAgJGxvZy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8qKlxuICAgICAgICogQG5nZG9jIHByb3BlcnR5XG4gICAgICAgKiBAbmFtZSAkbG9nI2xvZy5sb2dzXG4gICAgICAgKlxuICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgKiBBcnJheSBvZiBtZXNzYWdlcyBsb2dnZWQgdXNpbmcge0BsaW5rIG5nTW9jay4kbG9nI2xvZ30uXG4gICAgICAgKlxuICAgICAgICogQGV4YW1wbGVcbiAgICAgICAqIGBgYGpzXG4gICAgICAgKiAkbG9nLmxvZygnU29tZSBMb2cnKTtcbiAgICAgICAqIHZhciBmaXJzdCA9ICRsb2cubG9nLmxvZ3MudW5zaGlmdCgpO1xuICAgICAgICogYGBgXG4gICAgICAgKi9cbiAgICAgICRsb2cubG9nLmxvZ3MgPSBbXTtcbiAgICAgIC8qKlxuICAgICAgICogQG5nZG9jIHByb3BlcnR5XG4gICAgICAgKiBAbmFtZSAkbG9nI2luZm8ubG9nc1xuICAgICAgICpcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICogQXJyYXkgb2YgbWVzc2FnZXMgbG9nZ2VkIHVzaW5nIHtAbGluayBuZ01vY2suJGxvZyNpbmZvfS5cbiAgICAgICAqXG4gICAgICAgKiBAZXhhbXBsZVxuICAgICAgICogYGBganNcbiAgICAgICAqICRsb2cuaW5mbygnU29tZSBJbmZvJyk7XG4gICAgICAgKiB2YXIgZmlyc3QgPSAkbG9nLmluZm8ubG9ncy51bnNoaWZ0KCk7XG4gICAgICAgKiBgYGBcbiAgICAgICAqL1xuICAgICAgJGxvZy5pbmZvLmxvZ3MgPSBbXTtcbiAgICAgIC8qKlxuICAgICAgICogQG5nZG9jIHByb3BlcnR5XG4gICAgICAgKiBAbmFtZSAkbG9nI3dhcm4ubG9nc1xuICAgICAgICpcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICogQXJyYXkgb2YgbWVzc2FnZXMgbG9nZ2VkIHVzaW5nIHtAbGluayBuZ01vY2suJGxvZyN3YXJufS5cbiAgICAgICAqXG4gICAgICAgKiBAZXhhbXBsZVxuICAgICAgICogYGBganNcbiAgICAgICAqICRsb2cud2FybignU29tZSBXYXJuaW5nJyk7XG4gICAgICAgKiB2YXIgZmlyc3QgPSAkbG9nLndhcm4ubG9ncy51bnNoaWZ0KCk7XG4gICAgICAgKiBgYGBcbiAgICAgICAqL1xuICAgICAgJGxvZy53YXJuLmxvZ3MgPSBbXTtcbiAgICAgIC8qKlxuICAgICAgICogQG5nZG9jIHByb3BlcnR5XG4gICAgICAgKiBAbmFtZSAkbG9nI2Vycm9yLmxvZ3NcbiAgICAgICAqXG4gICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAqIEFycmF5IG9mIG1lc3NhZ2VzIGxvZ2dlZCB1c2luZyB7QGxpbmsgbmdNb2NrLiRsb2cjZXJyb3J9LlxuICAgICAgICpcbiAgICAgICAqIEBleGFtcGxlXG4gICAgICAgKiBgYGBqc1xuICAgICAgICogJGxvZy5lcnJvcignU29tZSBFcnJvcicpO1xuICAgICAgICogdmFyIGZpcnN0ID0gJGxvZy5lcnJvci5sb2dzLnVuc2hpZnQoKTtcbiAgICAgICAqIGBgYFxuICAgICAgICovXG4gICAgICAkbG9nLmVycm9yLmxvZ3MgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICAgICAqIEBuYW1lICRsb2cjZGVidWcubG9nc1xuICAgICAgICpcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICogQXJyYXkgb2YgbWVzc2FnZXMgbG9nZ2VkIHVzaW5nIHtAbGluayBuZ01vY2suJGxvZyNkZWJ1Z30uXG4gICAgICAgKlxuICAgICAgICogQGV4YW1wbGVcbiAgICAgICAqIGBgYGpzXG4gICAgICAgKiAkbG9nLmRlYnVnKCdTb21lIEVycm9yJyk7XG4gICAgICAgKiB2YXIgZmlyc3QgPSAkbG9nLmRlYnVnLmxvZ3MudW5zaGlmdCgpO1xuICAgICAgICogYGBgXG4gICAgICAgKi9cbiAgICAgICRsb2cuZGVidWcubG9ncyA9IFtdO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICogQG5hbWUgJGxvZyNhc3NlcnRFbXB0eVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQXNzZXJ0IHRoYXQgdGhlIGFsbCBvZiB0aGUgbG9nZ2luZyBtZXRob2RzIGhhdmUgbm8gbG9nZ2VkIG1lc3NhZ2VzLiBJZiBtZXNzYWdlcyBwcmVzZW50LCBhblxuICAgICAqIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG4gICAgICovXG4gICAgJGxvZy5hc3NlcnRFbXB0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVycm9ycyA9IFtdO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKFsnZXJyb3InLCAnd2FybicsICdpbmZvJywgJ2xvZycsICdkZWJ1ZyddLCBmdW5jdGlvbihsb2dMZXZlbCkge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goJGxvZ1tsb2dMZXZlbF0ubG9ncywgZnVuY3Rpb24obG9nKSB7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGxvZywgZnVuY3Rpb24gKGxvZ0l0ZW0pIHtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKCdNT0NLICRsb2cgKCcgKyBsb2dMZXZlbCArICcpOiAnICsgU3RyaW5nKGxvZ0l0ZW0pICsgJ1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKGxvZ0l0ZW0uc3RhY2sgfHwgJycpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIGVycm9ycy51bnNoaWZ0KFwiRXhwZWN0ZWQgJGxvZyB0byBiZSBlbXB0eSEgRWl0aGVyIGEgbWVzc2FnZSB3YXMgbG9nZ2VkIHVuZXhwZWN0ZWRseSwgb3IgXCIrXG4gICAgICAgICAgXCJhbiBleHBlY3RlZCBsb2cgbWVzc2FnZSB3YXMgbm90IGNoZWNrZWQgYW5kIHJlbW92ZWQ6XCIpO1xuICAgICAgICBlcnJvcnMucHVzaCgnJyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvcnMuam9pbignXFxuLS0tLS0tLS0tXFxuJykpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkbG9nLnJlc2V0KCk7XG4gICAgcmV0dXJuICRsb2c7XG4gIH07XG59O1xuXG5cbi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lICRpbnRlcnZhbFxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogTW9jayBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgJGludGVydmFsIHNlcnZpY2UuXG4gKlxuICogVXNlIHtAbGluayBuZ01vY2suJGludGVydmFsI2ZsdXNoIGAkaW50ZXJ2YWwuZmx1c2gobWlsbGlzKWB9IHRvXG4gKiBtb3ZlIGZvcndhcmQgYnkgYG1pbGxpc2AgbWlsbGlzZWNvbmRzIGFuZCB0cmlnZ2VyIGFueSBmdW5jdGlvbnMgc2NoZWR1bGVkIHRvIHJ1biBpbiB0aGF0XG4gKiB0aW1lLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKX0gZm4gQSBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBjYWxsZWQgcmVwZWF0ZWRseS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkZWxheSBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIGJldHdlZW4gZWFjaCBmdW5jdGlvbiBjYWxsLlxuICogQHBhcmFtIHtudW1iZXI9fSBbY291bnQ9MF0gTnVtYmVyIG9mIHRpbWVzIHRvIHJlcGVhdC4gSWYgbm90IHNldCwgb3IgMCwgd2lsbCByZXBlYXRcbiAqICAgaW5kZWZpbml0ZWx5LlxuICogQHBhcmFtIHtib29sZWFuPX0gW2ludm9rZUFwcGx5PXRydWVdIElmIHNldCB0byBgZmFsc2VgIHNraXBzIG1vZGVsIGRpcnR5IGNoZWNraW5nLCBvdGhlcndpc2VcbiAqICAgd2lsbCBpbnZva2UgYGZuYCB3aXRoaW4gdGhlIHtAbGluayBuZy4kcm9vdFNjb3BlLlNjb3BlIyRhcHBseSAkYXBwbHl9IGJsb2NrLlxuICogQHJldHVybnMge3Byb21pc2V9IEEgcHJvbWlzZSB3aGljaCB3aWxsIGJlIG5vdGlmaWVkIG9uIGVhY2ggaXRlcmF0aW9uLlxuICovXG5hbmd1bGFyLm1vY2suJEludGVydmFsUHJvdmlkZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy4kZ2V0ID0gWyckcm9vdFNjb3BlJywgJyRxJyxcbiAgICAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAgICRxKSB7XG4gICAgdmFyIHJlcGVhdEZucyA9IFtdLFxuICAgICAgICBuZXh0UmVwZWF0SWQgPSAwLFxuICAgICAgICBub3cgPSAwO1xuXG4gICAgdmFyICRpbnRlcnZhbCA9IGZ1bmN0aW9uKGZuLCBkZWxheSwgY291bnQsIGludm9rZUFwcGx5KSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpLFxuICAgICAgICAgIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlLFxuICAgICAgICAgIGl0ZXJhdGlvbiA9IDAsXG4gICAgICAgICAgc2tpcEFwcGx5ID0gKGFuZ3VsYXIuaXNEZWZpbmVkKGludm9rZUFwcGx5KSAmJiAhaW52b2tlQXBwbHkpO1xuXG4gICAgICBjb3VudCA9IChhbmd1bGFyLmlzRGVmaW5lZChjb3VudCkpID8gY291bnQgOiAwO1xuICAgICAgcHJvbWlzZS50aGVuKG51bGwsIG51bGwsIGZuKTtcblxuICAgICAgcHJvbWlzZS4kJGludGVydmFsSWQgPSBuZXh0UmVwZWF0SWQ7XG5cbiAgICAgIGZ1bmN0aW9uIHRpY2soKSB7XG4gICAgICAgIGRlZmVycmVkLm5vdGlmeShpdGVyYXRpb24rKyk7XG5cbiAgICAgICAgaWYgKGNvdW50ID4gMCAmJiBpdGVyYXRpb24gPj0gY291bnQpIHtcbiAgICAgICAgICB2YXIgZm5JbmRleDtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGl0ZXJhdGlvbik7XG5cbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocmVwZWF0Rm5zLCBmdW5jdGlvbihmbiwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChmbi5pZCA9PT0gcHJvbWlzZS4kJGludGVydmFsSWQpIGZuSW5kZXggPSBpbmRleDtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChmbkluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJlcGVhdEZucy5zcGxpY2UoZm5JbmRleCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFza2lwQXBwbHkpICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICB9XG5cbiAgICAgIHJlcGVhdEZucy5wdXNoKHtcbiAgICAgICAgbmV4dFRpbWU6KG5vdyArIGRlbGF5KSxcbiAgICAgICAgZGVsYXk6IGRlbGF5LFxuICAgICAgICBmbjogdGljayxcbiAgICAgICAgaWQ6IG5leHRSZXBlYXRJZCxcbiAgICAgICAgZGVmZXJyZWQ6IGRlZmVycmVkXG4gICAgICB9KTtcbiAgICAgIHJlcGVhdEZucy5zb3J0KGZ1bmN0aW9uKGEsYil7IHJldHVybiBhLm5leHRUaW1lIC0gYi5uZXh0VGltZTt9KTtcblxuICAgICAgbmV4dFJlcGVhdElkKys7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgKiBAbmFtZSAkaW50ZXJ2YWwjY2FuY2VsXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBDYW5jZWxzIGEgdGFzayBhc3NvY2lhdGVkIHdpdGggdGhlIGBwcm9taXNlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7cHJvbWlzZX0gcHJvbWlzZSBBIHByb21pc2UgZnJvbSBjYWxsaW5nIHRoZSBgJGludGVydmFsYCBmdW5jdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHRhc2sgd2FzIHN1Y2Nlc3NmdWxseSBjYW5jZWxsZWQuXG4gICAgICovXG4gICAgJGludGVydmFsLmNhbmNlbCA9IGZ1bmN0aW9uKHByb21pc2UpIHtcbiAgICAgIGlmKCFwcm9taXNlKSByZXR1cm4gZmFsc2U7XG4gICAgICB2YXIgZm5JbmRleDtcblxuICAgICAgYW5ndWxhci5mb3JFYWNoKHJlcGVhdEZucywgZnVuY3Rpb24oZm4sIGluZGV4KSB7XG4gICAgICAgIGlmIChmbi5pZCA9PT0gcHJvbWlzZS4kJGludGVydmFsSWQpIGZuSW5kZXggPSBpbmRleDtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZm5JbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlcGVhdEZuc1tmbkluZGV4XS5kZWZlcnJlZC5yZWplY3QoJ2NhbmNlbGVkJyk7XG4gICAgICAgIHJlcGVhdEZucy5zcGxpY2UoZm5JbmRleCwgMSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgKiBAbmFtZSAkaW50ZXJ2YWwjZmx1c2hcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKlxuICAgICAqIFJ1bnMgaW50ZXJ2YWwgdGFza3Mgc2NoZWR1bGVkIHRvIGJlIHJ1biBpbiB0aGUgbmV4dCBgbWlsbGlzYCBtaWxsaXNlY29uZHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcj19IG1pbGxpcyBtYXhpbXVtIHRpbWVvdXQgYW1vdW50IHRvIGZsdXNoIHVwIHVudGlsLlxuICAgICAqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgYW1vdW50IG9mIHRpbWUgbW92ZWQgZm9yd2FyZC5cbiAgICAgKi9cbiAgICAkaW50ZXJ2YWwuZmx1c2ggPSBmdW5jdGlvbihtaWxsaXMpIHtcbiAgICAgIG5vdyArPSBtaWxsaXM7XG4gICAgICB3aGlsZSAocmVwZWF0Rm5zLmxlbmd0aCAmJiByZXBlYXRGbnNbMF0ubmV4dFRpbWUgPD0gbm93KSB7XG4gICAgICAgIHZhciB0YXNrID0gcmVwZWF0Rm5zWzBdO1xuICAgICAgICB0YXNrLmZuKCk7XG4gICAgICAgIHRhc2submV4dFRpbWUgKz0gdGFzay5kZWxheTtcbiAgICAgICAgcmVwZWF0Rm5zLnNvcnQoZnVuY3Rpb24oYSxiKXsgcmV0dXJuIGEubmV4dFRpbWUgLSBiLm5leHRUaW1lO30pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1pbGxpcztcbiAgICB9O1xuXG4gICAgcmV0dXJuICRpbnRlcnZhbDtcbiAgfV07XG59O1xuXG5cbi8qIGpzaGludCAtVzEwMSAqL1xuLyogVGhlIFJfSVNPODA2MV9TVFIgcmVnZXggaXMgbmV2ZXIgZ29pbmcgdG8gZml0IGludG8gdGhlIDEwMCBjaGFyIGxpbWl0IVxuICogVGhpcyBkaXJlY3RpdmUgc2hvdWxkIGdvIGluc2lkZSB0aGUgYW5vbnltb3VzIGZ1bmN0aW9uIGJ1dCBhIGJ1ZyBpbiBKU0hpbnQgbWVhbnMgdGhhdCBpdCB3b3VsZFxuICogbm90IGJlIGVuYWN0ZWQgZWFybHkgZW5vdWdoIHRvIHByZXZlbnQgdGhlIHdhcm5pbmcuXG4gKi9cbnZhciBSX0lTTzgwNjFfU1RSID0gL14oXFxkezR9KS0/KFxcZFxcZCktPyhcXGRcXGQpKD86VChcXGRcXGQpKD86XFw6PyhcXGRcXGQpKD86XFw6PyhcXGRcXGQpKD86XFwuKFxcZHszfSkpPyk/KT8oWnwoWystXSkoXFxkXFxkKTo/KFxcZFxcZCkpKT8kLztcblxuZnVuY3Rpb24ganNvblN0cmluZ1RvRGF0ZShzdHJpbmcpIHtcbiAgdmFyIG1hdGNoO1xuICBpZiAobWF0Y2ggPSBzdHJpbmcubWF0Y2goUl9JU084MDYxX1NUUikpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKDApLFxuICAgICAgICB0ekhvdXIgPSAwLFxuICAgICAgICB0ek1pbiAgPSAwO1xuICAgIGlmIChtYXRjaFs5XSkge1xuICAgICAgdHpIb3VyID0gaW50KG1hdGNoWzldICsgbWF0Y2hbMTBdKTtcbiAgICAgIHR6TWluID0gaW50KG1hdGNoWzldICsgbWF0Y2hbMTFdKTtcbiAgICB9XG4gICAgZGF0ZS5zZXRVVENGdWxsWWVhcihpbnQobWF0Y2hbMV0pLCBpbnQobWF0Y2hbMl0pIC0gMSwgaW50KG1hdGNoWzNdKSk7XG4gICAgZGF0ZS5zZXRVVENIb3VycyhpbnQobWF0Y2hbNF18fDApIC0gdHpIb3VyLFxuICAgICAgICAgICAgICAgICAgICAgaW50KG1hdGNoWzVdfHwwKSAtIHR6TWluLFxuICAgICAgICAgICAgICAgICAgICAgaW50KG1hdGNoWzZdfHwwKSxcbiAgICAgICAgICAgICAgICAgICAgIGludChtYXRjaFs3XXx8MCkpO1xuICAgIHJldHVybiBkYXRlO1xuICB9XG4gIHJldHVybiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGludChzdHIpIHtcbiAgcmV0dXJuIHBhcnNlSW50KHN0ciwgMTApO1xufVxuXG5mdW5jdGlvbiBwYWROdW1iZXIobnVtLCBkaWdpdHMsIHRyaW0pIHtcbiAgdmFyIG5lZyA9ICcnO1xuICBpZiAobnVtIDwgMCkge1xuICAgIG5lZyA9ICAnLSc7XG4gICAgbnVtID0gLW51bTtcbiAgfVxuICBudW0gPSAnJyArIG51bTtcbiAgd2hpbGUobnVtLmxlbmd0aCA8IGRpZ2l0cykgbnVtID0gJzAnICsgbnVtO1xuICBpZiAodHJpbSlcbiAgICBudW0gPSBudW0uc3Vic3RyKG51bS5sZW5ndGggLSBkaWdpdHMpO1xuICByZXR1cm4gbmVnICsgbnVtO1xufVxuXG5cbi8qKlxuICogQG5nZG9jIHR5cGVcbiAqIEBuYW1lIGFuZ3VsYXIubW9jay5UekRhdGVcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqICpOT1RFKjogdGhpcyBpcyBub3QgYW4gaW5qZWN0YWJsZSBpbnN0YW5jZSwganVzdCBhIGdsb2JhbGx5IGF2YWlsYWJsZSBtb2NrIGNsYXNzIG9mIGBEYXRlYC5cbiAqXG4gKiBNb2NrIG9mIHRoZSBEYXRlIHR5cGUgd2hpY2ggaGFzIGl0cyB0aW1lem9uZSBzcGVjaWZpZWQgdmlhIGNvbnN0cnVjdG9yIGFyZy5cbiAqXG4gKiBUaGUgbWFpbiBwdXJwb3NlIGlzIHRvIGNyZWF0ZSBEYXRlLWxpa2UgaW5zdGFuY2VzIHdpdGggdGltZXpvbmUgZml4ZWQgdG8gdGhlIHNwZWNpZmllZCB0aW1lem9uZVxuICogb2Zmc2V0LCBzbyB0aGF0IHdlIGNhbiB0ZXN0IGNvZGUgdGhhdCBkZXBlbmRzIG9uIGxvY2FsIHRpbWV6b25lIHNldHRpbmdzIHdpdGhvdXQgZGVwZW5kZW5jeSBvblxuICogdGhlIHRpbWUgem9uZSBzZXR0aW5ncyBvZiB0aGUgbWFjaGluZSB3aGVyZSB0aGUgY29kZSBpcyBydW5uaW5nLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXQgT2Zmc2V0IG9mIHRoZSAqZGVzaXJlZCogdGltZXpvbmUgaW4gaG91cnMgKGZyYWN0aW9ucyB3aWxsIGJlIGhvbm9yZWQpXG4gKiBAcGFyYW0geyhudW1iZXJ8c3RyaW5nKX0gdGltZXN0YW1wIFRpbWVzdGFtcCByZXByZXNlbnRpbmcgdGhlIGRlc2lyZWQgdGltZSBpbiAqVVRDKlxuICpcbiAqIEBleGFtcGxlXG4gKiAhISEhIFdBUk5JTkcgISEhISFcbiAqIFRoaXMgaXMgbm90IGEgY29tcGxldGUgRGF0ZSBvYmplY3Qgc28gb25seSBtZXRob2RzIHRoYXQgd2VyZSBpbXBsZW1lbnRlZCBjYW4gYmUgY2FsbGVkIHNhZmVseS5cbiAqIFRvIG1ha2UgbWF0dGVycyB3b3JzZSwgVHpEYXRlIGluc3RhbmNlcyBpbmhlcml0IHN0dWZmIGZyb20gRGF0ZSB2aWEgYSBwcm90b3R5cGUuXG4gKlxuICogV2UgZG8gb3VyIGJlc3QgdG8gaW50ZXJjZXB0IGNhbGxzIHRvIFwidW5pbXBsZW1lbnRlZFwiIG1ldGhvZHMsIGJ1dCBzaW5jZSB0aGUgbGlzdCBvZiBtZXRob2RzIGlzXG4gKiBpbmNvbXBsZXRlIHdlIG1pZ2h0IGJlIG1pc3Npbmcgc29tZSBub24tc3RhbmRhcmQgbWV0aG9kcy4gVGhpcyBjYW4gcmVzdWx0IGluIGVycm9ycyBsaWtlOlxuICogXCJEYXRlLnByb3RvdHlwZS5mb28gY2FsbGVkIG9uIGluY29tcGF0aWJsZSBPYmplY3RcIi5cbiAqXG4gKiBgYGBqc1xuICogdmFyIG5ld1llYXJJbkJyYXRpc2xhdmEgPSBuZXcgVHpEYXRlKC0xLCAnMjAwOS0xMi0zMVQyMzowMDowMFonKTtcbiAqIG5ld1llYXJJbkJyYXRpc2xhdmEuZ2V0VGltZXpvbmVPZmZzZXQoKSA9PiAtNjA7XG4gKiBuZXdZZWFySW5CcmF0aXNsYXZhLmdldEZ1bGxZZWFyKCkgPT4gMjAxMDtcbiAqIG5ld1llYXJJbkJyYXRpc2xhdmEuZ2V0TW9udGgoKSA9PiAwO1xuICogbmV3WWVhckluQnJhdGlzbGF2YS5nZXREYXRlKCkgPT4gMTtcbiAqIG5ld1llYXJJbkJyYXRpc2xhdmEuZ2V0SG91cnMoKSA9PiAwO1xuICogbmV3WWVhckluQnJhdGlzbGF2YS5nZXRNaW51dGVzKCkgPT4gMDtcbiAqIG5ld1llYXJJbkJyYXRpc2xhdmEuZ2V0U2Vjb25kcygpID0+IDA7XG4gKiBgYGBcbiAqXG4gKi9cbmFuZ3VsYXIubW9jay5UekRhdGUgPSBmdW5jdGlvbiAob2Zmc2V0LCB0aW1lc3RhbXApIHtcbiAgdmFyIHNlbGYgPSBuZXcgRGF0ZSgwKTtcbiAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcodGltZXN0YW1wKSkge1xuICAgIHZhciB0c1N0ciA9IHRpbWVzdGFtcDtcblxuICAgIHNlbGYub3JpZ0RhdGUgPSBqc29uU3RyaW5nVG9EYXRlKHRpbWVzdGFtcCk7XG5cbiAgICB0aW1lc3RhbXAgPSBzZWxmLm9yaWdEYXRlLmdldFRpbWUoKTtcbiAgICBpZiAoaXNOYU4odGltZXN0YW1wKSlcbiAgICAgIHRocm93IHtcbiAgICAgICAgbmFtZTogXCJJbGxlZ2FsIEFyZ3VtZW50XCIsXG4gICAgICAgIG1lc3NhZ2U6IFwiQXJnICdcIiArIHRzU3RyICsgXCInIHBhc3NlZCBpbnRvIFR6RGF0ZSBjb25zdHJ1Y3RvciBpcyBub3QgYSB2YWxpZCBkYXRlIHN0cmluZ1wiXG4gICAgICB9O1xuICB9IGVsc2Uge1xuICAgIHNlbGYub3JpZ0RhdGUgPSBuZXcgRGF0ZSh0aW1lc3RhbXApO1xuICB9XG5cbiAgdmFyIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUodGltZXN0YW1wKS5nZXRUaW1lem9uZU9mZnNldCgpO1xuICBzZWxmLm9mZnNldERpZmYgPSBsb2NhbE9mZnNldCo2MCoxMDAwIC0gb2Zmc2V0KjEwMDAqNjAqNjA7XG4gIHNlbGYuZGF0ZSA9IG5ldyBEYXRlKHRpbWVzdGFtcCArIHNlbGYub2Zmc2V0RGlmZik7XG5cbiAgc2VsZi5nZXRUaW1lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYuZGF0ZS5nZXRUaW1lKCkgLSBzZWxmLm9mZnNldERpZmY7XG4gIH07XG5cbiAgc2VsZi50b0xvY2FsZURhdGVTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5kYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICB9O1xuXG4gIHNlbGYuZ2V0RnVsbFllYXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5kYXRlLmdldEZ1bGxZZWFyKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRNb250aCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLmRhdGUuZ2V0TW9udGgoKTtcbiAgfTtcblxuICBzZWxmLmdldERhdGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5kYXRlLmdldERhdGUoKTtcbiAgfTtcblxuICBzZWxmLmdldEhvdXJzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYuZGF0ZS5nZXRIb3VycygpO1xuICB9O1xuXG4gIHNlbGYuZ2V0TWludXRlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLmRhdGUuZ2V0TWludXRlcygpO1xuICB9O1xuXG4gIHNlbGYuZ2V0U2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLmRhdGUuZ2V0U2Vjb25kcygpO1xuICB9O1xuXG4gIHNlbGYuZ2V0TWlsbGlzZWNvbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYuZGF0ZS5nZXRNaWxsaXNlY29uZHMoKTtcbiAgfTtcblxuICBzZWxmLmdldFRpbWV6b25lT2Zmc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG9mZnNldCAqIDYwO1xuICB9O1xuXG4gIHNlbGYuZ2V0VVRDRnVsbFllYXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5vcmlnRGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICB9O1xuXG4gIHNlbGYuZ2V0VVRDTW9udGggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5vcmlnRGF0ZS5nZXRVVENNb250aCgpO1xuICB9O1xuXG4gIHNlbGYuZ2V0VVRDRGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLm9yaWdEYXRlLmdldFVUQ0RhdGUoKTtcbiAgfTtcblxuICBzZWxmLmdldFVUQ0hvdXJzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYub3JpZ0RhdGUuZ2V0VVRDSG91cnMoKTtcbiAgfTtcblxuICBzZWxmLmdldFVUQ01pbnV0ZXMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5vcmlnRGF0ZS5nZXRVVENNaW51dGVzKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRVVENTZWNvbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYub3JpZ0RhdGUuZ2V0VVRDU2Vjb25kcygpO1xuICB9O1xuXG4gIHNlbGYuZ2V0VVRDTWlsbGlzZWNvbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYub3JpZ0RhdGUuZ2V0VVRDTWlsbGlzZWNvbmRzKCk7XG4gIH07XG5cbiAgc2VsZi5nZXREYXkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5kYXRlLmdldERheSgpO1xuICB9O1xuXG4gIC8vIHByb3ZpZGUgdGhpcyBtZXRob2Qgb25seSBvbiBicm93c2VycyB0aGF0IGFscmVhZHkgaGF2ZSBpdFxuICBpZiAoc2VsZi50b0lTT1N0cmluZykge1xuICAgIHNlbGYudG9JU09TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwYWROdW1iZXIoc2VsZi5vcmlnRGF0ZS5nZXRVVENGdWxsWWVhcigpLCA0KSArICctJyArXG4gICAgICAgICAgICBwYWROdW1iZXIoc2VsZi5vcmlnRGF0ZS5nZXRVVENNb250aCgpICsgMSwgMikgKyAnLScgK1xuICAgICAgICAgICAgcGFkTnVtYmVyKHNlbGYub3JpZ0RhdGUuZ2V0VVRDRGF0ZSgpLCAyKSArICdUJyArXG4gICAgICAgICAgICBwYWROdW1iZXIoc2VsZi5vcmlnRGF0ZS5nZXRVVENIb3VycygpLCAyKSArICc6JyArXG4gICAgICAgICAgICBwYWROdW1iZXIoc2VsZi5vcmlnRGF0ZS5nZXRVVENNaW51dGVzKCksIDIpICsgJzonICtcbiAgICAgICAgICAgIHBhZE51bWJlcihzZWxmLm9yaWdEYXRlLmdldFVUQ1NlY29uZHMoKSwgMikgKyAnLicgK1xuICAgICAgICAgICAgcGFkTnVtYmVyKHNlbGYub3JpZ0RhdGUuZ2V0VVRDTWlsbGlzZWNvbmRzKCksIDMpICsgJ1onO1xuICAgIH07XG4gIH1cblxuICAvL2hpZGUgYWxsIG1ldGhvZHMgbm90IGltcGxlbWVudGVkIGluIHRoaXMgbW9jayB0aGF0IHRoZSBEYXRlIHByb3RvdHlwZSBleHBvc2VzXG4gIHZhciB1bmltcGxlbWVudGVkTWV0aG9kcyA9IFsnZ2V0VVRDRGF5JyxcbiAgICAgICdnZXRZZWFyJywgJ3NldERhdGUnLCAnc2V0RnVsbFllYXInLCAnc2V0SG91cnMnLCAnc2V0TWlsbGlzZWNvbmRzJyxcbiAgICAgICdzZXRNaW51dGVzJywgJ3NldE1vbnRoJywgJ3NldFNlY29uZHMnLCAnc2V0VGltZScsICdzZXRVVENEYXRlJywgJ3NldFVUQ0Z1bGxZZWFyJyxcbiAgICAgICdzZXRVVENIb3VycycsICdzZXRVVENNaWxsaXNlY29uZHMnLCAnc2V0VVRDTWludXRlcycsICdzZXRVVENNb250aCcsICdzZXRVVENTZWNvbmRzJyxcbiAgICAgICdzZXRZZWFyJywgJ3RvRGF0ZVN0cmluZycsICd0b0dNVFN0cmluZycsICd0b0pTT04nLCAndG9Mb2NhbGVGb3JtYXQnLCAndG9Mb2NhbGVTdHJpbmcnLFxuICAgICAgJ3RvTG9jYWxlVGltZVN0cmluZycsICd0b1NvdXJjZScsICd0b1N0cmluZycsICd0b1RpbWVTdHJpbmcnLCAndG9VVENTdHJpbmcnLCAndmFsdWVPZiddO1xuXG4gIGFuZ3VsYXIuZm9yRWFjaCh1bmltcGxlbWVudGVkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kTmFtZSkge1xuICAgIHNlbGZbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCAnXCIgKyBtZXRob2ROYW1lICsgXCInIGlzIG5vdCBpbXBsZW1lbnRlZCBpbiB0aGUgVHpEYXRlIG1vY2tcIik7XG4gICAgfTtcbiAgfSk7XG5cbiAgcmV0dXJuIHNlbGY7XG59O1xuXG4vL21ha2UgXCJ0ekRhdGVJbnN0YW5jZSBpbnN0YW5jZW9mIERhdGVcIiByZXR1cm4gdHJ1ZVxuYW5ndWxhci5tb2NrLlR6RGF0ZS5wcm90b3R5cGUgPSBEYXRlLnByb3RvdHlwZTtcbi8qIGpzaGludCArVzEwMSAqL1xuXG5hbmd1bGFyLm1vY2suYW5pbWF0ZSA9IGFuZ3VsYXIubW9kdWxlKCduZ0FuaW1hdGVNb2NrJywgWyduZyddKVxuXG4gIC5jb25maWcoWyckcHJvdmlkZScsIGZ1bmN0aW9uKCRwcm92aWRlKSB7XG5cbiAgICB2YXIgcmVmbG93UXVldWUgPSBbXTtcbiAgICAkcHJvdmlkZS52YWx1ZSgnJCRhbmltYXRlUmVmbG93JywgZnVuY3Rpb24oZm4pIHtcbiAgICAgIHZhciBpbmRleCA9IHJlZmxvd1F1ZXVlLmxlbmd0aDtcbiAgICAgIHJlZmxvd1F1ZXVlLnB1c2goZm4pO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgcmVmbG93UXVldWUuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAkcHJvdmlkZS5kZWNvcmF0b3IoJyRhbmltYXRlJywgZnVuY3Rpb24oJGRlbGVnYXRlLCAkJGFzeW5jQ2FsbGJhY2spIHtcbiAgICAgIHZhciBhbmltYXRlID0ge1xuICAgICAgICBxdWV1ZSA6IFtdLFxuICAgICAgICBlbmFibGVkIDogJGRlbGVnYXRlLmVuYWJsZWQsXG4gICAgICAgIHRyaWdnZXJDYWxsYmFja3MgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkJGFzeW5jQ2FsbGJhY2suZmx1c2goKTtcbiAgICAgICAgfSxcbiAgICAgICAgdHJpZ2dlclJlZmxvdyA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyZWZsb3dRdWV1ZSwgZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVmbG93UXVldWUgPSBbXTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgYW5ndWxhci5mb3JFYWNoKFxuICAgICAgICBbJ2VudGVyJywnbGVhdmUnLCdtb3ZlJywnYWRkQ2xhc3MnLCdyZW1vdmVDbGFzcycsJ3NldENsYXNzJ10sIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICBhbmltYXRlW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBhbmltYXRlLnF1ZXVlLnB1c2goe1xuICAgICAgICAgICAgZXZlbnQgOiBtZXRob2QsXG4gICAgICAgICAgICBlbGVtZW50IDogYXJndW1lbnRzWzBdLFxuICAgICAgICAgICAgYXJncyA6IGFyZ3VtZW50c1xuICAgICAgICAgIH0pO1xuICAgICAgICAgICRkZWxlZ2F0ZVttZXRob2RdLmFwcGx5KCRkZWxlZ2F0ZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gYW5pbWF0ZTtcbiAgICB9KTtcblxuICB9XSk7XG5cblxuLyoqXG4gKiBAbmdkb2MgZnVuY3Rpb25cbiAqIEBuYW1lIGFuZ3VsYXIubW9jay5kdW1wXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiAqTk9URSo6IHRoaXMgaXMgbm90IGFuIGluamVjdGFibGUgaW5zdGFuY2UsIGp1c3QgYSBnbG9iYWxseSBhdmFpbGFibGUgZnVuY3Rpb24uXG4gKlxuICogTWV0aG9kIGZvciBzZXJpYWxpemluZyBjb21tb24gYW5ndWxhciBvYmplY3RzIChzY29wZSwgZWxlbWVudHMsIGV0Yy4uKSBpbnRvIHN0cmluZ3MsIHVzZWZ1bCBmb3JcbiAqIGRlYnVnZ2luZy5cbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBhbHNvIGF2YWlsYWJsZSBvbiB3aW5kb3csIHdoZXJlIGl0IGNhbiBiZSB1c2VkIHRvIGRpc3BsYXkgb2JqZWN0cyBvbiBkZWJ1Z1xuICogY29uc29sZS5cbiAqXG4gKiBAcGFyYW0geyp9IG9iamVjdCAtIGFueSBvYmplY3QgdG8gdHVybiBpbnRvIHN0cmluZy5cbiAqIEByZXR1cm4ge3N0cmluZ30gYSBzZXJpYWxpemVkIHN0cmluZyBvZiB0aGUgYXJndW1lbnRcbiAqL1xuYW5ndWxhci5tb2NrLmR1bXAgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIHNlcmlhbGl6ZShvYmplY3QpO1xuXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZShvYmplY3QpIHtcbiAgICB2YXIgb3V0O1xuXG4gICAgaWYgKGFuZ3VsYXIuaXNFbGVtZW50KG9iamVjdCkpIHtcbiAgICAgIG9iamVjdCA9IGFuZ3VsYXIuZWxlbWVudChvYmplY3QpO1xuICAgICAgb3V0ID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2PjwvZGl2PicpO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKG9iamVjdCwgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICBvdXQuYXBwZW5kKGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5jbG9uZSgpKTtcbiAgICAgIH0pO1xuICAgICAgb3V0ID0gb3V0Lmh0bWwoKTtcbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICBvdXQgPSBbXTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvYmplY3QsIGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgb3V0LnB1c2goc2VyaWFsaXplKG8pKTtcbiAgICAgIH0pO1xuICAgICAgb3V0ID0gJ1sgJyArIG91dC5qb2luKCcsICcpICsgJyBdJztcbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihvYmplY3QuJGV2YWwpICYmIGFuZ3VsYXIuaXNGdW5jdGlvbihvYmplY3QuJGFwcGx5KSkge1xuICAgICAgICBvdXQgPSBzZXJpYWxpemVTY29wZShvYmplY3QpO1xuICAgICAgfSBlbHNlIGlmIChvYmplY3QgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBvdXQgPSBvYmplY3Quc3RhY2sgfHwgKCcnICsgb2JqZWN0Lm5hbWUgKyAnOiAnICsgb2JqZWN0Lm1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETyhpKTogdGhpcyBwcmV2ZW50cyBtZXRob2RzIGJlaW5nIGxvZ2dlZCxcbiAgICAgICAgLy8gd2Ugc2hvdWxkIGhhdmUgYSBiZXR0ZXIgd2F5IHRvIHNlcmlhbGl6ZSBvYmplY3RzXG4gICAgICAgIG91dCA9IGFuZ3VsYXIudG9Kc29uKG9iamVjdCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCA9IFN0cmluZyhvYmplY3QpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBzZXJpYWxpemVTY29wZShzY29wZSwgb2Zmc2V0KSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8ICAnICAnO1xuICAgIHZhciBsb2cgPSBbb2Zmc2V0ICsgJ1Njb3BlKCcgKyBzY29wZS4kaWQgKyAnKTogeyddO1xuICAgIGZvciAoIHZhciBrZXkgaW4gc2NvcGUgKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNjb3BlLCBrZXkpICYmICFrZXkubWF0Y2goL14oXFwkfHRoaXMpLykpIHtcbiAgICAgICAgbG9nLnB1c2goJyAgJyArIGtleSArICc6ICcgKyBhbmd1bGFyLnRvSnNvbihzY29wZVtrZXldKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBjaGlsZCA9IHNjb3BlLiQkY2hpbGRIZWFkO1xuICAgIHdoaWxlKGNoaWxkKSB7XG4gICAgICBsb2cucHVzaChzZXJpYWxpemVTY29wZShjaGlsZCwgb2Zmc2V0ICsgJyAgJykpO1xuICAgICAgY2hpbGQgPSBjaGlsZC4kJG5leHRTaWJsaW5nO1xuICAgIH1cbiAgICBsb2cucHVzaCgnfScpO1xuICAgIHJldHVybiBsb2cuam9pbignXFxuJyArIG9mZnNldCk7XG4gIH1cbn07XG5cbi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lICRodHRwQmFja2VuZFxuICogQGRlc2NyaXB0aW9uXG4gKiBGYWtlIEhUVFAgYmFja2VuZCBpbXBsZW1lbnRhdGlvbiBzdWl0YWJsZSBmb3IgdW5pdCB0ZXN0aW5nIGFwcGxpY2F0aW9ucyB0aGF0IHVzZSB0aGVcbiAqIHtAbGluayBuZy4kaHR0cCAkaHR0cCBzZXJ2aWNlfS5cbiAqXG4gKiAqTm90ZSo6IEZvciBmYWtlIEhUVFAgYmFja2VuZCBpbXBsZW1lbnRhdGlvbiBzdWl0YWJsZSBmb3IgZW5kLXRvLWVuZCB0ZXN0aW5nIG9yIGJhY2tlbmQtbGVzc1xuICogZGV2ZWxvcG1lbnQgcGxlYXNlIHNlZSB7QGxpbmsgbmdNb2NrRTJFLiRodHRwQmFja2VuZCBlMmUgJGh0dHBCYWNrZW5kIG1vY2t9LlxuICpcbiAqIER1cmluZyB1bml0IHRlc3RpbmcsIHdlIHdhbnQgb3VyIHVuaXQgdGVzdHMgdG8gcnVuIHF1aWNrbHkgYW5kIGhhdmUgbm8gZXh0ZXJuYWwgZGVwZW5kZW5jaWVzIHNvXG4gKiB3ZSBkb27DouKCrOKEonQgd2FudCB0byBzZW5kIFtYSFJdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL3htbGh0dHByZXF1ZXN0KSBvclxuICogW0pTT05QXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0pTT05QKSByZXF1ZXN0cyB0byBhIHJlYWwgc2VydmVyLiBBbGwgd2UgcmVhbGx5IG5lZWQgaXNcbiAqIHRvIHZlcmlmeSB3aGV0aGVyIGEgY2VydGFpbiByZXF1ZXN0IGhhcyBiZWVuIHNlbnQgb3Igbm90LCBvciBhbHRlcm5hdGl2ZWx5IGp1c3QgbGV0IHRoZVxuICogYXBwbGljYXRpb24gbWFrZSByZXF1ZXN0cywgcmVzcG9uZCB3aXRoIHByZS10cmFpbmVkIHJlc3BvbnNlcyBhbmQgYXNzZXJ0IHRoYXQgdGhlIGVuZCByZXN1bHQgaXNcbiAqIHdoYXQgd2UgZXhwZWN0IGl0IHRvIGJlLlxuICpcbiAqIFRoaXMgbW9jayBpbXBsZW1lbnRhdGlvbiBjYW4gYmUgdXNlZCB0byByZXNwb25kIHdpdGggc3RhdGljIG9yIGR5bmFtaWMgcmVzcG9uc2VzIHZpYSB0aGVcbiAqIGBleHBlY3RgIGFuZCBgd2hlbmAgYXBpcyBhbmQgdGhlaXIgc2hvcnRjdXRzIChgZXhwZWN0R0VUYCwgYHdoZW5QT1NUYCwgZXRjKS5cbiAqXG4gKiBXaGVuIGFuIEFuZ3VsYXIgYXBwbGljYXRpb24gbmVlZHMgc29tZSBkYXRhIGZyb20gYSBzZXJ2ZXIsIGl0IGNhbGxzIHRoZSAkaHR0cCBzZXJ2aWNlLCB3aGljaFxuICogc2VuZHMgdGhlIHJlcXVlc3QgdG8gYSByZWFsIHNlcnZlciB1c2luZyAkaHR0cEJhY2tlbmQgc2VydmljZS4gV2l0aCBkZXBlbmRlbmN5IGluamVjdGlvbiwgaXQgaXNcbiAqIGVhc3kgdG8gaW5qZWN0ICRodHRwQmFja2VuZCBtb2NrICh3aGljaCBoYXMgdGhlIHNhbWUgQVBJIGFzICRodHRwQmFja2VuZCkgYW5kIHVzZSBpdCB0byB2ZXJpZnlcbiAqIHRoZSByZXF1ZXN0cyBhbmQgcmVzcG9uZCB3aXRoIHNvbWUgdGVzdGluZyBkYXRhIHdpdGhvdXQgc2VuZGluZyBhIHJlcXVlc3QgdG8gYSByZWFsIHNlcnZlci5cbiAqXG4gKiBUaGVyZSBhcmUgdHdvIHdheXMgdG8gc3BlY2lmeSB3aGF0IHRlc3QgZGF0YSBzaG91bGQgYmUgcmV0dXJuZWQgYXMgaHR0cCByZXNwb25zZXMgYnkgdGhlIG1vY2tcbiAqIGJhY2tlbmQgd2hlbiB0aGUgY29kZSB1bmRlciB0ZXN0IG1ha2VzIGh0dHAgcmVxdWVzdHM6XG4gKlxuICogLSBgJGh0dHBCYWNrZW5kLmV4cGVjdGAgLSBzcGVjaWZpZXMgYSByZXF1ZXN0IGV4cGVjdGF0aW9uXG4gKiAtIGAkaHR0cEJhY2tlbmQud2hlbmAgLSBzcGVjaWZpZXMgYSBiYWNrZW5kIGRlZmluaXRpb25cbiAqXG4gKlxuICogIyBSZXF1ZXN0IEV4cGVjdGF0aW9ucyB2cyBCYWNrZW5kIERlZmluaXRpb25zXG4gKlxuICogUmVxdWVzdCBleHBlY3RhdGlvbnMgcHJvdmlkZSBhIHdheSB0byBtYWtlIGFzc2VydGlvbnMgYWJvdXQgcmVxdWVzdHMgbWFkZSBieSB0aGUgYXBwbGljYXRpb24gYW5kXG4gKiB0byBkZWZpbmUgcmVzcG9uc2VzIGZvciB0aG9zZSByZXF1ZXN0cy4gVGhlIHRlc3Qgd2lsbCBmYWlsIGlmIHRoZSBleHBlY3RlZCByZXF1ZXN0cyBhcmUgbm90IG1hZGVcbiAqIG9yIHRoZXkgYXJlIG1hZGUgaW4gdGhlIHdyb25nIG9yZGVyLlxuICpcbiAqIEJhY2tlbmQgZGVmaW5pdGlvbnMgYWxsb3cgeW91IHRvIGRlZmluZSBhIGZha2UgYmFja2VuZCBmb3IgeW91ciBhcHBsaWNhdGlvbiB3aGljaCBkb2Vzbid0IGFzc2VydFxuICogaWYgYSBwYXJ0aWN1bGFyIHJlcXVlc3Qgd2FzIG1hZGUgb3Igbm90LCBpdCBqdXN0IHJldHVybnMgYSB0cmFpbmVkIHJlc3BvbnNlIGlmIGEgcmVxdWVzdCBpcyBtYWRlLlxuICogVGhlIHRlc3Qgd2lsbCBwYXNzIHdoZXRoZXIgb3Igbm90IHRoZSByZXF1ZXN0IGdldHMgbWFkZSBkdXJpbmcgdGVzdGluZy5cbiAqXG4gKlxuICogPHRhYmxlIGNsYXNzPVwidGFibGVcIj5cbiAqICAgPHRyPjx0aCB3aWR0aD1cIjIyMHB4XCI+PC90aD48dGg+UmVxdWVzdCBleHBlY3RhdGlvbnM8L3RoPjx0aD5CYWNrZW5kIGRlZmluaXRpb25zPC90aD48L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRoPlN5bnRheDwvdGg+XG4gKiAgICAgPHRkPi5leHBlY3QoLi4uKS5yZXNwb25kKC4uLik8L3RkPlxuICogICAgIDx0ZD4ud2hlbiguLi4pLnJlc3BvbmQoLi4uKTwvdGQ+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGg+VHlwaWNhbCB1c2FnZTwvdGg+XG4gKiAgICAgPHRkPnN0cmljdCB1bml0IHRlc3RzPC90ZD5cbiAqICAgICA8dGQ+bG9vc2UgKGJsYWNrLWJveCkgdW5pdCB0ZXN0aW5nPC90ZD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0aD5GdWxmaWxscyBtdWx0aXBsZSByZXF1ZXN0czwvdGg+XG4gKiAgICAgPHRkPk5PPC90ZD5cbiAqICAgICA8dGQ+WUVTPC90ZD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0aD5PcmRlciBvZiByZXF1ZXN0cyBtYXR0ZXJzPC90aD5cbiAqICAgICA8dGQ+WUVTPC90ZD5cbiAqICAgICA8dGQ+Tk88L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRoPlJlcXVlc3QgcmVxdWlyZWQ8L3RoPlxuICogICAgIDx0ZD5ZRVM8L3RkPlxuICogICAgIDx0ZD5OTzwvdGQ+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGg+UmVzcG9uc2UgcmVxdWlyZWQ8L3RoPlxuICogICAgIDx0ZD5vcHRpb25hbCAoc2VlIGJlbG93KTwvdGQ+XG4gKiAgICAgPHRkPllFUzwvdGQ+XG4gKiAgIDwvdHI+XG4gKiA8L3RhYmxlPlxuICpcbiAqIEluIGNhc2VzIHdoZXJlIGJvdGggYmFja2VuZCBkZWZpbml0aW9ucyBhbmQgcmVxdWVzdCBleHBlY3RhdGlvbnMgYXJlIHNwZWNpZmllZCBkdXJpbmcgdW5pdFxuICogdGVzdGluZywgdGhlIHJlcXVlc3QgZXhwZWN0YXRpb25zIGFyZSBldmFsdWF0ZWQgZmlyc3QuXG4gKlxuICogSWYgYSByZXF1ZXN0IGV4cGVjdGF0aW9uIGhhcyBubyByZXNwb25zZSBzcGVjaWZpZWQsIHRoZSBhbGdvcml0aG0gd2lsbCBzZWFyY2ggeW91ciBiYWNrZW5kXG4gKiBkZWZpbml0aW9ucyBmb3IgYW4gYXBwcm9wcmlhdGUgcmVzcG9uc2UuXG4gKlxuICogSWYgYSByZXF1ZXN0IGRpZG4ndCBtYXRjaCBhbnkgZXhwZWN0YXRpb24gb3IgaWYgdGhlIGV4cGVjdGF0aW9uIGRvZXNuJ3QgaGF2ZSB0aGUgcmVzcG9uc2VcbiAqIGRlZmluZWQsIHRoZSBiYWNrZW5kIGRlZmluaXRpb25zIGFyZSBldmFsdWF0ZWQgaW4gc2VxdWVudGlhbCBvcmRlciB0byBzZWUgaWYgYW55IG9mIHRoZW0gbWF0Y2hcbiAqIHRoZSByZXF1ZXN0LiBUaGUgcmVzcG9uc2UgZnJvbSB0aGUgZmlyc3QgbWF0Y2hlZCBkZWZpbml0aW9uIGlzIHJldHVybmVkLlxuICpcbiAqXG4gKiAjIEZsdXNoaW5nIEhUVFAgcmVxdWVzdHNcbiAqXG4gKiBUaGUgJGh0dHBCYWNrZW5kIHVzZWQgaW4gcHJvZHVjdGlvbiBhbHdheXMgcmVzcG9uZHMgdG8gcmVxdWVzdHMgYXN5bmNocm9ub3VzbHkuIElmIHdlIHByZXNlcnZlZFxuICogdGhpcyBiZWhhdmlvciBpbiB1bml0IHRlc3RpbmcsIHdlJ2QgaGF2ZSB0byBjcmVhdGUgYXN5bmMgdW5pdCB0ZXN0cywgd2hpY2ggYXJlIGhhcmQgdG8gd3JpdGUsXG4gKiB0byBmb2xsb3cgYW5kIHRvIG1haW50YWluLiBCdXQgbmVpdGhlciBjYW4gdGhlIHRlc3RpbmcgbW9jayByZXNwb25kIHN5bmNocm9ub3VzbHk7IHRoYXQgd291bGRcbiAqIGNoYW5nZSB0aGUgZXhlY3V0aW9uIG9mIHRoZSBjb2RlIHVuZGVyIHRlc3QuIEZvciB0aGlzIHJlYXNvbiwgdGhlIG1vY2sgJGh0dHBCYWNrZW5kIGhhcyBhXG4gKiBgZmx1c2goKWAgbWV0aG9kLCB3aGljaCBhbGxvd3MgdGhlIHRlc3QgdG8gZXhwbGljaXRseSBmbHVzaCBwZW5kaW5nIHJlcXVlc3RzLiBUaGlzIHByZXNlcnZlc1xuICogdGhlIGFzeW5jIGFwaSBvZiB0aGUgYmFja2VuZCwgd2hpbGUgYWxsb3dpbmcgdGhlIHRlc3QgdG8gZXhlY3V0ZSBzeW5jaHJvbm91c2x5LlxuICpcbiAqXG4gKiAjIFVuaXQgdGVzdGluZyB3aXRoIG1vY2sgJGh0dHBCYWNrZW5kXG4gKiBUaGUgZm9sbG93aW5nIGNvZGUgc2hvd3MgaG93IHRvIHNldHVwIGFuZCB1c2UgdGhlIG1vY2sgYmFja2VuZCB3aGVuIHVuaXQgdGVzdGluZyBhIGNvbnRyb2xsZXIuXG4gKiBGaXJzdCB3ZSBjcmVhdGUgdGhlIGNvbnRyb2xsZXIgdW5kZXIgdGVzdDpcbiAqXG4gIGBgYGpzXG4gIC8vIFRoZSBjb250cm9sbGVyIGNvZGVcbiAgZnVuY3Rpb24gTXlDb250cm9sbGVyKCRzY29wZSwgJGh0dHApIHtcbiAgICB2YXIgYXV0aFRva2VuO1xuXG4gICAgJGh0dHAuZ2V0KCcvYXV0aC5weScpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzKSB7XG4gICAgICBhdXRoVG9rZW4gPSBoZWFkZXJzKCdBLVRva2VuJyk7XG4gICAgICAkc2NvcGUudXNlciA9IGRhdGE7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2F2ZU1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICB2YXIgaGVhZGVycyA9IHsgJ0F1dGhvcml6YXRpb24nOiBhdXRoVG9rZW4gfTtcbiAgICAgICRzY29wZS5zdGF0dXMgPSAnU2F2aW5nLi4uJztcblxuICAgICAgJGh0dHAucG9zdCgnL2FkZC1tc2cucHknLCBtZXNzYWdlLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLnN0YXR1cyA9ICcnO1xuICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5zdGF0dXMgPSAnRVJST1IhJztcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbiAgYGBgXG4gKlxuICogTm93IHdlIHNldHVwIHRoZSBtb2NrIGJhY2tlbmQgYW5kIGNyZWF0ZSB0aGUgdGVzdCBzcGVjczpcbiAqXG4gIGBgYGpzXG4gICAgLy8gdGVzdGluZyBjb250cm9sbGVyXG4gICAgZGVzY3JpYmUoJ015Q29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgIHZhciAkaHR0cEJhY2tlbmQsICRyb290U2NvcGUsIGNyZWF0ZUNvbnRyb2xsZXI7XG5cbiAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkaW5qZWN0b3IpIHtcbiAgICAgICAgIC8vIFNldCB1cCB0aGUgbW9jayBodHRwIHNlcnZpY2UgcmVzcG9uc2VzXG4gICAgICAgICAkaHR0cEJhY2tlbmQgPSAkaW5qZWN0b3IuZ2V0KCckaHR0cEJhY2tlbmQnKTtcbiAgICAgICAgIC8vIGJhY2tlbmQgZGVmaW5pdGlvbiBjb21tb24gZm9yIGFsbCB0ZXN0c1xuICAgICAgICAgJGh0dHBCYWNrZW5kLndoZW4oJ0dFVCcsICcvYXV0aC5weScpLnJlc3BvbmQoe3VzZXJJZDogJ3VzZXJYJ30sIHsnQS1Ub2tlbic6ICd4eHgnfSk7XG5cbiAgICAgICAgIC8vIEdldCBob2xkIG9mIGEgc2NvcGUgKGkuZS4gdGhlIHJvb3Qgc2NvcGUpXG4gICAgICAgICAkcm9vdFNjb3BlID0gJGluamVjdG9yLmdldCgnJHJvb3RTY29wZScpO1xuICAgICAgICAgLy8gVGhlICRjb250cm9sbGVyIHNlcnZpY2UgaXMgdXNlZCB0byBjcmVhdGUgaW5zdGFuY2VzIG9mIGNvbnRyb2xsZXJzXG4gICAgICAgICB2YXIgJGNvbnRyb2xsZXIgPSAkaW5qZWN0b3IuZ2V0KCckY29udHJvbGxlcicpO1xuXG4gICAgICAgICBjcmVhdGVDb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgIHJldHVybiAkY29udHJvbGxlcignTXlDb250cm9sbGVyJywgeyckc2NvcGUnIDogJHJvb3RTY29wZSB9KTtcbiAgICAgICAgIH07XG4gICAgICAgfSkpO1xuXG5cbiAgICAgICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAkaHR0cEJhY2tlbmQudmVyaWZ5Tm9PdXRzdGFuZGluZ0V4cGVjdGF0aW9uKCk7XG4gICAgICAgICAkaHR0cEJhY2tlbmQudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QoKTtcbiAgICAgICB9KTtcblxuXG4gICAgICAgaXQoJ3Nob3VsZCBmZXRjaCBhdXRoZW50aWNhdGlvbiB0b2tlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVCgnL2F1dGgucHknKTtcbiAgICAgICAgIHZhciBjb250cm9sbGVyID0gY3JlYXRlQ29udHJvbGxlcigpO1xuICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgfSk7XG5cblxuICAgICAgIGl0KCdzaG91bGQgc2VuZCBtc2cgdG8gc2VydmVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICB2YXIgY29udHJvbGxlciA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuXG4gICAgICAgICAvLyBub3cgeW91IGRvbsOi4oKs4oSidCBjYXJlIGFib3V0IHRoZSBhdXRoZW50aWNhdGlvbiwgYnV0XG4gICAgICAgICAvLyB0aGUgY29udHJvbGxlciB3aWxsIHN0aWxsIHNlbmQgdGhlIHJlcXVlc3QgYW5kXG4gICAgICAgICAvLyAkaHR0cEJhY2tlbmQgd2lsbCByZXNwb25kIHdpdGhvdXQgeW91IGhhdmluZyB0b1xuICAgICAgICAgLy8gc3BlY2lmeSB0aGUgZXhwZWN0YXRpb24gYW5kIHJlc3BvbnNlIGZvciB0aGlzIHJlcXVlc3RcblxuICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdFBPU1QoJy9hZGQtbXNnLnB5JywgJ21lc3NhZ2UgY29udGVudCcpLnJlc3BvbmQoMjAxLCAnJyk7XG4gICAgICAgICAkcm9vdFNjb3BlLnNhdmVNZXNzYWdlKCdtZXNzYWdlIGNvbnRlbnQnKTtcbiAgICAgICAgIGV4cGVjdCgkcm9vdFNjb3BlLnN0YXR1cykudG9CZSgnU2F2aW5nLi4uJyk7XG4gICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcbiAgICAgICAgIGV4cGVjdCgkcm9vdFNjb3BlLnN0YXR1cykudG9CZSgnJyk7XG4gICAgICAgfSk7XG5cblxuICAgICAgIGl0KCdzaG91bGQgc2VuZCBhdXRoIGhlYWRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBjcmVhdGVDb250cm9sbGVyKCk7XG4gICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcblxuICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdFBPU1QoJy9hZGQtbXNnLnB5JywgdW5kZWZpbmVkLCBmdW5jdGlvbihoZWFkZXJzKSB7XG4gICAgICAgICAgIC8vIGNoZWNrIGlmIHRoZSBoZWFkZXIgd2FzIHNlbmQsIGlmIGl0IHdhc24ndCB0aGUgZXhwZWN0YXRpb24gd29uJ3RcbiAgICAgICAgICAgLy8gbWF0Y2ggdGhlIHJlcXVlc3QgYW5kIHRoZSB0ZXN0IHdpbGwgZmFpbFxuICAgICAgICAgICByZXR1cm4gaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID09ICd4eHgnO1xuICAgICAgICAgfSkucmVzcG9uZCgyMDEsICcnKTtcblxuICAgICAgICAgJHJvb3RTY29wZS5zYXZlTWVzc2FnZSgnd2hhdGV2ZXInKTtcbiAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgIH0pO1xuICAgIH0pO1xuICAgYGBgXG4gKi9cbmFuZ3VsYXIubW9jay4kSHR0cEJhY2tlbmRQcm92aWRlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLiRnZXQgPSBbJyRyb290U2NvcGUnLCBjcmVhdGVIdHRwQmFja2VuZE1vY2tdO1xufTtcblxuLyoqXG4gKiBHZW5lcmFsIGZhY3RvcnkgZnVuY3Rpb24gZm9yICRodHRwQmFja2VuZCBtb2NrLlxuICogUmV0dXJucyBpbnN0YW5jZSBmb3IgdW5pdCB0ZXN0aW5nICh3aGVuIG5vIGFyZ3VtZW50cyBzcGVjaWZpZWQpOlxuICogICAtIHBhc3NpbmcgdGhyb3VnaCBpcyBkaXNhYmxlZFxuICogICAtIGF1dG8gZmx1c2hpbmcgaXMgZGlzYWJsZWRcbiAqXG4gKiBSZXR1cm5zIGluc3RhbmNlIGZvciBlMmUgdGVzdGluZyAod2hlbiBgJGRlbGVnYXRlYCBhbmQgYCRicm93c2VyYCBzcGVjaWZpZWQpOlxuICogICAtIHBhc3NpbmcgdGhyb3VnaCAoZGVsZWdhdGluZyByZXF1ZXN0IHRvIHJlYWwgYmFja2VuZCkgaXMgZW5hYmxlZFxuICogICAtIGF1dG8gZmx1c2hpbmcgaXMgZW5hYmxlZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0PX0gJGRlbGVnYXRlIFJlYWwgJGh0dHBCYWNrZW5kIGluc3RhbmNlIChhbGxvdyBwYXNzaW5nIHRocm91Z2ggaWYgc3BlY2lmaWVkKVxuICogQHBhcmFtIHtPYmplY3Q9fSAkYnJvd3NlciBBdXRvLWZsdXNoaW5nIGVuYWJsZWQgaWYgc3BlY2lmaWVkXG4gKiBAcmV0dXJuIHtPYmplY3R9IEluc3RhbmNlIG9mICRodHRwQmFja2VuZCBtb2NrXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUh0dHBCYWNrZW5kTW9jaygkcm9vdFNjb3BlLCAkZGVsZWdhdGUsICRicm93c2VyKSB7XG4gIHZhciBkZWZpbml0aW9ucyA9IFtdLFxuICAgICAgZXhwZWN0YXRpb25zID0gW10sXG4gICAgICByZXNwb25zZXMgPSBbXSxcbiAgICAgIHJlc3BvbnNlc1B1c2ggPSBhbmd1bGFyLmJpbmQocmVzcG9uc2VzLCByZXNwb25zZXMucHVzaCksXG4gICAgICBjb3B5ID0gYW5ndWxhci5jb3B5O1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlc3BvbnNlKHN0YXR1cywgZGF0YSwgaGVhZGVycywgc3RhdHVzVGV4dCkge1xuICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oc3RhdHVzKSkgcmV0dXJuIHN0YXR1cztcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBhbmd1bGFyLmlzTnVtYmVyKHN0YXR1cylcbiAgICAgICAgICA/IFtzdGF0dXMsIGRhdGEsIGhlYWRlcnMsIHN0YXR1c1RleHRdXG4gICAgICAgICAgOiBbMjAwLCBzdGF0dXMsIGRhdGFdO1xuICAgIH07XG4gIH1cblxuICAvLyBUT0RPKHZvanRhKTogY2hhbmdlIHBhcmFtcyB0bzogbWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMsIGNhbGxiYWNrXG4gIGZ1bmN0aW9uICRodHRwQmFja2VuZChtZXRob2QsIHVybCwgZGF0YSwgY2FsbGJhY2ssIGhlYWRlcnMsIHRpbWVvdXQsIHdpdGhDcmVkZW50aWFscykge1xuICAgIHZhciB4aHIgPSBuZXcgTW9ja1hocigpLFxuICAgICAgICBleHBlY3RhdGlvbiA9IGV4cGVjdGF0aW9uc1swXSxcbiAgICAgICAgd2FzRXhwZWN0ZWQgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIHByZXR0eVByaW50KGRhdGEpIHtcbiAgICAgIHJldHVybiAoYW5ndWxhci5pc1N0cmluZyhkYXRhKSB8fCBhbmd1bGFyLmlzRnVuY3Rpb24oZGF0YSkgfHwgZGF0YSBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAgICAgICA/IGRhdGFcbiAgICAgICAgICA6IGFuZ3VsYXIudG9Kc29uKGRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdyYXBSZXNwb25zZSh3cmFwcGVkKSB7XG4gICAgICBpZiAoISRicm93c2VyICYmIHRpbWVvdXQgJiYgdGltZW91dC50aGVuKSB0aW1lb3V0LnRoZW4oaGFuZGxlVGltZW91dCk7XG5cbiAgICAgIHJldHVybiBoYW5kbGVSZXNwb25zZTtcblxuICAgICAgZnVuY3Rpb24gaGFuZGxlUmVzcG9uc2UoKSB7XG4gICAgICAgIHZhciByZXNwb25zZSA9IHdyYXBwZWQucmVzcG9uc2UobWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMpO1xuICAgICAgICB4aHIuJCRyZXNwSGVhZGVycyA9IHJlc3BvbnNlWzJdO1xuICAgICAgICBjYWxsYmFjayhjb3B5KHJlc3BvbnNlWzBdKSwgY29weShyZXNwb25zZVsxXSksIHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSxcbiAgICAgICAgICAgICAgICAgY29weShyZXNwb25zZVszXSB8fCAnJykpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSByZXNwb25zZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgIGlmIChyZXNwb25zZXNbaV0gPT09IGhhbmRsZVJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXNwb25zZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgY2FsbGJhY2soLTEsIHVuZGVmaW5lZCwgJycpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGV4cGVjdGF0aW9uICYmIGV4cGVjdGF0aW9uLm1hdGNoKG1ldGhvZCwgdXJsKSkge1xuICAgICAgaWYgKCFleHBlY3RhdGlvbi5tYXRjaERhdGEoZGF0YSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgJyArIGV4cGVjdGF0aW9uICsgJyB3aXRoIGRpZmZlcmVudCBkYXRhXFxuJyArXG4gICAgICAgICAgICAnRVhQRUNURUQ6ICcgKyBwcmV0dHlQcmludChleHBlY3RhdGlvbi5kYXRhKSArICdcXG5HT1Q6ICAgICAgJyArIGRhdGEpO1xuXG4gICAgICBpZiAoIWV4cGVjdGF0aW9uLm1hdGNoSGVhZGVycyhoZWFkZXJzKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCAnICsgZXhwZWN0YXRpb24gKyAnIHdpdGggZGlmZmVyZW50IGhlYWRlcnNcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdFWFBFQ1RFRDogJyArIHByZXR0eVByaW50KGV4cGVjdGF0aW9uLmhlYWRlcnMpICsgJ1xcbkdPVDogICAgICAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXR0eVByaW50KGhlYWRlcnMpKTtcblxuICAgICAgZXhwZWN0YXRpb25zLnNoaWZ0KCk7XG5cbiAgICAgIGlmIChleHBlY3RhdGlvbi5yZXNwb25zZSkge1xuICAgICAgICByZXNwb25zZXMucHVzaCh3cmFwUmVzcG9uc2UoZXhwZWN0YXRpb24pKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgd2FzRXhwZWN0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciBpID0gLTEsIGRlZmluaXRpb247XG4gICAgd2hpbGUgKChkZWZpbml0aW9uID0gZGVmaW5pdGlvbnNbKytpXSkpIHtcbiAgICAgIGlmIChkZWZpbml0aW9uLm1hdGNoKG1ldGhvZCwgdXJsLCBkYXRhLCBoZWFkZXJzIHx8IHt9KSkge1xuICAgICAgICBpZiAoZGVmaW5pdGlvbi5yZXNwb25zZSkge1xuICAgICAgICAgIC8vIGlmICRicm93c2VyIHNwZWNpZmllZCwgd2UgZG8gYXV0byBmbHVzaCBhbGwgcmVxdWVzdHNcbiAgICAgICAgICAoJGJyb3dzZXIgPyAkYnJvd3Nlci5kZWZlciA6IHJlc3BvbnNlc1B1c2gpKHdyYXBSZXNwb25zZShkZWZpbml0aW9uKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGVmaW5pdGlvbi5wYXNzVGhyb3VnaCkge1xuICAgICAgICAgICRkZWxlZ2F0ZShtZXRob2QsIHVybCwgZGF0YSwgY2FsbGJhY2ssIGhlYWRlcnMsIHRpbWVvdXQsIHdpdGhDcmVkZW50aWFscyk7XG4gICAgICAgIH0gZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ05vIHJlc3BvbnNlIGRlZmluZWQgIScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHRocm93IHdhc0V4cGVjdGVkID9cbiAgICAgICAgbmV3IEVycm9yKCdObyByZXNwb25zZSBkZWZpbmVkICEnKSA6XG4gICAgICAgIG5ldyBFcnJvcignVW5leHBlY3RlZCByZXF1ZXN0OiAnICsgbWV0aG9kICsgJyAnICsgdXJsICsgJ1xcbicgK1xuICAgICAgICAgICAgICAgICAgKGV4cGVjdGF0aW9uID8gJ0V4cGVjdGVkICcgKyBleHBlY3RhdGlvbiA6ICdObyBtb3JlIHJlcXVlc3QgZXhwZWN0ZWQnKSk7XG4gIH1cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlblxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIG5ldyBiYWNrZW5kIGRlZmluaXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgSFRUUCBtZXRob2QuXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZykpPX0gZGF0YSBIVFRQIHJlcXVlc3QgYm9keSBvciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzXG4gICAqICAgZGF0YSBzdHJpbmcgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgZGF0YSBpcyBhcyBleHBlY3RlZC5cbiAgICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKE9iamVjdCkpPX0gaGVhZGVycyBIVFRQIGhlYWRlcnMgb3IgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBodHRwIGhlYWRlclxuICAgKiAgIG9iamVjdCBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBoZWFkZXJzIG1hdGNoIHRoZSBjdXJyZW50IGRlZmluaXRpb24uXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbHMgaG93IGEgbWF0Y2hlZFxuICAgKiAgIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICpcbiAgICogIC0gcmVzcG9uZCDDouKCrOKAnFxuICAgKiAgICAgIGB7ZnVuY3Rpb24oW3N0YXR1cyxdIGRhdGFbLCBoZWFkZXJzLCBzdGF0dXNUZXh0XSlcbiAgICogICAgICB8IGZ1bmN0aW9uKGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBoZWFkZXJzKX1gXG4gICAqICAgIMOi4oKs4oCcIFRoZSByZXNwb25kIG1ldGhvZCB0YWtlcyBhIHNldCBvZiBzdGF0aWMgZGF0YSB0byBiZSByZXR1cm5lZCBvciBhIGZ1bmN0aW9uIHRoYXQgY2FuXG4gICAqICAgIHJldHVybiBhbiBhcnJheSBjb250YWluaW5nIHJlc3BvbnNlIHN0YXR1cyAobnVtYmVyKSwgcmVzcG9uc2UgZGF0YSAoc3RyaW5nKSwgcmVzcG9uc2VcbiAgICogICAgaGVhZGVycyAoT2JqZWN0KSwgYW5kIHRoZSB0ZXh0IGZvciB0aGUgc3RhdHVzIChzdHJpbmcpLlxuICAgKi9cbiAgJGh0dHBCYWNrZW5kLndoZW4gPSBmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycykge1xuICAgIHZhciBkZWZpbml0aW9uID0gbmV3IE1vY2tIdHRwRXhwZWN0YXRpb24obWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMpLFxuICAgICAgICBjaGFpbiA9IHtcbiAgICAgICAgICByZXNwb25kOiBmdW5jdGlvbihzdGF0dXMsIGRhdGEsIGhlYWRlcnMsIHN0YXR1c1RleHQpIHtcbiAgICAgICAgICAgIGRlZmluaXRpb24ucmVzcG9uc2UgPSBjcmVhdGVSZXNwb25zZShzdGF0dXMsIGRhdGEsIGhlYWRlcnMsIHN0YXR1c1RleHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIGlmICgkYnJvd3Nlcikge1xuICAgICAgY2hhaW4ucGFzc1Rocm91Z2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZGVmaW5pdGlvbi5wYXNzVGhyb3VnaCA9IHRydWU7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGRlZmluaXRpb25zLnB1c2goZGVmaW5pdGlvbik7XG4gICAgcmV0dXJuIGNoYWluO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuR0VUXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiBmb3IgR0VUIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgd2hlbigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gICAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbihPYmplY3QpKT19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2wgaG93IGEgbWF0Y2hlZFxuICAgKiByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuSEVBRFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIG5ldyBiYWNrZW5kIGRlZmluaXRpb24gZm9yIEhFQUQgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGB3aGVuKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAgICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKE9iamVjdCkpPX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbCBob3cgYSBtYXRjaGVkXG4gICAqIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5ERUxFVEVcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBERUxFVEUgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGB3aGVuKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAgICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKE9iamVjdCkpPX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbCBob3cgYSBtYXRjaGVkXG4gICAqIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5QT1NUXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiBmb3IgUE9TVCByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZykpPX0gZGF0YSBIVFRQIHJlcXVlc3QgYm9keSBvciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzXG4gICAqICAgZGF0YSBzdHJpbmcgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgZGF0YSBpcyBhcyBleHBlY3RlZC5cbiAgICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKE9iamVjdCkpPX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbCBob3cgYSBtYXRjaGVkXG4gICAqIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5QVVRcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBQVVQgcmVxdWVzdHMuICBGb3IgbW9yZSBpbmZvIHNlZSBgd2hlbigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKSk9fSBkYXRhIEhUVFAgcmVxdWVzdCBib2R5IG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXNcbiAgICogICBkYXRhIHN0cmluZyBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBkYXRhIGlzIGFzIGV4cGVjdGVkLlxuICAgKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAgICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBtZXRob2QgdGhhdCBjb250cm9sIGhvdyBhIG1hdGNoZWRcbiAgICogcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlbkpTT05QXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiBmb3IgSlNPTlAgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGB3aGVuKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAgICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBtZXRob2QgdGhhdCBjb250cm9sIGhvdyBhIG1hdGNoZWRcbiAgICogcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cbiAgY3JlYXRlU2hvcnRNZXRob2RzKCd3aGVuJyk7XG5cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjZXhwZWN0XG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IHJlcXVlc3QgZXhwZWN0YXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgSFRUUCBtZXRob2QuXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZyl8T2JqZWN0KT19IGRhdGEgSFRUUCByZXF1ZXN0IGJvZHkgb3IgZnVuY3Rpb24gdGhhdFxuICAgKiAgcmVjZWl2ZXMgZGF0YSBzdHJpbmcgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgZGF0YSBpcyBhcyBleHBlY3RlZCwgb3IgT2JqZWN0IGlmIHJlcXVlc3QgYm9keVxuICAgKiAgaXMgaW4gSlNPTiBmb3JtYXQuXG4gICAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbihPYmplY3QpKT19IGhlYWRlcnMgSFRUUCBoZWFkZXJzIG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgaHR0cCBoZWFkZXJcbiAgICogICBvYmplY3QgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgaGVhZGVycyBtYXRjaCB0aGUgY3VycmVudCBleHBlY3RhdGlvbi5cbiAgICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBtZXRob2QgdGhhdCBjb250cm9sIGhvdyBhIG1hdGNoZWRcbiAgICogIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICpcbiAgICogIC0gcmVzcG9uZCDDouKCrOKAnFxuICAgKiAgICBge2Z1bmN0aW9uKFtzdGF0dXMsXSBkYXRhWywgaGVhZGVycywgc3RhdHVzVGV4dF0pXG4gICAqICAgIHwgZnVuY3Rpb24oZnVuY3Rpb24obWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMpfWBcbiAgICogICAgw6LigqzigJwgVGhlIHJlc3BvbmQgbWV0aG9kIHRha2VzIGEgc2V0IG9mIHN0YXRpYyBkYXRhIHRvIGJlIHJldHVybmVkIG9yIGEgZnVuY3Rpb24gdGhhdCBjYW5cbiAgICogICAgcmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgcmVzcG9uc2Ugc3RhdHVzIChudW1iZXIpLCByZXNwb25zZSBkYXRhIChzdHJpbmcpLCByZXNwb25zZVxuICAgKiAgICBoZWFkZXJzIChPYmplY3QpLCBhbmQgdGhlIHRleHQgZm9yIHRoZSBzdGF0dXMgKHN0cmluZykuXG4gICAqL1xuICAkaHR0cEJhY2tlbmQuZXhwZWN0ID0gZnVuY3Rpb24obWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMpIHtcbiAgICB2YXIgZXhwZWN0YXRpb24gPSBuZXcgTW9ja0h0dHBFeHBlY3RhdGlvbihtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycyk7XG4gICAgZXhwZWN0YXRpb25zLnB1c2goZXhwZWN0YXRpb24pO1xuICAgIHJldHVybiB7XG4gICAgICByZXNwb25kOiBmdW5jdGlvbiAoc3RhdHVzLCBkYXRhLCBoZWFkZXJzLCBzdGF0dXNUZXh0KSB7XG4gICAgICAgIGV4cGVjdGF0aW9uLnJlc3BvbnNlID0gY3JlYXRlUmVzcG9uc2Uoc3RhdHVzLCBkYXRhLCBoZWFkZXJzLCBzdGF0dXNUZXh0KTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI2V4cGVjdEdFVFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIG5ldyByZXF1ZXN0IGV4cGVjdGF0aW9uIGZvciBHRVQgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGBleHBlY3QoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2wgaG93IGEgbWF0Y2hlZFxuICAgKiByZXF1ZXN0IGlzIGhhbmRsZWQuIFNlZSAjZXhwZWN0IGZvciBtb3JlIGluZm8uXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCNleHBlY3RIRUFEXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IHJlcXVlc3QgZXhwZWN0YXRpb24gZm9yIEhFQUQgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGBleHBlY3QoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2wgaG93IGEgbWF0Y2hlZFxuICAgKiAgIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI2V4cGVjdERFTEVURVxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIG5ldyByZXF1ZXN0IGV4cGVjdGF0aW9uIGZvciBERUxFVEUgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGBleHBlY3QoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2wgaG93IGEgbWF0Y2hlZFxuICAgKiAgIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI2V4cGVjdFBPU1RcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgcmVxdWVzdCBleHBlY3RhdGlvbiBmb3IgUE9TVCByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYGV4cGVjdCgpYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKXxPYmplY3QpPX0gZGF0YSBIVFRQIHJlcXVlc3QgYm9keSBvciBmdW5jdGlvbiB0aGF0XG4gICAqICByZWNlaXZlcyBkYXRhIHN0cmluZyBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBkYXRhIGlzIGFzIGV4cGVjdGVkLCBvciBPYmplY3QgaWYgcmVxdWVzdCBib2R5XG4gICAqICBpcyBpbiBKU09OIGZvcm1hdC5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAgICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBtZXRob2QgdGhhdCBjb250cm9sIGhvdyBhIG1hdGNoZWRcbiAgICogICByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCNleHBlY3RQVVRcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgcmVxdWVzdCBleHBlY3RhdGlvbiBmb3IgUFVUIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgZXhwZWN0KClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cHxmdW5jdGlvbihzdHJpbmcpfE9iamVjdCk9fSBkYXRhIEhUVFAgcmVxdWVzdCBib2R5IG9yIGZ1bmN0aW9uIHRoYXRcbiAgICogIHJlY2VpdmVzIGRhdGEgc3RyaW5nIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGRhdGEgaXMgYXMgZXhwZWN0ZWQsIG9yIE9iamVjdCBpZiByZXF1ZXN0IGJvZHlcbiAgICogIGlzIGluIEpTT04gZm9ybWF0LlxuICAgKiBAcGFyYW0ge09iamVjdD19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2wgaG93IGEgbWF0Y2hlZFxuICAgKiAgIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI2V4cGVjdFBBVENIXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IHJlcXVlc3QgZXhwZWN0YXRpb24gZm9yIFBBVENIIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgZXhwZWN0KClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cHxmdW5jdGlvbihzdHJpbmcpfE9iamVjdCk9fSBkYXRhIEhUVFAgcmVxdWVzdCBib2R5IG9yIGZ1bmN0aW9uIHRoYXRcbiAgICogIHJlY2VpdmVzIGRhdGEgc3RyaW5nIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGRhdGEgaXMgYXMgZXhwZWN0ZWQsIG9yIE9iamVjdCBpZiByZXF1ZXN0IGJvZHlcbiAgICogIGlzIGluIEpTT04gZm9ybWF0LlxuICAgKiBAcGFyYW0ge09iamVjdD19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2wgaG93IGEgbWF0Y2hlZFxuICAgKiAgIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI2V4cGVjdEpTT05QXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IHJlcXVlc3QgZXhwZWN0YXRpb24gZm9yIEpTT05QIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgZXhwZWN0KClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAgICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBtZXRob2QgdGhhdCBjb250cm9sIGhvdyBhIG1hdGNoZWRcbiAgICogICByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gICAqL1xuICBjcmVhdGVTaG9ydE1ldGhvZHMoJ2V4cGVjdCcpO1xuXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI2ZsdXNoXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBGbHVzaGVzIGFsbCBwZW5kaW5nIHJlcXVlc3RzIHVzaW5nIHRoZSB0cmFpbmVkIHJlc3BvbnNlcy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjb3VudCBOdW1iZXIgb2YgcmVzcG9uc2VzIHRvIGZsdXNoIChpbiB0aGUgb3JkZXIgdGhleSBhcnJpdmVkKS4gSWYgdW5kZWZpbmVkLFxuICAgKiAgIGFsbCBwZW5kaW5nIHJlcXVlc3RzIHdpbGwgYmUgZmx1c2hlZC4gSWYgdGhlcmUgYXJlIG5vIHBlbmRpbmcgcmVxdWVzdHMgd2hlbiB0aGUgZmx1c2ggbWV0aG9kXG4gICAqICAgaXMgY2FsbGVkIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gKGFzIHRoaXMgdHlwaWNhbGx5IGEgc2lnbiBvZiBwcm9ncmFtbWluZyBlcnJvcikuXG4gICAqL1xuICAkaHR0cEJhY2tlbmQuZmx1c2ggPSBmdW5jdGlvbihjb3VudCkge1xuICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xuICAgIGlmICghcmVzcG9uc2VzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdObyBwZW5kaW5nIHJlcXVlc3QgdG8gZmx1c2ggIScpO1xuXG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGNvdW50KSkge1xuICAgICAgd2hpbGUgKGNvdW50LS0pIHtcbiAgICAgICAgaWYgKCFyZXNwb25zZXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ05vIG1vcmUgcGVuZGluZyByZXF1ZXN0IHRvIGZsdXNoICEnKTtcbiAgICAgICAgcmVzcG9uc2VzLnNoaWZ0KCkoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKHJlc3BvbnNlcy5sZW5ndGgpIHtcbiAgICAgICAgcmVzcG9uc2VzLnNoaWZ0KCkoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgJGh0dHBCYWNrZW5kLnZlcmlmeU5vT3V0c3RhbmRpbmdFeHBlY3RhdGlvbigpO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI3ZlcmlmeU5vT3V0c3RhbmRpbmdFeHBlY3RhdGlvblxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVmVyaWZpZXMgdGhhdCBhbGwgb2YgdGhlIHJlcXVlc3RzIGRlZmluZWQgdmlhIHRoZSBgZXhwZWN0YCBhcGkgd2VyZSBtYWRlLiBJZiBhbnkgb2YgdGhlXG4gICAqIHJlcXVlc3RzIHdlcmUgbm90IG1hZGUsIHZlcmlmeU5vT3V0c3RhbmRpbmdFeHBlY3RhdGlvbiB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICAgKlxuICAgKiBUeXBpY2FsbHksIHlvdSB3b3VsZCBjYWxsIHRoaXMgbWV0aG9kIGZvbGxvd2luZyBlYWNoIHRlc3QgY2FzZSB0aGF0IGFzc2VydHMgcmVxdWVzdHMgdXNpbmcgYW5cbiAgICogXCJhZnRlckVhY2hcIiBjbGF1c2UuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqICAgYWZ0ZXJFYWNoKCRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nRXhwZWN0YXRpb24pO1xuICAgKiBgYGBcbiAgICovXG4gICRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nRXhwZWN0YXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAkcm9vdFNjb3BlLiRkaWdlc3QoKTtcbiAgICBpZiAoZXhwZWN0YXRpb25zLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnNhdGlzZmllZCByZXF1ZXN0czogJyArIGV4cGVjdGF0aW9ucy5qb2luKCcsICcpKTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjdmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3RcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFZlcmlmaWVzIHRoYXQgdGhlcmUgYXJlIG5vIG91dHN0YW5kaW5nIHJlcXVlc3RzIHRoYXQgbmVlZCB0byBiZSBmbHVzaGVkLlxuICAgKlxuICAgKiBUeXBpY2FsbHksIHlvdSB3b3VsZCBjYWxsIHRoaXMgbWV0aG9kIGZvbGxvd2luZyBlYWNoIHRlc3QgY2FzZSB0aGF0IGFzc2VydHMgcmVxdWVzdHMgdXNpbmcgYW5cbiAgICogXCJhZnRlckVhY2hcIiBjbGF1c2UuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqICAgYWZ0ZXJFYWNoKCRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCk7XG4gICAqIGBgYFxuICAgKi9cbiAgJGh0dHBCYWNrZW5kLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHJlc3BvbnNlcy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5mbHVzaGVkIHJlcXVlc3RzOiAnICsgcmVzcG9uc2VzLmxlbmd0aCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI3Jlc2V0RXhwZWN0YXRpb25zXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXNldHMgYWxsIHJlcXVlc3QgZXhwZWN0YXRpb25zLCBidXQgcHJlc2VydmVzIGFsbCBiYWNrZW5kIGRlZmluaXRpb25zLiBUeXBpY2FsbHksIHlvdSB3b3VsZFxuICAgKiBjYWxsIHJlc2V0RXhwZWN0YXRpb25zIGR1cmluZyBhIG11bHRpcGxlLXBoYXNlIHRlc3Qgd2hlbiB5b3Ugd2FudCB0byByZXVzZSB0aGUgc2FtZSBpbnN0YW5jZSBvZlxuICAgKiAkaHR0cEJhY2tlbmQgbW9jay5cbiAgICovXG4gICRodHRwQmFja2VuZC5yZXNldEV4cGVjdGF0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgIGV4cGVjdGF0aW9ucy5sZW5ndGggPSAwO1xuICAgIHJlc3BvbnNlcy5sZW5ndGggPSAwO1xuICB9O1xuXG4gIHJldHVybiAkaHR0cEJhY2tlbmQ7XG5cblxuICBmdW5jdGlvbiBjcmVhdGVTaG9ydE1ldGhvZHMocHJlZml4KSB7XG4gICAgYW5ndWxhci5mb3JFYWNoKFsnR0VUJywgJ0RFTEVURScsICdKU09OUCddLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgJGh0dHBCYWNrZW5kW3ByZWZpeCArIG1ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGhlYWRlcnMpIHtcbiAgICAgICByZXR1cm4gJGh0dHBCYWNrZW5kW3ByZWZpeF0obWV0aG9kLCB1cmwsIHVuZGVmaW5lZCwgaGVhZGVycyk7XG4gICAgIH07XG4gICAgfSk7XG5cbiAgICBhbmd1bGFyLmZvckVhY2goWydQVVQnLCAnUE9TVCcsICdQQVRDSCddLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICRodHRwQmFja2VuZFtwcmVmaXggKyBtZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBoZWFkZXJzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cEJhY2tlbmRbcHJlZml4XShtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIE1vY2tIdHRwRXhwZWN0YXRpb24obWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMpIHtcblxuICB0aGlzLmRhdGEgPSBkYXRhO1xuICB0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xuXG4gIHRoaXMubWF0Y2ggPSBmdW5jdGlvbihtLCB1LCBkLCBoKSB7XG4gICAgaWYgKG1ldGhvZCAhPSBtKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKCF0aGlzLm1hdGNoVXJsKHUpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGQpICYmICF0aGlzLm1hdGNoRGF0YShkKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChoKSAmJiAhdGhpcy5tYXRjaEhlYWRlcnMoaCkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICB0aGlzLm1hdGNoVXJsID0gZnVuY3Rpb24odSkge1xuICAgIGlmICghdXJsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHVybC50ZXN0KSkgcmV0dXJuIHVybC50ZXN0KHUpO1xuICAgIHJldHVybiB1cmwgPT0gdTtcbiAgfTtcblxuICB0aGlzLm1hdGNoSGVhZGVycyA9IGZ1bmN0aW9uKGgpIHtcbiAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChoZWFkZXJzKSkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihoZWFkZXJzKSkgcmV0dXJuIGhlYWRlcnMoaCk7XG4gICAgcmV0dXJuIGFuZ3VsYXIuZXF1YWxzKGhlYWRlcnMsIGgpO1xuICB9O1xuXG4gIHRoaXMubWF0Y2hEYXRhID0gZnVuY3Rpb24oZCkge1xuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGRhdGEpKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoZGF0YSAmJiBhbmd1bGFyLmlzRnVuY3Rpb24oZGF0YS50ZXN0KSkgcmV0dXJuIGRhdGEudGVzdChkKTtcbiAgICBpZiAoZGF0YSAmJiBhbmd1bGFyLmlzRnVuY3Rpb24oZGF0YSkpIHJldHVybiBkYXRhKGQpO1xuICAgIGlmIChkYXRhICYmICFhbmd1bGFyLmlzU3RyaW5nKGRhdGEpKSByZXR1cm4gYW5ndWxhci5lcXVhbHMoZGF0YSwgYW5ndWxhci5mcm9tSnNvbihkKSk7XG4gICAgcmV0dXJuIGRhdGEgPT0gZDtcbiAgfTtcblxuICB0aGlzLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG1ldGhvZCArICcgJyArIHVybDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTW9ja1hocigpIHtcbiAgcmV0dXJuIG5ldyBNb2NrWGhyKCk7XG59XG5cbmZ1bmN0aW9uIE1vY2tYaHIoKSB7XG5cbiAgLy8gaGFjayBmb3IgdGVzdGluZyAkaHR0cCwgJGh0dHBCYWNrZW5kXG4gIE1vY2tYaHIuJCRsYXN0SW5zdGFuY2UgPSB0aGlzO1xuXG4gIHRoaXMub3BlbiA9IGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBhc3luYykge1xuICAgIHRoaXMuJCRtZXRob2QgPSBtZXRob2Q7XG4gICAgdGhpcy4kJHVybCA9IHVybDtcbiAgICB0aGlzLiQkYXN5bmMgPSBhc3luYztcbiAgICB0aGlzLiQkcmVxSGVhZGVycyA9IHt9O1xuICAgIHRoaXMuJCRyZXNwSGVhZGVycyA9IHt9O1xuICB9O1xuXG4gIHRoaXMuc2VuZCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB0aGlzLiQkZGF0YSA9IGRhdGE7XG4gIH07XG5cbiAgdGhpcy5zZXRSZXF1ZXN0SGVhZGVyID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIHRoaXMuJCRyZXFIZWFkZXJzW2tleV0gPSB2YWx1ZTtcbiAgfTtcblxuICB0aGlzLmdldFJlc3BvbnNlSGVhZGVyID0gZnVuY3Rpb24obmFtZSkge1xuICAgIC8vIHRoZSBsb29rdXAgbXVzdCBiZSBjYXNlIGluc2Vuc2l0aXZlLFxuICAgIC8vIHRoYXQncyB3aHkgd2UgdHJ5IHR3byBxdWljayBsb29rdXBzIGZpcnN0IGFuZCBmdWxsIHNjYW4gbGFzdFxuICAgIHZhciBoZWFkZXIgPSB0aGlzLiQkcmVzcEhlYWRlcnNbbmFtZV07XG4gICAgaWYgKGhlYWRlcikgcmV0dXJuIGhlYWRlcjtcblxuICAgIG5hbWUgPSBhbmd1bGFyLmxvd2VyY2FzZShuYW1lKTtcbiAgICBoZWFkZXIgPSB0aGlzLiQkcmVzcEhlYWRlcnNbbmFtZV07XG4gICAgaWYgKGhlYWRlcikgcmV0dXJuIGhlYWRlcjtcblxuICAgIGhlYWRlciA9IHVuZGVmaW5lZDtcbiAgICBhbmd1bGFyLmZvckVhY2godGhpcy4kJHJlc3BIZWFkZXJzLCBmdW5jdGlvbihoZWFkZXJWYWwsIGhlYWRlck5hbWUpIHtcbiAgICAgIGlmICghaGVhZGVyICYmIGFuZ3VsYXIubG93ZXJjYXNlKGhlYWRlck5hbWUpID09IG5hbWUpIGhlYWRlciA9IGhlYWRlclZhbDtcbiAgICB9KTtcbiAgICByZXR1cm4gaGVhZGVyO1xuICB9O1xuXG4gIHRoaXMuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxpbmVzID0gW107XG5cbiAgICBhbmd1bGFyLmZvckVhY2godGhpcy4kJHJlc3BIZWFkZXJzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICBsaW5lcy5wdXNoKGtleSArICc6ICcgKyB2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICB9O1xuXG4gIHRoaXMuYWJvcnQgPSBhbmd1bGFyLm5vb3A7XG59XG5cblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJHRpbWVvdXRcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFRoaXMgc2VydmljZSBpcyBqdXN0IGEgc2ltcGxlIGRlY29yYXRvciBmb3Ige0BsaW5rIG5nLiR0aW1lb3V0ICR0aW1lb3V0fSBzZXJ2aWNlXG4gKiB0aGF0IGFkZHMgYSBcImZsdXNoXCIgYW5kIFwidmVyaWZ5Tm9QZW5kaW5nVGFza3NcIiBtZXRob2RzLlxuICovXG5cbmFuZ3VsYXIubW9jay4kVGltZW91dERlY29yYXRvciA9IGZ1bmN0aW9uKCRkZWxlZ2F0ZSwgJGJyb3dzZXIpIHtcblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkdGltZW91dCNmbHVzaFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICpcbiAgICogRmx1c2hlcyB0aGUgcXVldWUgb2YgcGVuZGluZyB0YXNrcy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBkZWxheSBtYXhpbXVtIHRpbWVvdXQgYW1vdW50IHRvIGZsdXNoIHVwIHVudGlsXG4gICAqL1xuICAkZGVsZWdhdGUuZmx1c2ggPSBmdW5jdGlvbihkZWxheSkge1xuICAgICRicm93c2VyLmRlZmVyLmZsdXNoKGRlbGF5KTtcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkdGltZW91dCN2ZXJpZnlOb1BlbmRpbmdUYXNrc1xuICAgKiBAZGVzY3JpcHRpb25cbiAgICpcbiAgICogVmVyaWZpZXMgdGhhdCB0aGVyZSBhcmUgbm8gcGVuZGluZyB0YXNrcyB0aGF0IG5lZWQgdG8gYmUgZmx1c2hlZC5cbiAgICovXG4gICRkZWxlZ2F0ZS52ZXJpZnlOb1BlbmRpbmdUYXNrcyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICgkYnJvd3Nlci5kZWZlcnJlZEZucy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRGVmZXJyZWQgdGFza3MgdG8gZmx1c2ggKCcgKyAkYnJvd3Nlci5kZWZlcnJlZEZucy5sZW5ndGggKyAnKTogJyArXG4gICAgICAgICAgZm9ybWF0UGVuZGluZ1Rhc2tzQXNTdHJpbmcoJGJyb3dzZXIuZGVmZXJyZWRGbnMpKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gZm9ybWF0UGVuZGluZ1Rhc2tzQXNTdHJpbmcodGFza3MpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgYW5ndWxhci5mb3JFYWNoKHRhc2tzLCBmdW5jdGlvbih0YXNrKSB7XG4gICAgICByZXN1bHQucHVzaCgne2lkOiAnICsgdGFzay5pZCArICcsICcgKyAndGltZTogJyArIHRhc2sudGltZSArICd9Jyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0LmpvaW4oJywgJyk7XG4gIH1cblxuICByZXR1cm4gJGRlbGVnYXRlO1xufTtcblxuYW5ndWxhci5tb2NrLiRSQUZEZWNvcmF0b3IgPSBmdW5jdGlvbigkZGVsZWdhdGUpIHtcbiAgdmFyIHF1ZXVlID0gW107XG4gIHZhciByYWZGbiA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIGluZGV4ID0gcXVldWUubGVuZ3RoO1xuICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHF1ZXVlLnNwbGljZShpbmRleCwgMSk7XG4gICAgfTtcbiAgfTtcblxuICByYWZGbi5zdXBwb3J0ZWQgPSAkZGVsZWdhdGUuc3VwcG9ydGVkO1xuXG4gIHJhZkZuLmZsdXNoID0gZnVuY3Rpb24oKSB7XG4gICAgaWYocXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHJBRiBjYWxsYmFja3MgcHJlc2VudCcpO1xuICAgIH1cblxuICAgIHZhciBsZW5ndGggPSBxdWV1ZS5sZW5ndGg7XG4gICAgZm9yKHZhciBpPTA7aTxsZW5ndGg7aSsrKSB7XG4gICAgICBxdWV1ZVtpXSgpO1xuICAgIH1cblxuICAgIHF1ZXVlID0gW107XG4gIH07XG5cbiAgcmV0dXJuIHJhZkZuO1xufTtcblxuYW5ndWxhci5tb2NrLiRBc3luY0NhbGxiYWNrRGVjb3JhdG9yID0gZnVuY3Rpb24oJGRlbGVnYXRlKSB7XG4gIHZhciBjYWxsYmFja3MgPSBbXTtcbiAgdmFyIGFkZEZuID0gZnVuY3Rpb24oZm4pIHtcbiAgICBjYWxsYmFja3MucHVzaChmbik7XG4gIH07XG4gIGFkZEZuLmZsdXNoID0gZnVuY3Rpb24oKSB7XG4gICAgYW5ndWxhci5mb3JFYWNoKGNhbGxiYWNrcywgZnVuY3Rpb24oZm4pIHtcbiAgICAgIGZuKCk7XG4gICAgfSk7XG4gICAgY2FsbGJhY2tzID0gW107XG4gIH07XG4gIHJldHVybiBhZGRGbjtcbn07XG5cbi8qKlxuICpcbiAqL1xuYW5ndWxhci5tb2NrLiRSb290RWxlbWVudFByb3ZpZGVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuJGdldCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBhbmd1bGFyLmVsZW1lbnQoJzxkaXYgbmctYXBwPjwvZGl2PicpO1xuICB9O1xufTtcblxuLyoqXG4gKiBAbmdkb2MgbW9kdWxlXG4gKiBAbmFtZSBuZ01vY2tcbiAqIEBwYWNrYWdlTmFtZSBhbmd1bGFyLW1vY2tzXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiAjIG5nTW9ja1xuICpcbiAqIFRoZSBgbmdNb2NrYCBtb2R1bGUgcHJvdmlkZXMgc3VwcG9ydCB0byBpbmplY3QgYW5kIG1vY2sgQW5ndWxhciBzZXJ2aWNlcyBpbnRvIHVuaXQgdGVzdHMuXG4gKiBJbiBhZGRpdGlvbiwgbmdNb2NrIGFsc28gZXh0ZW5kcyB2YXJpb3VzIGNvcmUgbmcgc2VydmljZXMgc3VjaCB0aGF0IHRoZXkgY2FuIGJlXG4gKiBpbnNwZWN0ZWQgYW5kIGNvbnRyb2xsZWQgaW4gYSBzeW5jaHJvbm91cyBtYW5uZXIgd2l0aGluIHRlc3QgY29kZS5cbiAqXG4gKlxuICogPGRpdiBkb2MtbW9kdWxlLWNvbXBvbmVudHM9XCJuZ01vY2tcIj48L2Rpdj5cbiAqXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCduZ01vY2snLCBbJ25nJ10pLnByb3ZpZGVyKHtcbiAgJGJyb3dzZXI6IGFuZ3VsYXIubW9jay4kQnJvd3NlclByb3ZpZGVyLFxuICAkZXhjZXB0aW9uSGFuZGxlcjogYW5ndWxhci5tb2NrLiRFeGNlcHRpb25IYW5kbGVyUHJvdmlkZXIsXG4gICRsb2c6IGFuZ3VsYXIubW9jay4kTG9nUHJvdmlkZXIsXG4gICRpbnRlcnZhbDogYW5ndWxhci5tb2NrLiRJbnRlcnZhbFByb3ZpZGVyLFxuICAkaHR0cEJhY2tlbmQ6IGFuZ3VsYXIubW9jay4kSHR0cEJhY2tlbmRQcm92aWRlcixcbiAgJHJvb3RFbGVtZW50OiBhbmd1bGFyLm1vY2suJFJvb3RFbGVtZW50UHJvdmlkZXJcbn0pLmNvbmZpZyhbJyRwcm92aWRlJywgZnVuY3Rpb24oJHByb3ZpZGUpIHtcbiAgJHByb3ZpZGUuZGVjb3JhdG9yKCckdGltZW91dCcsIGFuZ3VsYXIubW9jay4kVGltZW91dERlY29yYXRvcik7XG4gICRwcm92aWRlLmRlY29yYXRvcignJCRyQUYnLCBhbmd1bGFyLm1vY2suJFJBRkRlY29yYXRvcik7XG4gICRwcm92aWRlLmRlY29yYXRvcignJCRhc3luY0NhbGxiYWNrJywgYW5ndWxhci5tb2NrLiRBc3luY0NhbGxiYWNrRGVjb3JhdG9yKTtcbn1dKTtcblxuLyoqXG4gKiBAbmdkb2MgbW9kdWxlXG4gKiBAbmFtZSBuZ01vY2tFMkVcbiAqIEBtb2R1bGUgbmdNb2NrRTJFXG4gKiBAcGFja2FnZU5hbWUgYW5ndWxhci1tb2Nrc1xuICogQGRlc2NyaXB0aW9uXG4gKlxuICogVGhlIGBuZ01vY2tFMkVgIGlzIGFuIGFuZ3VsYXIgbW9kdWxlIHdoaWNoIGNvbnRhaW5zIG1vY2tzIHN1aXRhYmxlIGZvciBlbmQtdG8tZW5kIHRlc3RpbmcuXG4gKiBDdXJyZW50bHkgdGhlcmUgaXMgb25seSBvbmUgbW9jayBwcmVzZW50IGluIHRoaXMgbW9kdWxlIC1cbiAqIHRoZSB7QGxpbmsgbmdNb2NrRTJFLiRodHRwQmFja2VuZCBlMmUgJGh0dHBCYWNrZW5kfSBtb2NrLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnbmdNb2NrRTJFJywgWyduZyddKS5jb25maWcoWyckcHJvdmlkZScsIGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICRwcm92aWRlLmRlY29yYXRvcignJGh0dHBCYWNrZW5kJywgYW5ndWxhci5tb2NrLmUyZS4kaHR0cEJhY2tlbmREZWNvcmF0b3IpO1xufV0pO1xuXG4vKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSAkaHR0cEJhY2tlbmRcbiAqIEBtb2R1bGUgbmdNb2NrRTJFXG4gKiBAZGVzY3JpcHRpb25cbiAqIEZha2UgSFRUUCBiYWNrZW5kIGltcGxlbWVudGF0aW9uIHN1aXRhYmxlIGZvciBlbmQtdG8tZW5kIHRlc3Rpbmcgb3IgYmFja2VuZC1sZXNzIGRldmVsb3BtZW50IG9mXG4gKiBhcHBsaWNhdGlvbnMgdGhhdCB1c2UgdGhlIHtAbGluayBuZy4kaHR0cCAkaHR0cCBzZXJ2aWNlfS5cbiAqXG4gKiAqTm90ZSo6IEZvciBmYWtlIGh0dHAgYmFja2VuZCBpbXBsZW1lbnRhdGlvbiBzdWl0YWJsZSBmb3IgdW5pdCB0ZXN0aW5nIHBsZWFzZSBzZWVcbiAqIHtAbGluayBuZ01vY2suJGh0dHBCYWNrZW5kIHVuaXQtdGVzdGluZyAkaHR0cEJhY2tlbmQgbW9ja30uXG4gKlxuICogVGhpcyBpbXBsZW1lbnRhdGlvbiBjYW4gYmUgdXNlZCB0byByZXNwb25kIHdpdGggc3RhdGljIG9yIGR5bmFtaWMgcmVzcG9uc2VzIHZpYSB0aGUgYHdoZW5gIGFwaVxuICogYW5kIGl0cyBzaG9ydGN1dHMgKGB3aGVuR0VUYCwgYHdoZW5QT1NUYCwgZXRjKSBhbmQgb3B0aW9uYWxseSBwYXNzIHRocm91Z2ggcmVxdWVzdHMgdG8gdGhlXG4gKiByZWFsICRodHRwQmFja2VuZCBmb3Igc3BlY2lmaWMgcmVxdWVzdHMgKGUuZy4gdG8gaW50ZXJhY3Qgd2l0aCBjZXJ0YWluIHJlbW90ZSBhcGlzIG9yIHRvIGZldGNoXG4gKiB0ZW1wbGF0ZXMgZnJvbSBhIHdlYnNlcnZlcikuXG4gKlxuICogQXMgb3Bwb3NlZCB0byB1bml0LXRlc3RpbmcsIGluIGFuIGVuZC10by1lbmQgdGVzdGluZyBzY2VuYXJpbyBvciBpbiBzY2VuYXJpbyB3aGVuIGFuIGFwcGxpY2F0aW9uXG4gKiBpcyBiZWluZyBkZXZlbG9wZWQgd2l0aCB0aGUgcmVhbCBiYWNrZW5kIGFwaSByZXBsYWNlZCB3aXRoIGEgbW9jaywgaXQgaXMgb2Z0ZW4gZGVzaXJhYmxlIGZvclxuICogY2VydGFpbiBjYXRlZ29yeSBvZiByZXF1ZXN0cyB0byBieXBhc3MgdGhlIG1vY2sgYW5kIGlzc3VlIGEgcmVhbCBodHRwIHJlcXVlc3QgKGUuZy4gdG8gZmV0Y2hcbiAqIHRlbXBsYXRlcyBvciBzdGF0aWMgZmlsZXMgZnJvbSB0aGUgd2Vic2VydmVyKS4gVG8gY29uZmlndXJlIHRoZSBiYWNrZW5kIHdpdGggdGhpcyBiZWhhdmlvclxuICogdXNlIHRoZSBgcGFzc1Rocm91Z2hgIHJlcXVlc3QgaGFuZGxlciBvZiBgd2hlbmAgaW5zdGVhZCBvZiBgcmVzcG9uZGAuXG4gKlxuICogQWRkaXRpb25hbGx5LCB3ZSBkb24ndCB3YW50IHRvIG1hbnVhbGx5IGhhdmUgdG8gZmx1c2ggbW9ja2VkIG91dCByZXF1ZXN0cyBsaWtlIHdlIGRvIGR1cmluZyB1bml0XG4gKiB0ZXN0aW5nLiBGb3IgdGhpcyByZWFzb24gdGhlIGUyZSAkaHR0cEJhY2tlbmQgZmx1c2hlcyBtb2NrZWQgb3V0IHJlcXVlc3RzXG4gKiBhdXRvbWF0aWNhbGx5LCBjbG9zZWx5IHNpbXVsYXRpbmcgdGhlIGJlaGF2aW9yIG9mIHRoZSBYTUxIdHRwUmVxdWVzdCBvYmplY3QuXG4gKlxuICogVG8gc2V0dXAgdGhlIGFwcGxpY2F0aW9uIHRvIHJ1biB3aXRoIHRoaXMgaHR0cCBiYWNrZW5kLCB5b3UgaGF2ZSB0byBjcmVhdGUgYSBtb2R1bGUgdGhhdCBkZXBlbmRzXG4gKiBvbiB0aGUgYG5nTW9ja0UyRWAgYW5kIHlvdXIgYXBwbGljYXRpb24gbW9kdWxlcyBhbmQgZGVmaW5lcyB0aGUgZmFrZSBiYWNrZW5kOlxuICpcbiAqIGBgYGpzXG4gKiAgIG15QXBwRGV2ID0gYW5ndWxhci5tb2R1bGUoJ215QXBwRGV2JywgWydteUFwcCcsICduZ01vY2tFMkUnXSk7XG4gKiAgIG15QXBwRGV2LnJ1bihmdW5jdGlvbigkaHR0cEJhY2tlbmQpIHtcbiAqICAgICBwaG9uZXMgPSBbe25hbWU6ICdwaG9uZTEnfSwge25hbWU6ICdwaG9uZTInfV07XG4gKlxuICogICAgIC8vIHJldHVybnMgdGhlIGN1cnJlbnQgbGlzdCBvZiBwaG9uZXNcbiAqICAgICAkaHR0cEJhY2tlbmQud2hlbkdFVCgnL3Bob25lcycpLnJlc3BvbmQocGhvbmVzKTtcbiAqXG4gKiAgICAgLy8gYWRkcyBhIG5ldyBwaG9uZSB0byB0aGUgcGhvbmVzIGFycmF5XG4gKiAgICAgJGh0dHBCYWNrZW5kLndoZW5QT1NUKCcvcGhvbmVzJykucmVzcG9uZChmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSkge1xuICogICAgICAgdmFyIHBob25lID0gYW5ndWxhci5mcm9tSnNvbihkYXRhKTtcbiAqICAgICAgIHBob25lcy5wdXNoKHBob25lKTtcbiAqICAgICAgIHJldHVybiBbMjAwLCBwaG9uZSwge31dO1xuICogICAgIH0pO1xuICogICAgICRodHRwQmFja2VuZC53aGVuR0VUKC9eXFwvdGVtcGxhdGVzXFwvLykucGFzc1Rocm91Z2goKTtcbiAqICAgICAvLy4uLlxuICogICB9KTtcbiAqIGBgYFxuICpcbiAqIEFmdGVyd2FyZHMsIGJvb3RzdHJhcCB5b3VyIGFwcCB3aXRoIHRoaXMgbmV3IG1vZHVsZS5cbiAqL1xuXG4vKipcbiAqIEBuZ2RvYyBtZXRob2RcbiAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuXG4gKiBAbW9kdWxlIG5nTW9ja0UyRVxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIEhUVFAgbWV0aG9kLlxuICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwKT19IGRhdGEgSFRUUCByZXF1ZXN0IGJvZHkuXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycyBvciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGh0dHAgaGVhZGVyXG4gKiAgIG9iamVjdCBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBoZWFkZXJzIG1hdGNoIHRoZSBjdXJyZW50IGRlZmluaXRpb24uXG4gKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIGFuZCBgcGFzc1Rocm91Z2hgIG1ldGhvZHMgdGhhdFxuICogICBjb250cm9sIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICpcbiAqICAtIHJlc3BvbmQgw6LigqzigJxcbiAqICAgIGB7ZnVuY3Rpb24oW3N0YXR1cyxdIGRhdGFbLCBoZWFkZXJzLCBzdGF0dXNUZXh0XSlcbiAqICAgIHwgZnVuY3Rpb24oZnVuY3Rpb24obWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMpfWBcbiAqICAgIMOi4oKs4oCcIFRoZSByZXNwb25kIG1ldGhvZCB0YWtlcyBhIHNldCBvZiBzdGF0aWMgZGF0YSB0byBiZSByZXR1cm5lZCBvciBhIGZ1bmN0aW9uIHRoYXQgY2FuIHJldHVyblxuICogICAgYW4gYXJyYXkgY29udGFpbmluZyByZXNwb25zZSBzdGF0dXMgKG51bWJlciksIHJlc3BvbnNlIGRhdGEgKHN0cmluZyksIHJlc3BvbnNlIGhlYWRlcnNcbiAqICAgIChPYmplY3QpLCBhbmQgdGhlIHRleHQgZm9yIHRoZSBzdGF0dXMgKHN0cmluZykuXG4gKiAgLSBwYXNzVGhyb3VnaCDDouKCrOKAnCBge2Z1bmN0aW9uKCl9YCDDouKCrOKAnCBBbnkgcmVxdWVzdCBtYXRjaGluZyBhIGJhY2tlbmQgZGVmaW5pdGlvbiB3aXRoXG4gKiAgICBgcGFzc1Rocm91Z2hgIGhhbmRsZXIgd2lsbCBiZSBwYXNzZWQgdGhyb3VnaCB0byB0aGUgcmVhbCBiYWNrZW5kIChhbiBYSFIgcmVxdWVzdCB3aWxsIGJlIG1hZGVcbiAqICAgIHRvIHRoZSBzZXJ2ZXIuKVxuICovXG5cbi8qKlxuICogQG5nZG9jIG1ldGhvZFxuICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5HRVRcbiAqIEBtb2R1bGUgbmdNb2NrRTJFXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBHRVQgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGB3aGVuKClgLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKE9iamVjdCkpPX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIGFuZCBgcGFzc1Rocm91Z2hgIG1ldGhvZHMgdGhhdFxuICogICBjb250cm9sIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICovXG5cbi8qKlxuICogQG5nZG9jIG1ldGhvZFxuICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5IRUFEXG4gKiBAbW9kdWxlIG5nTW9ja0UyRVxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiBmb3IgSEVBRCByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgYW5kIGBwYXNzVGhyb3VnaGAgbWV0aG9kcyB0aGF0XG4gKiAgIGNvbnRyb2wgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gKi9cblxuLyoqXG4gKiBAbmdkb2MgbWV0aG9kXG4gKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlbkRFTEVURVxuICogQG1vZHVsZSBuZ01vY2tFMkVcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhIG5ldyBiYWNrZW5kIGRlZmluaXRpb24gZm9yIERFTEVURSByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgYW5kIGBwYXNzVGhyb3VnaGAgbWV0aG9kcyB0aGF0XG4gKiAgIGNvbnRyb2wgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gKi9cblxuLyoqXG4gKiBAbmdkb2MgbWV0aG9kXG4gKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlblBPU1RcbiAqIEBtb2R1bGUgbmdNb2NrRTJFXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBQT1NUIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgd2hlbigpYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApPX0gZGF0YSBIVFRQIHJlcXVlc3QgYm9keS5cbiAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbihPYmplY3QpKT19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBhbmQgYHBhc3NUaHJvdWdoYCBtZXRob2RzIHRoYXRcbiAqICAgY29udHJvbCBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAqL1xuXG4vKipcbiAqIEBuZ2RvYyBtZXRob2RcbiAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuUFVUXG4gKiBAbW9kdWxlIG5nTW9ja0UyRVxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiBmb3IgUFVUIHJlcXVlc3RzLiAgRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwKT19IGRhdGEgSFRUUCByZXF1ZXN0IGJvZHkuXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgYW5kIGBwYXNzVGhyb3VnaGAgbWV0aG9kcyB0aGF0XG4gKiAgIGNvbnRyb2wgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gKi9cblxuLyoqXG4gKiBAbmdkb2MgbWV0aG9kXG4gKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlblBBVENIXG4gKiBAbW9kdWxlIG5nTW9ja0UyRVxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiBmb3IgUEFUQ0ggcmVxdWVzdHMuICBGb3IgbW9yZSBpbmZvIHNlZSBgd2hlbigpYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApPX0gZGF0YSBIVFRQIHJlcXVlc3QgYm9keS5cbiAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbihPYmplY3QpKT19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBhbmQgYHBhc3NUaHJvdWdoYCBtZXRob2RzIHRoYXRcbiAqICAgY29udHJvbCBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAqL1xuXG4vKipcbiAqIEBuZ2RvYyBtZXRob2RcbiAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuSlNPTlBcbiAqIEBtb2R1bGUgbmdNb2NrRTJFXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBKU09OUCByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIGFuZCBgcGFzc1Rocm91Z2hgIG1ldGhvZHMgdGhhdFxuICogICBjb250cm9sIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICovXG5hbmd1bGFyLm1vY2suZTJlID0ge307XG5hbmd1bGFyLm1vY2suZTJlLiRodHRwQmFja2VuZERlY29yYXRvciA9XG4gIFsnJHJvb3RTY29wZScsICckZGVsZWdhdGUnLCAnJGJyb3dzZXInLCBjcmVhdGVIdHRwQmFja2VuZE1vY2tdO1xuXG5cbmFuZ3VsYXIubW9jay5jbGVhckRhdGFDYWNoZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIga2V5LFxuICAgICAgY2FjaGUgPSBhbmd1bGFyLmVsZW1lbnQuY2FjaGU7XG5cbiAgZm9yKGtleSBpbiBjYWNoZSkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY2FjaGUsa2V5KSkge1xuICAgICAgdmFyIGhhbmRsZSA9IGNhY2hlW2tleV0uaGFuZGxlO1xuXG4gICAgICBoYW5kbGUgJiYgYW5ndWxhci5lbGVtZW50KGhhbmRsZS5lbGVtKS5vZmYoKTtcbiAgICAgIGRlbGV0ZSBjYWNoZVtrZXldO1xuICAgIH1cbiAgfVxufTtcblxuXG5pZih3aW5kb3cuamFzbWluZSB8fCB3aW5kb3cubW9jaGEpIHtcblxuICB2YXIgY3VycmVudFNwZWMgPSBudWxsLFxuICAgICAgaXNTcGVjUnVubmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gISFjdXJyZW50U3BlYztcbiAgICAgIH07XG5cblxuICAod2luZG93LmJlZm9yZUVhY2ggfHwgd2luZG93LnNldHVwKShmdW5jdGlvbigpIHtcbiAgICBjdXJyZW50U3BlYyA9IHRoaXM7XG4gIH0pO1xuXG4gICh3aW5kb3cuYWZ0ZXJFYWNoIHx8IHdpbmRvdy50ZWFyZG93bikoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluamVjdG9yID0gY3VycmVudFNwZWMuJGluamVjdG9yO1xuXG4gICAgYW5ndWxhci5mb3JFYWNoKGN1cnJlbnRTcGVjLiRtb2R1bGVzLCBmdW5jdGlvbihtb2R1bGUpIHtcbiAgICAgIGlmIChtb2R1bGUgJiYgbW9kdWxlLiQkaGFzaEtleSkge1xuICAgICAgICBtb2R1bGUuJCRoYXNoS2V5ID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY3VycmVudFNwZWMuJGluamVjdG9yID0gbnVsbDtcbiAgICBjdXJyZW50U3BlYy4kbW9kdWxlcyA9IG51bGw7XG4gICAgY3VycmVudFNwZWMgPSBudWxsO1xuXG4gICAgaWYgKGluamVjdG9yKSB7XG4gICAgICBpbmplY3Rvci5nZXQoJyRyb290RWxlbWVudCcpLm9mZigpO1xuICAgICAgaW5qZWN0b3IuZ2V0KCckYnJvd3NlcicpLnBvbGxGbnMubGVuZ3RoID0gMDtcbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vY2suY2xlYXJEYXRhQ2FjaGUoKTtcblxuICAgIC8vIGNsZWFuIHVwIGpxdWVyeSdzIGZyYWdtZW50IGNhY2hlXG4gICAgYW5ndWxhci5mb3JFYWNoKGFuZ3VsYXIuZWxlbWVudC5mcmFnbWVudHMsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICBkZWxldGUgYW5ndWxhci5lbGVtZW50LmZyYWdtZW50c1trZXldO1xuICAgIH0pO1xuXG4gICAgTW9ja1hoci4kJGxhc3RJbnN0YW5jZSA9IG51bGw7XG5cbiAgICBhbmd1bGFyLmZvckVhY2goYW5ndWxhci5jYWxsYmFja3MsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICBkZWxldGUgYW5ndWxhci5jYWxsYmFja3Nba2V5XTtcbiAgICB9KTtcbiAgICBhbmd1bGFyLmNhbGxiYWNrcy5jb3VudGVyID0gMDtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSBhbmd1bGFyLm1vY2subW9kdWxlXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKlxuICAgKiAqTk9URSo6IFRoaXMgZnVuY3Rpb24gaXMgYWxzbyBwdWJsaXNoZWQgb24gd2luZG93IGZvciBlYXN5IGFjY2Vzcy48YnI+XG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gcmVnaXN0ZXJzIGEgbW9kdWxlIGNvbmZpZ3VyYXRpb24gY29kZS4gSXQgY29sbGVjdHMgdGhlIGNvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25cbiAgICogd2hpY2ggd2lsbCBiZSB1c2VkIHdoZW4gdGhlIGluamVjdG9yIGlzIGNyZWF0ZWQgYnkge0BsaW5rIGFuZ3VsYXIubW9jay5pbmplY3QgaW5qZWN0fS5cbiAgICpcbiAgICogU2VlIHtAbGluayBhbmd1bGFyLm1vY2suaW5qZWN0IGluamVjdH0gZm9yIHVzYWdlIGV4YW1wbGVcbiAgICpcbiAgICogQHBhcmFtIHsuLi4oc3RyaW5nfEZ1bmN0aW9ufE9iamVjdCl9IGZucyBhbnkgbnVtYmVyIG9mIG1vZHVsZXMgd2hpY2ggYXJlIHJlcHJlc2VudGVkIGFzIHN0cmluZ1xuICAgKiAgICAgICAgYWxpYXNlcyBvciBhcyBhbm9ueW1vdXMgbW9kdWxlIGluaXRpYWxpemF0aW9uIGZ1bmN0aW9ucy4gVGhlIG1vZHVsZXMgYXJlIHVzZWQgdG9cbiAgICogICAgICAgIGNvbmZpZ3VyZSB0aGUgaW5qZWN0b3IuIFRoZSAnbmcnIGFuZCAnbmdNb2NrJyBtb2R1bGVzIGFyZSBhdXRvbWF0aWNhbGx5IGxvYWRlZC4gSWYgYW5cbiAgICogICAgICAgIG9iamVjdCBsaXRlcmFsIGlzIHBhc3NlZCB0aGV5IHdpbGwgYmUgcmVnaXN0ZXJlZCBhcyB2YWx1ZXMgaW4gdGhlIG1vZHVsZSwgdGhlIGtleSBiZWluZ1xuICAgKiAgICAgICAgdGhlIG1vZHVsZSBuYW1lIGFuZCB0aGUgdmFsdWUgYmVpbmcgd2hhdCBpcyByZXR1cm5lZC5cbiAgICovXG4gIHdpbmRvdy5tb2R1bGUgPSBhbmd1bGFyLm1vY2subW9kdWxlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1vZHVsZUZucyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgcmV0dXJuIGlzU3BlY1J1bm5pbmcoKSA/IHdvcmtGbigpIDogd29ya0ZuO1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIGZ1bmN0aW9uIHdvcmtGbigpIHtcbiAgICAgIGlmIChjdXJyZW50U3BlYy4kaW5qZWN0b3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmplY3RvciBhbHJlYWR5IGNyZWF0ZWQsIGNhbiBub3QgcmVnaXN0ZXIgYSBtb2R1bGUhJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbW9kdWxlcyA9IGN1cnJlbnRTcGVjLiRtb2R1bGVzIHx8IChjdXJyZW50U3BlYy4kbW9kdWxlcyA9IFtdKTtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKG1vZHVsZUZucywgZnVuY3Rpb24obW9kdWxlKSB7XG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QobW9kdWxlKSAmJiAhYW5ndWxhci5pc0FycmF5KG1vZHVsZSkpIHtcbiAgICAgICAgICAgIG1vZHVsZXMucHVzaChmdW5jdGlvbigkcHJvdmlkZSkge1xuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobW9kdWxlLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgJHByb3ZpZGUudmFsdWUoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1vZHVsZXMucHVzaChtb2R1bGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgYW5ndWxhci5tb2NrLmluamVjdFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICpcbiAgICogKk5PVEUqOiBUaGlzIGZ1bmN0aW9uIGlzIGFsc28gcHVibGlzaGVkIG9uIHdpbmRvdyBmb3IgZWFzeSBhY2Nlc3MuPGJyPlxuICAgKlxuICAgKiBUaGUgaW5qZWN0IGZ1bmN0aW9uIHdyYXBzIGEgZnVuY3Rpb24gaW50byBhbiBpbmplY3RhYmxlIGZ1bmN0aW9uLiBUaGUgaW5qZWN0KCkgY3JlYXRlcyBuZXdcbiAgICogaW5zdGFuY2Ugb2Yge0BsaW5rIGF1dG8uJGluamVjdG9yICRpbmplY3Rvcn0gcGVyIHRlc3QsIHdoaWNoIGlzIHRoZW4gdXNlZCBmb3JcbiAgICogcmVzb2x2aW5nIHJlZmVyZW5jZXMuXG4gICAqXG4gICAqXG4gICAqICMjIFJlc29sdmluZyBSZWZlcmVuY2VzIChVbmRlcnNjb3JlIFdyYXBwaW5nKVxuICAgKiBPZnRlbiwgd2Ugd291bGQgbGlrZSB0byBpbmplY3QgYSByZWZlcmVuY2Ugb25jZSwgaW4gYSBgYmVmb3JlRWFjaCgpYCBibG9jayBhbmQgcmV1c2UgdGhpc1xuICAgKiBpbiBtdWx0aXBsZSBgaXQoKWAgY2xhdXNlcy4gVG8gYmUgYWJsZSB0byBkbyB0aGlzIHdlIG11c3QgYXNzaWduIHRoZSByZWZlcmVuY2UgdG8gYSB2YXJpYWJsZVxuICAgKiB0aGF0IGlzIGRlY2xhcmVkIGluIHRoZSBzY29wZSBvZiB0aGUgYGRlc2NyaWJlKClgIGJsb2NrLiBTaW5jZSB3ZSB3b3VsZCwgbW9zdCBsaWtlbHksIHdhbnRcbiAgICogdGhlIHZhcmlhYmxlIHRvIGhhdmUgdGhlIHNhbWUgbmFtZSBvZiB0aGUgcmVmZXJlbmNlIHdlIGhhdmUgYSBwcm9ibGVtLCBzaW5jZSB0aGUgcGFyYW1ldGVyXG4gICAqIHRvIHRoZSBgaW5qZWN0KClgIGZ1bmN0aW9uIHdvdWxkIGhpZGUgdGhlIG91dGVyIHZhcmlhYmxlLlxuICAgKlxuICAgKiBUbyBoZWxwIHdpdGggdGhpcywgdGhlIGluamVjdGVkIHBhcmFtZXRlcnMgY2FuLCBvcHRpb25hbGx5LCBiZSBlbmNsb3NlZCB3aXRoIHVuZGVyc2NvcmVzLlxuICAgKiBUaGVzZSBhcmUgaWdub3JlZCBieSB0aGUgaW5qZWN0b3Igd2hlbiB0aGUgcmVmZXJlbmNlIG5hbWUgaXMgcmVzb2x2ZWQuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCB0aGUgcGFyYW1ldGVyIGBfbXlTZXJ2aWNlX2Agd291bGQgYmUgcmVzb2x2ZWQgYXMgdGhlIHJlZmVyZW5jZSBgbXlTZXJ2aWNlYC5cbiAgICogU2luY2UgaXQgaXMgYXZhaWxhYmxlIGluIHRoZSBmdW5jdGlvbiBib2R5IGFzIF9teVNlcnZpY2VfLCB3ZSBjYW4gdGhlbiBhc3NpZ24gaXQgdG8gYSB2YXJpYWJsZVxuICAgKiBkZWZpbmVkIGluIGFuIG91dGVyIHNjb3BlLlxuICAgKlxuICAgKiBgYGBcbiAgICogLy8gRGVmaW5lZCBvdXQgcmVmZXJlbmNlIHZhcmlhYmxlIG91dHNpZGVcbiAgICogdmFyIG15U2VydmljZTtcbiAgICpcbiAgICogLy8gV3JhcCB0aGUgcGFyYW1ldGVyIGluIHVuZGVyc2NvcmVzXG4gICAqIGJlZm9yZUVhY2goIGluamVjdCggZnVuY3Rpb24oX215U2VydmljZV8pe1xuICAgKiAgIG15U2VydmljZSA9IF9teVNlcnZpY2VfO1xuICAgKiB9KSk7XG4gICAqXG4gICAqIC8vIFVzZSBteVNlcnZpY2UgaW4gYSBzZXJpZXMgb2YgdGVzdHMuXG4gICAqIGl0KCdtYWtlcyB1c2Ugb2YgbXlTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAqICAgbXlTZXJ2aWNlLmRvU3R1ZmYoKTtcbiAgICogfSk7XG4gICAqXG4gICAqIGBgYFxuICAgKlxuICAgKiBTZWUgYWxzbyB7QGxpbmsgYW5ndWxhci5tb2NrLm1vZHVsZSBhbmd1bGFyLm1vY2subW9kdWxlfVxuICAgKlxuICAgKiAjIyBFeGFtcGxlXG4gICAqIEV4YW1wbGUgb2Ygd2hhdCBhIHR5cGljYWwgamFzbWluZSB0ZXN0cyBsb29rcyBsaWtlIHdpdGggdGhlIGluamVjdCBtZXRob2QuXG4gICAqIGBgYGpzXG4gICAqXG4gICAqICAgYW5ndWxhci5tb2R1bGUoJ215QXBwbGljYXRpb25Nb2R1bGUnLCBbXSlcbiAgICogICAgICAgLnZhbHVlKCdtb2RlJywgJ2FwcCcpXG4gICAqICAgICAgIC52YWx1ZSgndmVyc2lvbicsICd2MS4wLjEnKTtcbiAgICpcbiAgICpcbiAgICogICBkZXNjcmliZSgnTXlBcHAnLCBmdW5jdGlvbigpIHtcbiAgICpcbiAgICogICAgIC8vIFlvdSBuZWVkIHRvIGxvYWQgbW9kdWxlcyB0aGF0IHlvdSB3YW50IHRvIHRlc3QsXG4gICAqICAgICAvLyBpdCBsb2FkcyBvbmx5IHRoZSBcIm5nXCIgbW9kdWxlIGJ5IGRlZmF1bHQuXG4gICAqICAgICBiZWZvcmVFYWNoKG1vZHVsZSgnbXlBcHBsaWNhdGlvbk1vZHVsZScpKTtcbiAgICpcbiAgICpcbiAgICogICAgIC8vIGluamVjdCgpIGlzIHVzZWQgdG8gaW5qZWN0IGFyZ3VtZW50cyBvZiBhbGwgZ2l2ZW4gZnVuY3Rpb25zXG4gICAqICAgICBpdCgnc2hvdWxkIHByb3ZpZGUgYSB2ZXJzaW9uJywgaW5qZWN0KGZ1bmN0aW9uKG1vZGUsIHZlcnNpb24pIHtcbiAgICogICAgICAgZXhwZWN0KHZlcnNpb24pLnRvRXF1YWwoJ3YxLjAuMScpO1xuICAgKiAgICAgICBleHBlY3QobW9kZSkudG9FcXVhbCgnYXBwJyk7XG4gICAqICAgICB9KSk7XG4gICAqXG4gICAqXG4gICAqICAgICAvLyBUaGUgaW5qZWN0IGFuZCBtb2R1bGUgbWV0aG9kIGNhbiBhbHNvIGJlIHVzZWQgaW5zaWRlIG9mIHRoZSBpdCBvciBiZWZvcmVFYWNoXG4gICAqICAgICBpdCgnc2hvdWxkIG92ZXJyaWRlIGEgdmVyc2lvbiBhbmQgdGVzdCB0aGUgbmV3IHZlcnNpb24gaXMgaW5qZWN0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICogICAgICAgLy8gbW9kdWxlKCkgdGFrZXMgZnVuY3Rpb25zIG9yIHN0cmluZ3MgKG1vZHVsZSBhbGlhc2VzKVxuICAgKiAgICAgICBtb2R1bGUoZnVuY3Rpb24oJHByb3ZpZGUpIHtcbiAgICogICAgICAgICAkcHJvdmlkZS52YWx1ZSgndmVyc2lvbicsICdvdmVycmlkZGVuJyk7IC8vIG92ZXJyaWRlIHZlcnNpb24gaGVyZVxuICAgKiAgICAgICB9KTtcbiAgICpcbiAgICogICAgICAgaW5qZWN0KGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgICogICAgICAgICBleHBlY3QodmVyc2lvbikudG9FcXVhbCgnb3ZlcnJpZGRlbicpO1xuICAgKiAgICAgICB9KTtcbiAgICogICAgIH0pO1xuICAgKiAgIH0pO1xuICAgKlxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZm5zIGFueSBudW1iZXIgb2YgZnVuY3Rpb25zIHdoaWNoIHdpbGwgYmUgaW5qZWN0ZWQgdXNpbmcgdGhlIGluamVjdG9yLlxuICAgKi9cblxuXG5cbiAgdmFyIEVycm9yQWRkaW5nRGVjbGFyYXRpb25Mb2NhdGlvblN0YWNrID0gZnVuY3Rpb24oZSwgZXJyb3JGb3JTdGFjaykge1xuICAgIHRoaXMubWVzc2FnZSA9IGUubWVzc2FnZTtcbiAgICB0aGlzLm5hbWUgPSBlLm5hbWU7XG4gICAgaWYgKGUubGluZSkgdGhpcy5saW5lID0gZS5saW5lO1xuICAgIGlmIChlLnNvdXJjZUlkKSB0aGlzLnNvdXJjZUlkID0gZS5zb3VyY2VJZDtcbiAgICBpZiAoZS5zdGFjayAmJiBlcnJvckZvclN0YWNrKVxuICAgICAgdGhpcy5zdGFjayA9IGUuc3RhY2sgKyAnXFxuJyArIGVycm9yRm9yU3RhY2suc3RhY2s7XG4gICAgaWYgKGUuc3RhY2tBcnJheSkgdGhpcy5zdGFja0FycmF5ID0gZS5zdGFja0FycmF5O1xuICB9O1xuICBFcnJvckFkZGluZ0RlY2xhcmF0aW9uTG9jYXRpb25TdGFjay5wcm90b3R5cGUudG9TdHJpbmcgPSBFcnJvci5wcm90b3R5cGUudG9TdHJpbmc7XG5cbiAgd2luZG93LmluamVjdCA9IGFuZ3VsYXIubW9jay5pbmplY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYmxvY2tGbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgIHZhciBlcnJvckZvclN0YWNrID0gbmV3IEVycm9yKCdEZWNsYXJhdGlvbiBMb2NhdGlvbicpO1xuICAgIHJldHVybiBpc1NwZWNSdW5uaW5nKCkgPyB3b3JrRm4uY2FsbChjdXJyZW50U3BlYykgOiB3b3JrRm47XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgZnVuY3Rpb24gd29ya0ZuKCkge1xuICAgICAgdmFyIG1vZHVsZXMgPSBjdXJyZW50U3BlYy4kbW9kdWxlcyB8fCBbXTtcblxuICAgICAgbW9kdWxlcy51bnNoaWZ0KCduZ01vY2snKTtcbiAgICAgIG1vZHVsZXMudW5zaGlmdCgnbmcnKTtcbiAgICAgIHZhciBpbmplY3RvciA9IGN1cnJlbnRTcGVjLiRpbmplY3RvcjtcbiAgICAgIGlmICghaW5qZWN0b3IpIHtcbiAgICAgICAgaW5qZWN0b3IgPSBjdXJyZW50U3BlYy4kaW5qZWN0b3IgPSBhbmd1bGFyLmluamVjdG9yKG1vZHVsZXMpO1xuICAgICAgfVxuICAgICAgZm9yKHZhciBpID0gMCwgaWkgPSBibG9ja0Zucy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLyoganNoaW50IC1XMDQwICovLyogSmFzbWluZSBleHBsaWNpdGx5IHByb3ZpZGVzIGEgYHRoaXNgIG9iamVjdCB3aGVuIGNhbGxpbmcgZnVuY3Rpb25zICovXG4gICAgICAgICAgaW5qZWN0b3IuaW52b2tlKGJsb2NrRm5zW2ldIHx8IGFuZ3VsYXIubm9vcCwgdGhpcyk7XG4gICAgICAgICAgLyoganNoaW50ICtXMDQwICovXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBpZiAoZS5zdGFjayAmJiBlcnJvckZvclN0YWNrKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3JBZGRpbmdEZWNsYXJhdGlvbkxvY2F0aW9uU3RhY2soZSwgZXJyb3JGb3JTdGFjayk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgZXJyb3JGb3JTdGFjayA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cblxufSkod2luZG93LCB3aW5kb3cuYW5ndWxhcik7Il19
