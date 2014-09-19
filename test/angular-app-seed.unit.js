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
    expect(scope.hi).toEqual('Hi Johnny');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pY29sYXMvYmlyZC9hbmd1bGFyLWFwcC1hdXRvbWF0aW9uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9hcHAudW5pdC5qcyIsIi9ob21lL25pY29sYXMvYmlyZC9hbmd1bGFyLWFwcC1zZWVkL25vZGVfbW9kdWxlcy9hbmd1bGFyLW1vY2tzL2FuZ3VsYXItbW9ja3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJ2FuZ3VsYXItbW9ja3MnKTsgLy8gZXh0ZW5kIGFuZ3VsYXIgd2l0aCBhIG1vY2sgcHJvcGVydHlcblxuZGVzY3JpYmUoJ1VuaXQ6IFNlZWRDb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XG4gIGJlZm9yZUVhY2goYW5ndWxhci5tb2NrLm1vZHVsZSgnU2VlZEFwcCcpKTtcblxuICB2YXIgY3RybCwgc2NvcGU7XG4gIC8vIGluamVjdCB0aGUgJGNvbnRyb2xsZXIgYW5kICRyb290U2NvcGUgc2VydmljZXMgaW4gdGhlIGJlZm9yZUVhY2ggYmxvY2tcbiAgYmVmb3JlRWFjaChhbmd1bGFyLm1vY2suaW5qZWN0KGZ1bmN0aW9uKCRjb250cm9sbGVyLCAkcm9vdFNjb3BlKSB7XG4gICAgLy8gQ3JlYXRlIGEgbmV3IHNjb3BlIHRoYXQncyBhIGNoaWxkIG9mIHRoZSAkcm9vdFNjb3BlXG4gICAgc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcbiAgICAvLyBDcmVhdGUgdGhlIGNvbnRyb2xsZXJcbiAgICBjdHJsID0gJGNvbnRyb2xsZXIoJ1NlZWRDb250cm9sbGVyJywgeyAkc2NvcGU6IHNjb3BlIH0pO1xuICB9KSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgJHNjb3BlLmhpIHdoZW4gY2FsbGluZyBzYXlIaScsIGZ1bmN0aW9uKCkge1xuICAgIGV4cGVjdChzY29wZS5oaSkudG9CZVVuZGVmaW5lZCgpO1xuICAgIHNjb3BlLnNheUhpKCk7XG4gICAgZXhwZWN0KHNjb3BlLmhpKS50b0VxdWFsKCdIaSBKb2hubnknKTtcbiAgfSk7XG59KTtcbiIsIi8qKlxuICogQGxpY2Vuc2UgQW5ndWxhckpTIHYxLjIuMjJcbiAqIChjKSAyMDEwLTIwMTQgR29vZ2xlLCBJbmMuIGh0dHA6Ly9hbmd1bGFyanMub3JnXG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgYW5ndWxhciwgdW5kZWZpbmVkKSB7XG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmdkb2Mgb2JqZWN0XG4gKiBAbmFtZSBhbmd1bGFyLm1vY2tcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIE5hbWVzcGFjZSBmcm9tICdhbmd1bGFyLW1vY2tzLmpzJyB3aGljaCBjb250YWlucyB0ZXN0aW5nIHJlbGF0ZWQgY29kZS5cbiAqL1xuYW5ndWxhci5tb2NrID0ge307XG5cbi8qKlxuICogISBUaGlzIGlzIGEgcHJpdmF0ZSB1bmRvY3VtZW50ZWQgc2VydmljZSAhXG4gKlxuICogQG5hbWUgJGJyb3dzZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoaXMgc2VydmljZSBpcyBhIG1vY2sgaW1wbGVtZW50YXRpb24gb2Yge0BsaW5rIG5nLiRicm93c2VyfS4gSXQgcHJvdmlkZXMgZmFrZVxuICogaW1wbGVtZW50YXRpb24gZm9yIGNvbW1vbmx5IHVzZWQgYnJvd3NlciBhcGlzIHRoYXQgYXJlIGhhcmQgdG8gdGVzdCwgZS5nLiBzZXRUaW1lb3V0LCB4aHIsXG4gKiBjb29raWVzLCBldGMuLi5cbiAqXG4gKiBUaGUgYXBpIG9mIHRoaXMgc2VydmljZSBpcyB0aGUgc2FtZSBhcyB0aGF0IG9mIHRoZSByZWFsIHtAbGluayBuZy4kYnJvd3NlciAkYnJvd3Nlcn0sIGV4Y2VwdFxuICogdGhhdCB0aGVyZSBhcmUgc2V2ZXJhbCBoZWxwZXIgbWV0aG9kcyBhdmFpbGFibGUgd2hpY2ggY2FuIGJlIHVzZWQgaW4gdGVzdHMuXG4gKi9cbmFuZ3VsYXIubW9jay4kQnJvd3NlclByb3ZpZGVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuJGdldCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgYW5ndWxhci5tb2NrLiRCcm93c2VyKCk7XG4gIH07XG59O1xuXG5hbmd1bGFyLm1vY2suJEJyb3dzZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHRoaXMuaXNNb2NrID0gdHJ1ZTtcbiAgc2VsZi4kJHVybCA9IFwiaHR0cDovL3NlcnZlci9cIjtcbiAgc2VsZi4kJGxhc3RVcmwgPSBzZWxmLiQkdXJsOyAvLyB1c2VkIGJ5IHVybCBwb2xsaW5nIGZuXG4gIHNlbGYucG9sbEZucyA9IFtdO1xuXG4gIC8vIFRPRE8odm9qdGEpOiByZW1vdmUgdGhpcyB0ZW1wb3JhcnkgYXBpXG4gIHNlbGYuJCRjb21wbGV0ZU91dHN0YW5kaW5nUmVxdWVzdCA9IGFuZ3VsYXIubm9vcDtcbiAgc2VsZi4kJGluY091dHN0YW5kaW5nUmVxdWVzdENvdW50ID0gYW5ndWxhci5ub29wO1xuXG5cbiAgLy8gcmVnaXN0ZXIgdXJsIHBvbGxpbmcgZm5cblxuICBzZWxmLm9uVXJsQ2hhbmdlID0gZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICBzZWxmLnBvbGxGbnMucHVzaChcbiAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoc2VsZi4kJGxhc3RVcmwgIT0gc2VsZi4kJHVybCkge1xuICAgICAgICAgIHNlbGYuJCRsYXN0VXJsID0gc2VsZi4kJHVybDtcbiAgICAgICAgICBsaXN0ZW5lcihzZWxmLiQkdXJsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG5cbiAgICByZXR1cm4gbGlzdGVuZXI7XG4gIH07XG5cbiAgc2VsZi5jb29raWVIYXNoID0ge307XG4gIHNlbGYubGFzdENvb2tpZUhhc2ggPSB7fTtcbiAgc2VsZi5kZWZlcnJlZEZucyA9IFtdO1xuICBzZWxmLmRlZmVycmVkTmV4dElkID0gMDtcblxuICBzZWxmLmRlZmVyID0gZnVuY3Rpb24oZm4sIGRlbGF5KSB7XG4gICAgZGVsYXkgPSBkZWxheSB8fCAwO1xuICAgIHNlbGYuZGVmZXJyZWRGbnMucHVzaCh7dGltZTooc2VsZi5kZWZlci5ub3cgKyBkZWxheSksIGZuOmZuLCBpZDogc2VsZi5kZWZlcnJlZE5leHRJZH0pO1xuICAgIHNlbGYuZGVmZXJyZWRGbnMuc29ydChmdW5jdGlvbihhLGIpeyByZXR1cm4gYS50aW1lIC0gYi50aW1lO30pO1xuICAgIHJldHVybiBzZWxmLmRlZmVycmVkTmV4dElkKys7XG4gIH07XG5cblxuICAvKipcbiAgICogQG5hbWUgJGJyb3dzZXIjZGVmZXIubm93XG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDdXJyZW50IG1pbGxpc2Vjb25kcyBtb2NrIHRpbWUuXG4gICAqL1xuICBzZWxmLmRlZmVyLm5vdyA9IDA7XG5cblxuICBzZWxmLmRlZmVyLmNhbmNlbCA9IGZ1bmN0aW9uKGRlZmVySWQpIHtcbiAgICB2YXIgZm5JbmRleDtcblxuICAgIGFuZ3VsYXIuZm9yRWFjaChzZWxmLmRlZmVycmVkRm5zLCBmdW5jdGlvbihmbiwgaW5kZXgpIHtcbiAgICAgIGlmIChmbi5pZCA9PT0gZGVmZXJJZCkgZm5JbmRleCA9IGluZGV4O1xuICAgIH0pO1xuXG4gICAgaWYgKGZuSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgc2VsZi5kZWZlcnJlZEZucy5zcGxpY2UoZm5JbmRleCwgMSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cblxuICAvKipcbiAgICogQG5hbWUgJGJyb3dzZXIjZGVmZXIuZmx1c2hcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEZsdXNoZXMgYWxsIHBlbmRpbmcgcmVxdWVzdHMgYW5kIGV4ZWN1dGVzIHRoZSBkZWZlciBjYWxsYmFja3MuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBmbHVzaC4gU2VlIHtAbGluayAjZGVmZXIubm93fVxuICAgKi9cbiAgc2VsZi5kZWZlci5mbHVzaCA9IGZ1bmN0aW9uKGRlbGF5KSB7XG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGRlbGF5KSkge1xuICAgICAgc2VsZi5kZWZlci5ub3cgKz0gZGVsYXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzZWxmLmRlZmVycmVkRm5zLmxlbmd0aCkge1xuICAgICAgICBzZWxmLmRlZmVyLm5vdyA9IHNlbGYuZGVmZXJyZWRGbnNbc2VsZi5kZWZlcnJlZEZucy5sZW5ndGgtMV0udGltZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZGVmZXJyZWQgdGFza3MgdG8gYmUgZmx1c2hlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdoaWxlIChzZWxmLmRlZmVycmVkRm5zLmxlbmd0aCAmJiBzZWxmLmRlZmVycmVkRm5zWzBdLnRpbWUgPD0gc2VsZi5kZWZlci5ub3cpIHtcbiAgICAgIHNlbGYuZGVmZXJyZWRGbnMuc2hpZnQoKS5mbigpO1xuICAgIH1cbiAgfTtcblxuICBzZWxmLiQkYmFzZUhyZWYgPSAnJztcbiAgc2VsZi5iYXNlSHJlZiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiQkYmFzZUhyZWY7XG4gIH07XG59O1xuYW5ndWxhci5tb2NrLiRCcm93c2VyLnByb3RvdHlwZSA9IHtcblxuLyoqXG4gICogQG5hbWUgJGJyb3dzZXIjcG9sbFxuICAqXG4gICogQGRlc2NyaXB0aW9uXG4gICogcnVuIGFsbCBmbnMgaW4gcG9sbEZuc1xuICAqL1xuICBwb2xsOiBmdW5jdGlvbiBwb2xsKCkge1xuICAgIGFuZ3VsYXIuZm9yRWFjaCh0aGlzLnBvbGxGbnMsIGZ1bmN0aW9uKHBvbGxGbil7XG4gICAgICBwb2xsRm4oKTtcbiAgICB9KTtcbiAgfSxcblxuICBhZGRQb2xsRm46IGZ1bmN0aW9uKHBvbGxGbikge1xuICAgIHRoaXMucG9sbEZucy5wdXNoKHBvbGxGbik7XG4gICAgcmV0dXJuIHBvbGxGbjtcbiAgfSxcblxuICB1cmw6IGZ1bmN0aW9uKHVybCwgcmVwbGFjZSkge1xuICAgIGlmICh1cmwpIHtcbiAgICAgIHRoaXMuJCR1cmwgPSB1cmw7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kJHVybDtcbiAgfSxcblxuICBjb29raWVzOiAgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmNvb2tpZUhhc2hbbmFtZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyh2YWx1ZSkgJiYgICAgICAgLy9zdHJpbmdzIG9ubHlcbiAgICAgICAgICAgIHZhbHVlLmxlbmd0aCA8PSA0MDk2KSB7ICAgICAgICAgIC8vc3RyaWN0IGNvb2tpZSBzdG9yYWdlIGxpbWl0c1xuICAgICAgICAgIHRoaXMuY29va2llSGFzaFtuYW1lXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghYW5ndWxhci5lcXVhbHModGhpcy5jb29raWVIYXNoLCB0aGlzLmxhc3RDb29raWVIYXNoKSkge1xuICAgICAgICB0aGlzLmxhc3RDb29raWVIYXNoID0gYW5ndWxhci5jb3B5KHRoaXMuY29va2llSGFzaCk7XG4gICAgICAgIHRoaXMuY29va2llSGFzaCA9IGFuZ3VsYXIuY29weSh0aGlzLmNvb2tpZUhhc2gpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuY29va2llSGFzaDtcbiAgICB9XG4gIH0sXG5cbiAgbm90aWZ5V2hlbk5vT3V0c3RhbmRpbmdSZXF1ZXN0czogZnVuY3Rpb24oZm4pIHtcbiAgICBmbigpO1xuICB9XG59O1xuXG5cbi8qKlxuICogQG5nZG9jIHByb3ZpZGVyXG4gKiBAbmFtZSAkZXhjZXB0aW9uSGFuZGxlclByb3ZpZGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDb25maWd1cmVzIHRoZSBtb2NrIGltcGxlbWVudGF0aW9uIG9mIHtAbGluayBuZy4kZXhjZXB0aW9uSGFuZGxlcn0gdG8gcmV0aHJvdyBvciB0byBsb2cgZXJyb3JzXG4gKiBwYXNzZWQgaW50byB0aGUgYCRleGNlcHRpb25IYW5kbGVyYC5cbiAqL1xuXG4vKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSAkZXhjZXB0aW9uSGFuZGxlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogTW9jayBpbXBsZW1lbnRhdGlvbiBvZiB7QGxpbmsgbmcuJGV4Y2VwdGlvbkhhbmRsZXJ9IHRoYXQgcmV0aHJvd3Mgb3IgbG9ncyBlcnJvcnMgcGFzc2VkXG4gKiBpbnRvIGl0LiBTZWUge0BsaW5rIG5nTW9jay4kZXhjZXB0aW9uSGFuZGxlclByb3ZpZGVyICRleGNlcHRpb25IYW5kbGVyUHJvdmlkZXJ9IGZvciBjb25maWd1cmF0aW9uXG4gKiBpbmZvcm1hdGlvbi5cbiAqXG4gKlxuICogYGBganNcbiAqICAgZGVzY3JpYmUoJyRleGNlcHRpb25IYW5kbGVyUHJvdmlkZXInLCBmdW5jdGlvbigpIHtcbiAqXG4gKiAgICAgaXQoJ3Nob3VsZCBjYXB0dXJlIGxvZyBtZXNzYWdlcyBhbmQgZXhjZXB0aW9ucycsIGZ1bmN0aW9uKCkge1xuICpcbiAqICAgICAgIG1vZHVsZShmdW5jdGlvbigkZXhjZXB0aW9uSGFuZGxlclByb3ZpZGVyKSB7XG4gKiAgICAgICAgICRleGNlcHRpb25IYW5kbGVyUHJvdmlkZXIubW9kZSgnbG9nJyk7XG4gKiAgICAgICB9KTtcbiAqXG4gKiAgICAgICBpbmplY3QoZnVuY3Rpb24oJGxvZywgJGV4Y2VwdGlvbkhhbmRsZXIsICR0aW1lb3V0KSB7XG4gKiAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkgeyAkbG9nLmxvZygxKTsgfSk7XG4gKiAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkgeyAkbG9nLmxvZygyKTsgdGhyb3cgJ2JhbmFuYSBwZWVsJzsgfSk7XG4gKiAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkgeyAkbG9nLmxvZygzKTsgfSk7XG4gKiAgICAgICAgIGV4cGVjdCgkZXhjZXB0aW9uSGFuZGxlci5lcnJvcnMpLnRvRXF1YWwoW10pO1xuICogICAgICAgICBleHBlY3QoJGxvZy5hc3NlcnRFbXB0eSgpKTtcbiAqICAgICAgICAgJHRpbWVvdXQuZmx1c2goKTtcbiAqICAgICAgICAgZXhwZWN0KCRleGNlcHRpb25IYW5kbGVyLmVycm9ycykudG9FcXVhbChbJ2JhbmFuYSBwZWVsJ10pO1xuICogICAgICAgICBleHBlY3QoJGxvZy5sb2cubG9ncykudG9FcXVhbChbWzFdLCBbMl0sIFszXV0pO1xuICogICAgICAgfSk7XG4gKiAgICAgfSk7XG4gKiAgIH0pO1xuICogYGBgXG4gKi9cblxuYW5ndWxhci5tb2NrLiRFeGNlcHRpb25IYW5kbGVyUHJvdmlkZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhhbmRsZXI7XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlciNtb2RlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTZXRzIHRoZSBsb2dnaW5nIG1vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RlIE1vZGUgb2Ygb3BlcmF0aW9uLCBkZWZhdWx0cyB0byBgcmV0aHJvd2AuXG4gICAqXG4gICAqICAgLSBgcmV0aHJvd2A6IElmIGFueSBlcnJvcnMgYXJlIHBhc3NlZCBpbnRvIHRoZSBoYW5kbGVyIGluIHRlc3RzLCBpdCB0eXBpY2FsbHlcbiAgICogICAgICAgICAgICAgICAgbWVhbnMgdGhhdCB0aGVyZSBpcyBhIGJ1ZyBpbiB0aGUgYXBwbGljYXRpb24gb3IgdGVzdCwgc28gdGhpcyBtb2NrIHdpbGxcbiAgICogICAgICAgICAgICAgICAgbWFrZSB0aGVzZSB0ZXN0cyBmYWlsLlxuICAgKiAgIC0gYGxvZ2A6IFNvbWV0aW1lcyBpdCBpcyBkZXNpcmFibGUgdG8gdGVzdCB0aGF0IGFuIGVycm9yIGlzIHRocm93biwgZm9yIHRoaXMgY2FzZSB0aGUgYGxvZ2BcbiAgICogICAgICAgICAgICBtb2RlIHN0b3JlcyBhbiBhcnJheSBvZiBlcnJvcnMgaW4gYCRleGNlcHRpb25IYW5kbGVyLmVycm9yc2AsIHRvIGFsbG93IGxhdGVyXG4gICAqICAgICAgICAgICAgYXNzZXJ0aW9uIG9mIHRoZW0uIFNlZSB7QGxpbmsgbmdNb2NrLiRsb2cjYXNzZXJ0RW1wdHkgYXNzZXJ0RW1wdHkoKX0gYW5kXG4gICAqICAgICAgICAgICAge0BsaW5rIG5nTW9jay4kbG9nI3Jlc2V0IHJlc2V0KCl9XG4gICAqL1xuICB0aGlzLm1vZGUgPSBmdW5jdGlvbihtb2RlKSB7XG4gICAgc3dpdGNoKG1vZGUpIHtcbiAgICAgIGNhc2UgJ3JldGhyb3cnOlxuICAgICAgICBoYW5kbGVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbG9nJzpcbiAgICAgICAgdmFyIGVycm9ycyA9IFtdO1xuXG4gICAgICAgIGhhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgZXJyb3JzLnB1c2goZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGhhbmRsZXIuZXJyb3JzID0gZXJyb3JzO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gbW9kZSAnXCIgKyBtb2RlICsgXCInLCBvbmx5ICdsb2cnLydyZXRocm93JyBtb2RlcyBhcmUgYWxsb3dlZCFcIik7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuJGdldCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBoYW5kbGVyO1xuICB9O1xuXG4gIHRoaXMubW9kZSgncmV0aHJvdycpO1xufTtcblxuXG4vKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSAkbG9nXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBNb2NrIGltcGxlbWVudGF0aW9uIG9mIHtAbGluayBuZy4kbG9nfSB0aGF0IGdhdGhlcnMgYWxsIGxvZ2dlZCBtZXNzYWdlcyBpbiBhcnJheXNcbiAqIChvbmUgYXJyYXkgcGVyIGxvZ2dpbmcgbGV2ZWwpLiBUaGVzZSBhcnJheXMgYXJlIGV4cG9zZWQgYXMgYGxvZ3NgIHByb3BlcnR5IG9mIGVhY2ggb2YgdGhlXG4gKiBsZXZlbC1zcGVjaWZpYyBsb2cgZnVuY3Rpb24sIGUuZy4gZm9yIGxldmVsIGBlcnJvcmAgdGhlIGFycmF5IGlzIGV4cG9zZWQgYXMgYCRsb2cuZXJyb3IubG9nc2AuXG4gKlxuICovXG5hbmd1bGFyLm1vY2suJExvZ1Byb3ZpZGVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWJ1ZyA9IHRydWU7XG5cbiAgZnVuY3Rpb24gY29uY2F0KGFycmF5MSwgYXJyYXkyLCBpbmRleCkge1xuICAgIHJldHVybiBhcnJheTEuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycmF5MiwgaW5kZXgpKTtcbiAgfVxuXG4gIHRoaXMuZGVidWdFbmFibGVkID0gZnVuY3Rpb24oZmxhZykge1xuICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChmbGFnKSkge1xuICAgICAgZGVidWcgPSBmbGFnO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkZWJ1ZztcbiAgICB9XG4gIH07XG5cbiAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkbG9nID0ge1xuICAgICAgbG9nOiBmdW5jdGlvbigpIHsgJGxvZy5sb2cubG9ncy5wdXNoKGNvbmNhdChbXSwgYXJndW1lbnRzLCAwKSk7IH0sXG4gICAgICB3YXJuOiBmdW5jdGlvbigpIHsgJGxvZy53YXJuLmxvZ3MucHVzaChjb25jYXQoW10sIGFyZ3VtZW50cywgMCkpOyB9LFxuICAgICAgaW5mbzogZnVuY3Rpb24oKSB7ICRsb2cuaW5mby5sb2dzLnB1c2goY29uY2F0KFtdLCBhcmd1bWVudHMsIDApKTsgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbigpIHsgJGxvZy5lcnJvci5sb2dzLnB1c2goY29uY2F0KFtdLCBhcmd1bWVudHMsIDApKTsgfSxcbiAgICAgIGRlYnVnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRlYnVnKSB7XG4gICAgICAgICAgJGxvZy5kZWJ1Zy5sb2dzLnB1c2goY29uY2F0KFtdLCBhcmd1bWVudHMsIDApKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICogQG5hbWUgJGxvZyNyZXNldFxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVzZXQgYWxsIG9mIHRoZSBsb2dnaW5nIGFycmF5cyB0byBlbXB0eS5cbiAgICAgKi9cbiAgICAkbG9nLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgLyoqXG4gICAgICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICAgICAqIEBuYW1lICRsb2cjbG9nLmxvZ3NcbiAgICAgICAqXG4gICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAqIEFycmF5IG9mIG1lc3NhZ2VzIGxvZ2dlZCB1c2luZyB7QGxpbmsgbmdNb2NrLiRsb2cjbG9nfS5cbiAgICAgICAqXG4gICAgICAgKiBAZXhhbXBsZVxuICAgICAgICogYGBganNcbiAgICAgICAqICRsb2cubG9nKCdTb21lIExvZycpO1xuICAgICAgICogdmFyIGZpcnN0ID0gJGxvZy5sb2cubG9ncy51bnNoaWZ0KCk7XG4gICAgICAgKiBgYGBcbiAgICAgICAqL1xuICAgICAgJGxvZy5sb2cubG9ncyA9IFtdO1xuICAgICAgLyoqXG4gICAgICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICAgICAqIEBuYW1lICRsb2cjaW5mby5sb2dzXG4gICAgICAgKlxuICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgKiBBcnJheSBvZiBtZXNzYWdlcyBsb2dnZWQgdXNpbmcge0BsaW5rIG5nTW9jay4kbG9nI2luZm99LlxuICAgICAgICpcbiAgICAgICAqIEBleGFtcGxlXG4gICAgICAgKiBgYGBqc1xuICAgICAgICogJGxvZy5pbmZvKCdTb21lIEluZm8nKTtcbiAgICAgICAqIHZhciBmaXJzdCA9ICRsb2cuaW5mby5sb2dzLnVuc2hpZnQoKTtcbiAgICAgICAqIGBgYFxuICAgICAgICovXG4gICAgICAkbG9nLmluZm8ubG9ncyA9IFtdO1xuICAgICAgLyoqXG4gICAgICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICAgICAqIEBuYW1lICRsb2cjd2Fybi5sb2dzXG4gICAgICAgKlxuICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgKiBBcnJheSBvZiBtZXNzYWdlcyBsb2dnZWQgdXNpbmcge0BsaW5rIG5nTW9jay4kbG9nI3dhcm59LlxuICAgICAgICpcbiAgICAgICAqIEBleGFtcGxlXG4gICAgICAgKiBgYGBqc1xuICAgICAgICogJGxvZy53YXJuKCdTb21lIFdhcm5pbmcnKTtcbiAgICAgICAqIHZhciBmaXJzdCA9ICRsb2cud2Fybi5sb2dzLnVuc2hpZnQoKTtcbiAgICAgICAqIGBgYFxuICAgICAgICovXG4gICAgICAkbG9nLndhcm4ubG9ncyA9IFtdO1xuICAgICAgLyoqXG4gICAgICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICAgICAqIEBuYW1lICRsb2cjZXJyb3IubG9nc1xuICAgICAgICpcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICogQXJyYXkgb2YgbWVzc2FnZXMgbG9nZ2VkIHVzaW5nIHtAbGluayBuZ01vY2suJGxvZyNlcnJvcn0uXG4gICAgICAgKlxuICAgICAgICogQGV4YW1wbGVcbiAgICAgICAqIGBgYGpzXG4gICAgICAgKiAkbG9nLmVycm9yKCdTb21lIEVycm9yJyk7XG4gICAgICAgKiB2YXIgZmlyc3QgPSAkbG9nLmVycm9yLmxvZ3MudW5zaGlmdCgpO1xuICAgICAgICogYGBgXG4gICAgICAgKi9cbiAgICAgICRsb2cuZXJyb3IubG9ncyA9IFtdO1xuICAgICAgICAvKipcbiAgICAgICAqIEBuZ2RvYyBwcm9wZXJ0eVxuICAgICAgICogQG5hbWUgJGxvZyNkZWJ1Zy5sb2dzXG4gICAgICAgKlxuICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgKiBBcnJheSBvZiBtZXNzYWdlcyBsb2dnZWQgdXNpbmcge0BsaW5rIG5nTW9jay4kbG9nI2RlYnVnfS5cbiAgICAgICAqXG4gICAgICAgKiBAZXhhbXBsZVxuICAgICAgICogYGBganNcbiAgICAgICAqICRsb2cuZGVidWcoJ1NvbWUgRXJyb3InKTtcbiAgICAgICAqIHZhciBmaXJzdCA9ICRsb2cuZGVidWcubG9ncy51bnNoaWZ0KCk7XG4gICAgICAgKiBgYGBcbiAgICAgICAqL1xuICAgICAgJGxvZy5kZWJ1Zy5sb2dzID0gW107XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgKiBAbmFtZSAkbG9nI2Fzc2VydEVtcHR5XG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBBc3NlcnQgdGhhdCB0aGUgYWxsIG9mIHRoZSBsb2dnaW5nIG1ldGhvZHMgaGF2ZSBubyBsb2dnZWQgbWVzc2FnZXMuIElmIG1lc3NhZ2VzIHByZXNlbnQsIGFuXG4gICAgICogZXhjZXB0aW9uIGlzIHRocm93bi5cbiAgICAgKi9cbiAgICAkbG9nLmFzc2VydEVtcHR5ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZXJyb3JzID0gW107XG4gICAgICBhbmd1bGFyLmZvckVhY2goWydlcnJvcicsICd3YXJuJywgJ2luZm8nLCAnbG9nJywgJ2RlYnVnJ10sIGZ1bmN0aW9uKGxvZ0xldmVsKSB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkbG9nW2xvZ0xldmVsXS5sb2dzLCBmdW5jdGlvbihsb2cpIHtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobG9nLCBmdW5jdGlvbiAobG9nSXRlbSkge1xuICAgICAgICAgICAgZXJyb3JzLnB1c2goJ01PQ0sgJGxvZyAoJyArIGxvZ0xldmVsICsgJyk6ICcgKyBTdHJpbmcobG9nSXRlbSkgKyAnXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAobG9nSXRlbS5zdGFjayB8fCAnJykpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgZXJyb3JzLnVuc2hpZnQoXCJFeHBlY3RlZCAkbG9nIHRvIGJlIGVtcHR5ISBFaXRoZXIgYSBtZXNzYWdlIHdhcyBsb2dnZWQgdW5leHBlY3RlZGx5LCBvciBcIitcbiAgICAgICAgICBcImFuIGV4cGVjdGVkIGxvZyBtZXNzYWdlIHdhcyBub3QgY2hlY2tlZCBhbmQgcmVtb3ZlZDpcIik7XG4gICAgICAgIGVycm9ycy5wdXNoKCcnKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9ycy5qb2luKCdcXG4tLS0tLS0tLS1cXG4nKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgICRsb2cucmVzZXQoKTtcbiAgICByZXR1cm4gJGxvZztcbiAgfTtcbn07XG5cblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJGludGVydmFsXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBNb2NrIGltcGxlbWVudGF0aW9uIG9mIHRoZSAkaW50ZXJ2YWwgc2VydmljZS5cbiAqXG4gKiBVc2Uge0BsaW5rIG5nTW9jay4kaW50ZXJ2YWwjZmx1c2ggYCRpbnRlcnZhbC5mbHVzaChtaWxsaXMpYH0gdG9cbiAqIG1vdmUgZm9yd2FyZCBieSBgbWlsbGlzYCBtaWxsaXNlY29uZHMgYW5kIHRyaWdnZXIgYW55IGZ1bmN0aW9ucyBzY2hlZHVsZWQgdG8gcnVuIGluIHRoYXRcbiAqIHRpbWUuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbigpfSBmbiBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCByZXBlYXRlZGx5LlxuICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5IE51bWJlciBvZiBtaWxsaXNlY29uZHMgYmV0d2VlbiBlYWNoIGZ1bmN0aW9uIGNhbGwuXG4gKiBAcGFyYW0ge251bWJlcj19IFtjb3VudD0wXSBOdW1iZXIgb2YgdGltZXMgdG8gcmVwZWF0LiBJZiBub3Qgc2V0LCBvciAwLCB3aWxsIHJlcGVhdFxuICogICBpbmRlZmluaXRlbHkuXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSBbaW52b2tlQXBwbHk9dHJ1ZV0gSWYgc2V0IHRvIGBmYWxzZWAgc2tpcHMgbW9kZWwgZGlydHkgY2hlY2tpbmcsIG90aGVyd2lzZVxuICogICB3aWxsIGludm9rZSBgZm5gIHdpdGhpbiB0aGUge0BsaW5rIG5nLiRyb290U2NvcGUuU2NvcGUjJGFwcGx5ICRhcHBseX0gYmxvY2suXG4gKiBAcmV0dXJucyB7cHJvbWlzZX0gQSBwcm9taXNlIHdoaWNoIHdpbGwgYmUgbm90aWZpZWQgb24gZWFjaCBpdGVyYXRpb24uXG4gKi9cbmFuZ3VsYXIubW9jay4kSW50ZXJ2YWxQcm92aWRlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLiRnZXQgPSBbJyRyb290U2NvcGUnLCAnJHEnLFxuICAgICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICAgJHEpIHtcbiAgICB2YXIgcmVwZWF0Rm5zID0gW10sXG4gICAgICAgIG5leHRSZXBlYXRJZCA9IDAsXG4gICAgICAgIG5vdyA9IDA7XG5cbiAgICB2YXIgJGludGVydmFsID0gZnVuY3Rpb24oZm4sIGRlbGF5LCBjb3VudCwgaW52b2tlQXBwbHkpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCksXG4gICAgICAgICAgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2UsXG4gICAgICAgICAgaXRlcmF0aW9uID0gMCxcbiAgICAgICAgICBza2lwQXBwbHkgPSAoYW5ndWxhci5pc0RlZmluZWQoaW52b2tlQXBwbHkpICYmICFpbnZva2VBcHBseSk7XG5cbiAgICAgIGNvdW50ID0gKGFuZ3VsYXIuaXNEZWZpbmVkKGNvdW50KSkgPyBjb3VudCA6IDA7XG4gICAgICBwcm9taXNlLnRoZW4obnVsbCwgbnVsbCwgZm4pO1xuXG4gICAgICBwcm9taXNlLiQkaW50ZXJ2YWxJZCA9IG5leHRSZXBlYXRJZDtcblxuICAgICAgZnVuY3Rpb24gdGljaygpIHtcbiAgICAgICAgZGVmZXJyZWQubm90aWZ5KGl0ZXJhdGlvbisrKTtcblxuICAgICAgICBpZiAoY291bnQgPiAwICYmIGl0ZXJhdGlvbiA+PSBjb3VudCkge1xuICAgICAgICAgIHZhciBmbkluZGV4O1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoaXRlcmF0aW9uKTtcblxuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyZXBlYXRGbnMsIGZ1bmN0aW9uKGZuLCBpbmRleCkge1xuICAgICAgICAgICAgaWYgKGZuLmlkID09PSBwcm9taXNlLiQkaW50ZXJ2YWxJZCkgZm5JbmRleCA9IGluZGV4O1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKGZuSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmVwZWF0Rm5zLnNwbGljZShmbkluZGV4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNraXBBcHBseSkgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgIH1cblxuICAgICAgcmVwZWF0Rm5zLnB1c2goe1xuICAgICAgICBuZXh0VGltZToobm93ICsgZGVsYXkpLFxuICAgICAgICBkZWxheTogZGVsYXksXG4gICAgICAgIGZuOiB0aWNrLFxuICAgICAgICBpZDogbmV4dFJlcGVhdElkLFxuICAgICAgICBkZWZlcnJlZDogZGVmZXJyZWRcbiAgICAgIH0pO1xuICAgICAgcmVwZWF0Rm5zLnNvcnQoZnVuY3Rpb24oYSxiKXsgcmV0dXJuIGEubmV4dFRpbWUgLSBiLm5leHRUaW1lO30pO1xuXG4gICAgICBuZXh0UmVwZWF0SWQrKztcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAqIEBuYW1lICRpbnRlcnZhbCNjYW5jZWxcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIENhbmNlbHMgYSB0YXNrIGFzc29jaWF0ZWQgd2l0aCB0aGUgYHByb21pc2VgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtwcm9taXNlfSBwcm9taXNlIEEgcHJvbWlzZSBmcm9tIGNhbGxpbmcgdGhlIGAkaW50ZXJ2YWxgIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdGFzayB3YXMgc3VjY2Vzc2Z1bGx5IGNhbmNlbGxlZC5cbiAgICAgKi9cbiAgICAkaW50ZXJ2YWwuY2FuY2VsID0gZnVuY3Rpb24ocHJvbWlzZSkge1xuICAgICAgaWYoIXByb21pc2UpIHJldHVybiBmYWxzZTtcbiAgICAgIHZhciBmbkluZGV4O1xuXG4gICAgICBhbmd1bGFyLmZvckVhY2gocmVwZWF0Rm5zLCBmdW5jdGlvbihmbiwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuLmlkID09PSBwcm9taXNlLiQkaW50ZXJ2YWxJZCkgZm5JbmRleCA9IGluZGV4O1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChmbkluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmVwZWF0Rm5zW2ZuSW5kZXhdLmRlZmVycmVkLnJlamVjdCgnY2FuY2VsZWQnKTtcbiAgICAgICAgcmVwZWF0Rm5zLnNwbGljZShmbkluZGV4LCAxKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAqIEBuYW1lICRpbnRlcnZhbCNmbHVzaFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqXG4gICAgICogUnVucyBpbnRlcnZhbCB0YXNrcyBzY2hlZHVsZWQgdG8gYmUgcnVuIGluIHRoZSBuZXh0IGBtaWxsaXNgIG1pbGxpc2Vjb25kcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyPX0gbWlsbGlzIG1heGltdW0gdGltZW91dCBhbW91bnQgdG8gZmx1c2ggdXAgdW50aWwuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBhbW91bnQgb2YgdGltZSBtb3ZlZCBmb3J3YXJkLlxuICAgICAqL1xuICAgICRpbnRlcnZhbC5mbHVzaCA9IGZ1bmN0aW9uKG1pbGxpcykge1xuICAgICAgbm93ICs9IG1pbGxpcztcbiAgICAgIHdoaWxlIChyZXBlYXRGbnMubGVuZ3RoICYmIHJlcGVhdEZuc1swXS5uZXh0VGltZSA8PSBub3cpIHtcbiAgICAgICAgdmFyIHRhc2sgPSByZXBlYXRGbnNbMF07XG4gICAgICAgIHRhc2suZm4oKTtcbiAgICAgICAgdGFzay5uZXh0VGltZSArPSB0YXNrLmRlbGF5O1xuICAgICAgICByZXBlYXRGbnMuc29ydChmdW5jdGlvbihhLGIpeyByZXR1cm4gYS5uZXh0VGltZSAtIGIubmV4dFRpbWU7fSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWlsbGlzO1xuICAgIH07XG5cbiAgICByZXR1cm4gJGludGVydmFsO1xuICB9XTtcbn07XG5cblxuLyoganNoaW50IC1XMTAxICovXG4vKiBUaGUgUl9JU084MDYxX1NUUiByZWdleCBpcyBuZXZlciBnb2luZyB0byBmaXQgaW50byB0aGUgMTAwIGNoYXIgbGltaXQhXG4gKiBUaGlzIGRpcmVjdGl2ZSBzaG91bGQgZ28gaW5zaWRlIHRoZSBhbm9ueW1vdXMgZnVuY3Rpb24gYnV0IGEgYnVnIGluIEpTSGludCBtZWFucyB0aGF0IGl0IHdvdWxkXG4gKiBub3QgYmUgZW5hY3RlZCBlYXJseSBlbm91Z2ggdG8gcHJldmVudCB0aGUgd2FybmluZy5cbiAqL1xudmFyIFJfSVNPODA2MV9TVFIgPSAvXihcXGR7NH0pLT8oXFxkXFxkKS0/KFxcZFxcZCkoPzpUKFxcZFxcZCkoPzpcXDo/KFxcZFxcZCkoPzpcXDo/KFxcZFxcZCkoPzpcXC4oXFxkezN9KSk/KT8pPyhafChbKy1dKShcXGRcXGQpOj8oXFxkXFxkKSkpPyQvO1xuXG5mdW5jdGlvbiBqc29uU3RyaW5nVG9EYXRlKHN0cmluZykge1xuICB2YXIgbWF0Y2g7XG4gIGlmIChtYXRjaCA9IHN0cmluZy5tYXRjaChSX0lTTzgwNjFfU1RSKSkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoMCksXG4gICAgICAgIHR6SG91ciA9IDAsXG4gICAgICAgIHR6TWluICA9IDA7XG4gICAgaWYgKG1hdGNoWzldKSB7XG4gICAgICB0ekhvdXIgPSBpbnQobWF0Y2hbOV0gKyBtYXRjaFsxMF0pO1xuICAgICAgdHpNaW4gPSBpbnQobWF0Y2hbOV0gKyBtYXRjaFsxMV0pO1xuICAgIH1cbiAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKGludChtYXRjaFsxXSksIGludChtYXRjaFsyXSkgLSAxLCBpbnQobWF0Y2hbM10pKTtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKGludChtYXRjaFs0XXx8MCkgLSB0ekhvdXIsXG4gICAgICAgICAgICAgICAgICAgICBpbnQobWF0Y2hbNV18fDApIC0gdHpNaW4sXG4gICAgICAgICAgICAgICAgICAgICBpbnQobWF0Y2hbNl18fDApLFxuICAgICAgICAgICAgICAgICAgICAgaW50KG1hdGNoWzddfHwwKSk7XG4gICAgcmV0dXJuIGRhdGU7XG4gIH1cbiAgcmV0dXJuIHN0cmluZztcbn1cblxuZnVuY3Rpb24gaW50KHN0cikge1xuICByZXR1cm4gcGFyc2VJbnQoc3RyLCAxMCk7XG59XG5cbmZ1bmN0aW9uIHBhZE51bWJlcihudW0sIGRpZ2l0cywgdHJpbSkge1xuICB2YXIgbmVnID0gJyc7XG4gIGlmIChudW0gPCAwKSB7XG4gICAgbmVnID0gICctJztcbiAgICBudW0gPSAtbnVtO1xuICB9XG4gIG51bSA9ICcnICsgbnVtO1xuICB3aGlsZShudW0ubGVuZ3RoIDwgZGlnaXRzKSBudW0gPSAnMCcgKyBudW07XG4gIGlmICh0cmltKVxuICAgIG51bSA9IG51bS5zdWJzdHIobnVtLmxlbmd0aCAtIGRpZ2l0cyk7XG4gIHJldHVybiBuZWcgKyBudW07XG59XG5cblxuLyoqXG4gKiBAbmdkb2MgdHlwZVxuICogQG5hbWUgYW5ndWxhci5tb2NrLlR6RGF0ZVxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogKk5PVEUqOiB0aGlzIGlzIG5vdCBhbiBpbmplY3RhYmxlIGluc3RhbmNlLCBqdXN0IGEgZ2xvYmFsbHkgYXZhaWxhYmxlIG1vY2sgY2xhc3Mgb2YgYERhdGVgLlxuICpcbiAqIE1vY2sgb2YgdGhlIERhdGUgdHlwZSB3aGljaCBoYXMgaXRzIHRpbWV6b25lIHNwZWNpZmllZCB2aWEgY29uc3RydWN0b3IgYXJnLlxuICpcbiAqIFRoZSBtYWluIHB1cnBvc2UgaXMgdG8gY3JlYXRlIERhdGUtbGlrZSBpbnN0YW5jZXMgd2l0aCB0aW1lem9uZSBmaXhlZCB0byB0aGUgc3BlY2lmaWVkIHRpbWV6b25lXG4gKiBvZmZzZXQsIHNvIHRoYXQgd2UgY2FuIHRlc3QgY29kZSB0aGF0IGRlcGVuZHMgb24gbG9jYWwgdGltZXpvbmUgc2V0dGluZ3Mgd2l0aG91dCBkZXBlbmRlbmN5IG9uXG4gKiB0aGUgdGltZSB6b25lIHNldHRpbmdzIG9mIHRoZSBtYWNoaW5lIHdoZXJlIHRoZSBjb2RlIGlzIHJ1bm5pbmcuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCBPZmZzZXQgb2YgdGhlICpkZXNpcmVkKiB0aW1lem9uZSBpbiBob3VycyAoZnJhY3Rpb25zIHdpbGwgYmUgaG9ub3JlZClcbiAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSB0aW1lc3RhbXAgVGltZXN0YW1wIHJlcHJlc2VudGluZyB0aGUgZGVzaXJlZCB0aW1lIGluICpVVEMqXG4gKlxuICogQGV4YW1wbGVcbiAqICEhISEgV0FSTklORyAhISEhIVxuICogVGhpcyBpcyBub3QgYSBjb21wbGV0ZSBEYXRlIG9iamVjdCBzbyBvbmx5IG1ldGhvZHMgdGhhdCB3ZXJlIGltcGxlbWVudGVkIGNhbiBiZSBjYWxsZWQgc2FmZWx5LlxuICogVG8gbWFrZSBtYXR0ZXJzIHdvcnNlLCBUekRhdGUgaW5zdGFuY2VzIGluaGVyaXQgc3R1ZmYgZnJvbSBEYXRlIHZpYSBhIHByb3RvdHlwZS5cbiAqXG4gKiBXZSBkbyBvdXIgYmVzdCB0byBpbnRlcmNlcHQgY2FsbHMgdG8gXCJ1bmltcGxlbWVudGVkXCIgbWV0aG9kcywgYnV0IHNpbmNlIHRoZSBsaXN0IG9mIG1ldGhvZHMgaXNcbiAqIGluY29tcGxldGUgd2UgbWlnaHQgYmUgbWlzc2luZyBzb21lIG5vbi1zdGFuZGFyZCBtZXRob2RzLiBUaGlzIGNhbiByZXN1bHQgaW4gZXJyb3JzIGxpa2U6XG4gKiBcIkRhdGUucHJvdG90eXBlLmZvbyBjYWxsZWQgb24gaW5jb21wYXRpYmxlIE9iamVjdFwiLlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgbmV3WWVhckluQnJhdGlzbGF2YSA9IG5ldyBUekRhdGUoLTEsICcyMDA5LTEyLTMxVDIzOjAwOjAwWicpO1xuICogbmV3WWVhckluQnJhdGlzbGF2YS5nZXRUaW1lem9uZU9mZnNldCgpID0+IC02MDtcbiAqIG5ld1llYXJJbkJyYXRpc2xhdmEuZ2V0RnVsbFllYXIoKSA9PiAyMDEwO1xuICogbmV3WWVhckluQnJhdGlzbGF2YS5nZXRNb250aCgpID0+IDA7XG4gKiBuZXdZZWFySW5CcmF0aXNsYXZhLmdldERhdGUoKSA9PiAxO1xuICogbmV3WWVhckluQnJhdGlzbGF2YS5nZXRIb3VycygpID0+IDA7XG4gKiBuZXdZZWFySW5CcmF0aXNsYXZhLmdldE1pbnV0ZXMoKSA9PiAwO1xuICogbmV3WWVhckluQnJhdGlzbGF2YS5nZXRTZWNvbmRzKCkgPT4gMDtcbiAqIGBgYFxuICpcbiAqL1xuYW5ndWxhci5tb2NrLlR6RGF0ZSA9IGZ1bmN0aW9uIChvZmZzZXQsIHRpbWVzdGFtcCkge1xuICB2YXIgc2VsZiA9IG5ldyBEYXRlKDApO1xuICBpZiAoYW5ndWxhci5pc1N0cmluZyh0aW1lc3RhbXApKSB7XG4gICAgdmFyIHRzU3RyID0gdGltZXN0YW1wO1xuXG4gICAgc2VsZi5vcmlnRGF0ZSA9IGpzb25TdHJpbmdUb0RhdGUodGltZXN0YW1wKTtcblxuICAgIHRpbWVzdGFtcCA9IHNlbGYub3JpZ0RhdGUuZ2V0VGltZSgpO1xuICAgIGlmIChpc05hTih0aW1lc3RhbXApKVxuICAgICAgdGhyb3cge1xuICAgICAgICBuYW1lOiBcIklsbGVnYWwgQXJndW1lbnRcIixcbiAgICAgICAgbWVzc2FnZTogXCJBcmcgJ1wiICsgdHNTdHIgKyBcIicgcGFzc2VkIGludG8gVHpEYXRlIGNvbnN0cnVjdG9yIGlzIG5vdCBhIHZhbGlkIGRhdGUgc3RyaW5nXCJcbiAgICAgIH07XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5vcmlnRGF0ZSA9IG5ldyBEYXRlKHRpbWVzdGFtcCk7XG4gIH1cblxuICB2YXIgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSh0aW1lc3RhbXApLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gIHNlbGYub2Zmc2V0RGlmZiA9IGxvY2FsT2Zmc2V0KjYwKjEwMDAgLSBvZmZzZXQqMTAwMCo2MCo2MDtcbiAgc2VsZi5kYXRlID0gbmV3IERhdGUodGltZXN0YW1wICsgc2VsZi5vZmZzZXREaWZmKTtcblxuICBzZWxmLmdldFRpbWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5kYXRlLmdldFRpbWUoKSAtIHNlbGYub2Zmc2V0RGlmZjtcbiAgfTtcblxuICBzZWxmLnRvTG9jYWxlRGF0ZVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLmRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRGdWxsWWVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLmRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgfTtcblxuICBzZWxmLmdldE1vbnRoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYuZGF0ZS5nZXRNb250aCgpO1xuICB9O1xuXG4gIHNlbGYuZ2V0RGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLmRhdGUuZ2V0RGF0ZSgpO1xuICB9O1xuXG4gIHNlbGYuZ2V0SG91cnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5kYXRlLmdldEhvdXJzKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRNaW51dGVzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYuZGF0ZS5nZXRNaW51dGVzKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRTZWNvbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYuZGF0ZS5nZXRTZWNvbmRzKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRNaWxsaXNlY29uZHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5kYXRlLmdldE1pbGxpc2Vjb25kcygpO1xuICB9O1xuXG4gIHNlbGYuZ2V0VGltZXpvbmVPZmZzZXQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gb2Zmc2V0ICogNjA7XG4gIH07XG5cbiAgc2VsZi5nZXRVVENGdWxsWWVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLm9yaWdEYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRVVENNb250aCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLm9yaWdEYXRlLmdldFVUQ01vbnRoKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRVVENEYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYub3JpZ0RhdGUuZ2V0VVRDRGF0ZSgpO1xuICB9O1xuXG4gIHNlbGYuZ2V0VVRDSG91cnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5vcmlnRGF0ZS5nZXRVVENIb3VycygpO1xuICB9O1xuXG4gIHNlbGYuZ2V0VVRDTWludXRlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLm9yaWdEYXRlLmdldFVUQ01pbnV0ZXMoKTtcbiAgfTtcblxuICBzZWxmLmdldFVUQ1NlY29uZHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5vcmlnRGF0ZS5nZXRVVENTZWNvbmRzKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRVVENNaWxsaXNlY29uZHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5vcmlnRGF0ZS5nZXRVVENNaWxsaXNlY29uZHMoKTtcbiAgfTtcblxuICBzZWxmLmdldERheSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLmRhdGUuZ2V0RGF5KCk7XG4gIH07XG5cbiAgLy8gcHJvdmlkZSB0aGlzIG1ldGhvZCBvbmx5IG9uIGJyb3dzZXJzIHRoYXQgYWxyZWFkeSBoYXZlIGl0XG4gIGlmIChzZWxmLnRvSVNPU3RyaW5nKSB7XG4gICAgc2VsZi50b0lTT1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBhZE51bWJlcihzZWxmLm9yaWdEYXRlLmdldFVUQ0Z1bGxZZWFyKCksIDQpICsgJy0nICtcbiAgICAgICAgICAgIHBhZE51bWJlcihzZWxmLm9yaWdEYXRlLmdldFVUQ01vbnRoKCkgKyAxLCAyKSArICctJyArXG4gICAgICAgICAgICBwYWROdW1iZXIoc2VsZi5vcmlnRGF0ZS5nZXRVVENEYXRlKCksIDIpICsgJ1QnICtcbiAgICAgICAgICAgIHBhZE51bWJlcihzZWxmLm9yaWdEYXRlLmdldFVUQ0hvdXJzKCksIDIpICsgJzonICtcbiAgICAgICAgICAgIHBhZE51bWJlcihzZWxmLm9yaWdEYXRlLmdldFVUQ01pbnV0ZXMoKSwgMikgKyAnOicgK1xuICAgICAgICAgICAgcGFkTnVtYmVyKHNlbGYub3JpZ0RhdGUuZ2V0VVRDU2Vjb25kcygpLCAyKSArICcuJyArXG4gICAgICAgICAgICBwYWROdW1iZXIoc2VsZi5vcmlnRGF0ZS5nZXRVVENNaWxsaXNlY29uZHMoKSwgMykgKyAnWic7XG4gICAgfTtcbiAgfVxuXG4gIC8vaGlkZSBhbGwgbWV0aG9kcyBub3QgaW1wbGVtZW50ZWQgaW4gdGhpcyBtb2NrIHRoYXQgdGhlIERhdGUgcHJvdG90eXBlIGV4cG9zZXNcbiAgdmFyIHVuaW1wbGVtZW50ZWRNZXRob2RzID0gWydnZXRVVENEYXknLFxuICAgICAgJ2dldFllYXInLCAnc2V0RGF0ZScsICdzZXRGdWxsWWVhcicsICdzZXRIb3VycycsICdzZXRNaWxsaXNlY29uZHMnLFxuICAgICAgJ3NldE1pbnV0ZXMnLCAnc2V0TW9udGgnLCAnc2V0U2Vjb25kcycsICdzZXRUaW1lJywgJ3NldFVUQ0RhdGUnLCAnc2V0VVRDRnVsbFllYXInLFxuICAgICAgJ3NldFVUQ0hvdXJzJywgJ3NldFVUQ01pbGxpc2Vjb25kcycsICdzZXRVVENNaW51dGVzJywgJ3NldFVUQ01vbnRoJywgJ3NldFVUQ1NlY29uZHMnLFxuICAgICAgJ3NldFllYXInLCAndG9EYXRlU3RyaW5nJywgJ3RvR01UU3RyaW5nJywgJ3RvSlNPTicsICd0b0xvY2FsZUZvcm1hdCcsICd0b0xvY2FsZVN0cmluZycsXG4gICAgICAndG9Mb2NhbGVUaW1lU3RyaW5nJywgJ3RvU291cmNlJywgJ3RvU3RyaW5nJywgJ3RvVGltZVN0cmluZycsICd0b1VUQ1N0cmluZycsICd2YWx1ZU9mJ107XG5cbiAgYW5ndWxhci5mb3JFYWNoKHVuaW1wbGVtZW50ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgc2VsZlttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kICdcIiArIG1ldGhvZE5hbWUgKyBcIicgaXMgbm90IGltcGxlbWVudGVkIGluIHRoZSBUekRhdGUgbW9ja1wiKTtcbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gc2VsZjtcbn07XG5cbi8vbWFrZSBcInR6RGF0ZUluc3RhbmNlIGluc3RhbmNlb2YgRGF0ZVwiIHJldHVybiB0cnVlXG5hbmd1bGFyLm1vY2suVHpEYXRlLnByb3RvdHlwZSA9IERhdGUucHJvdG90eXBlO1xuLyoganNoaW50ICtXMTAxICovXG5cbmFuZ3VsYXIubW9jay5hbmltYXRlID0gYW5ndWxhci5tb2R1bGUoJ25nQW5pbWF0ZU1vY2snLCBbJ25nJ10pXG5cbiAgLmNvbmZpZyhbJyRwcm92aWRlJywgZnVuY3Rpb24oJHByb3ZpZGUpIHtcblxuICAgIHZhciByZWZsb3dRdWV1ZSA9IFtdO1xuICAgICRwcm92aWRlLnZhbHVlKCckJGFuaW1hdGVSZWZsb3cnLCBmdW5jdGlvbihmbikge1xuICAgICAgdmFyIGluZGV4ID0gcmVmbG93UXVldWUubGVuZ3RoO1xuICAgICAgcmVmbG93UXVldWUucHVzaChmbik7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICByZWZsb3dRdWV1ZS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgICRwcm92aWRlLmRlY29yYXRvcignJGFuaW1hdGUnLCBmdW5jdGlvbigkZGVsZWdhdGUsICQkYXN5bmNDYWxsYmFjaykge1xuICAgICAgdmFyIGFuaW1hdGUgPSB7XG4gICAgICAgIHF1ZXVlIDogW10sXG4gICAgICAgIGVuYWJsZWQgOiAkZGVsZWdhdGUuZW5hYmxlZCxcbiAgICAgICAgdHJpZ2dlckNhbGxiYWNrcyA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQkYXN5bmNDYWxsYmFjay5mbHVzaCgpO1xuICAgICAgICB9LFxuICAgICAgICB0cmlnZ2VyUmVmbG93IDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJlZmxvd1F1ZXVlLCBmdW5jdGlvbihmbikge1xuICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZWZsb3dRdWV1ZSA9IFtdO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBhbmd1bGFyLmZvckVhY2goXG4gICAgICAgIFsnZW50ZXInLCdsZWF2ZScsJ21vdmUnLCdhZGRDbGFzcycsJ3JlbW92ZUNsYXNzJywnc2V0Q2xhc3MnXSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIGFuaW1hdGVbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFuaW1hdGUucXVldWUucHVzaCh7XG4gICAgICAgICAgICBldmVudCA6IG1ldGhvZCxcbiAgICAgICAgICAgIGVsZW1lbnQgOiBhcmd1bWVudHNbMF0sXG4gICAgICAgICAgICBhcmdzIDogYXJndW1lbnRzXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJGRlbGVnYXRlW21ldGhvZF0uYXBwbHkoJGRlbGVnYXRlLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBhbmltYXRlO1xuICAgIH0pO1xuXG4gIH1dKTtcblxuXG4vKipcbiAqIEBuZ2RvYyBmdW5jdGlvblxuICogQG5hbWUgYW5ndWxhci5tb2NrLmR1bXBcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqICpOT1RFKjogdGhpcyBpcyBub3QgYW4gaW5qZWN0YWJsZSBpbnN0YW5jZSwganVzdCBhIGdsb2JhbGx5IGF2YWlsYWJsZSBmdW5jdGlvbi5cbiAqXG4gKiBNZXRob2QgZm9yIHNlcmlhbGl6aW5nIGNvbW1vbiBhbmd1bGFyIG9iamVjdHMgKHNjb3BlLCBlbGVtZW50cywgZXRjLi4pIGludG8gc3RyaW5ncywgdXNlZnVsIGZvclxuICogZGVidWdnaW5nLlxuICpcbiAqIFRoaXMgbWV0aG9kIGlzIGFsc28gYXZhaWxhYmxlIG9uIHdpbmRvdywgd2hlcmUgaXQgY2FuIGJlIHVzZWQgdG8gZGlzcGxheSBvYmplY3RzIG9uIGRlYnVnXG4gKiBjb25zb2xlLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IC0gYW55IG9iamVjdCB0byB0dXJuIGludG8gc3RyaW5nLlxuICogQHJldHVybiB7c3RyaW5nfSBhIHNlcmlhbGl6ZWQgc3RyaW5nIG9mIHRoZSBhcmd1bWVudFxuICovXG5hbmd1bGFyLm1vY2suZHVtcCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gc2VyaWFsaXplKG9iamVjdCk7XG5cbiAgZnVuY3Rpb24gc2VyaWFsaXplKG9iamVjdCkge1xuICAgIHZhciBvdXQ7XG5cbiAgICBpZiAoYW5ndWxhci5pc0VsZW1lbnQob2JqZWN0KSkge1xuICAgICAgb2JqZWN0ID0gYW5ndWxhci5lbGVtZW50KG9iamVjdCk7XG4gICAgICBvdXQgPSBhbmd1bGFyLmVsZW1lbnQoJzxkaXY+PC9kaXY+Jyk7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob2JqZWN0LCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIG91dC5hcHBlbmQoYW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLmNsb25lKCkpO1xuICAgICAgfSk7XG4gICAgICBvdXQgPSBvdXQuaHRtbCgpO1xuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc0FycmF5KG9iamVjdCkpIHtcbiAgICAgIG91dCA9IFtdO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKG9iamVjdCwgZnVuY3Rpb24obykge1xuICAgICAgICBvdXQucHVzaChzZXJpYWxpemUobykpO1xuICAgICAgfSk7XG4gICAgICBvdXQgPSAnWyAnICsgb3V0LmpvaW4oJywgJykgKyAnIF0nO1xuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKG9iamVjdC4kZXZhbCkgJiYgYW5ndWxhci5pc0Z1bmN0aW9uKG9iamVjdC4kYXBwbHkpKSB7XG4gICAgICAgIG91dCA9IHNlcmlhbGl6ZVNjb3BlKG9iamVjdCk7XG4gICAgICB9IGVsc2UgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIG91dCA9IG9iamVjdC5zdGFjayB8fCAoJycgKyBvYmplY3QubmFtZSArICc6ICcgKyBvYmplY3QubWVzc2FnZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPKGkpOiB0aGlzIHByZXZlbnRzIG1ldGhvZHMgYmVpbmcgbG9nZ2VkLFxuICAgICAgICAvLyB3ZSBzaG91bGQgaGF2ZSBhIGJldHRlciB3YXkgdG8gc2VyaWFsaXplIG9iamVjdHNcbiAgICAgICAgb3V0ID0gYW5ndWxhci50b0pzb24ob2JqZWN0LCB0cnVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ID0gU3RyaW5nKG9iamVjdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZVNjb3BlKHNjb3BlLCBvZmZzZXQpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgICcgICc7XG4gICAgdmFyIGxvZyA9IFtvZmZzZXQgKyAnU2NvcGUoJyArIHNjb3BlLiRpZCArICcpOiB7J107XG4gICAgZm9yICggdmFyIGtleSBpbiBzY29wZSApIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc2NvcGUsIGtleSkgJiYgIWtleS5tYXRjaCgvXihcXCR8dGhpcykvKSkge1xuICAgICAgICBsb2cucHVzaCgnICAnICsga2V5ICsgJzogJyArIGFuZ3VsYXIudG9Kc29uKHNjb3BlW2tleV0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGNoaWxkID0gc2NvcGUuJCRjaGlsZEhlYWQ7XG4gICAgd2hpbGUoY2hpbGQpIHtcbiAgICAgIGxvZy5wdXNoKHNlcmlhbGl6ZVNjb3BlKGNoaWxkLCBvZmZzZXQgKyAnICAnKSk7XG4gICAgICBjaGlsZCA9IGNoaWxkLiQkbmV4dFNpYmxpbmc7XG4gICAgfVxuICAgIGxvZy5wdXNoKCd9Jyk7XG4gICAgcmV0dXJuIGxvZy5qb2luKCdcXG4nICsgb2Zmc2V0KTtcbiAgfVxufTtcblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJGh0dHBCYWNrZW5kXG4gKiBAZGVzY3JpcHRpb25cbiAqIEZha2UgSFRUUCBiYWNrZW5kIGltcGxlbWVudGF0aW9uIHN1aXRhYmxlIGZvciB1bml0IHRlc3RpbmcgYXBwbGljYXRpb25zIHRoYXQgdXNlIHRoZVxuICoge0BsaW5rIG5nLiRodHRwICRodHRwIHNlcnZpY2V9LlxuICpcbiAqICpOb3RlKjogRm9yIGZha2UgSFRUUCBiYWNrZW5kIGltcGxlbWVudGF0aW9uIHN1aXRhYmxlIGZvciBlbmQtdG8tZW5kIHRlc3Rpbmcgb3IgYmFja2VuZC1sZXNzXG4gKiBkZXZlbG9wbWVudCBwbGVhc2Ugc2VlIHtAbGluayBuZ01vY2tFMkUuJGh0dHBCYWNrZW5kIGUyZSAkaHR0cEJhY2tlbmQgbW9ja30uXG4gKlxuICogRHVyaW5nIHVuaXQgdGVzdGluZywgd2Ugd2FudCBvdXIgdW5pdCB0ZXN0cyB0byBydW4gcXVpY2tseSBhbmQgaGF2ZSBubyBleHRlcm5hbCBkZXBlbmRlbmNpZXMgc29cbiAqIHdlIGRvbsOi4oKs4oSidCB3YW50IHRvIHNlbmQgW1hIUl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4veG1saHR0cHJlcXVlc3QpIG9yXG4gKiBbSlNPTlBdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSlNPTlApIHJlcXVlc3RzIHRvIGEgcmVhbCBzZXJ2ZXIuIEFsbCB3ZSByZWFsbHkgbmVlZCBpc1xuICogdG8gdmVyaWZ5IHdoZXRoZXIgYSBjZXJ0YWluIHJlcXVlc3QgaGFzIGJlZW4gc2VudCBvciBub3QsIG9yIGFsdGVybmF0aXZlbHkganVzdCBsZXQgdGhlXG4gKiBhcHBsaWNhdGlvbiBtYWtlIHJlcXVlc3RzLCByZXNwb25kIHdpdGggcHJlLXRyYWluZWQgcmVzcG9uc2VzIGFuZCBhc3NlcnQgdGhhdCB0aGUgZW5kIHJlc3VsdCBpc1xuICogd2hhdCB3ZSBleHBlY3QgaXQgdG8gYmUuXG4gKlxuICogVGhpcyBtb2NrIGltcGxlbWVudGF0aW9uIGNhbiBiZSB1c2VkIHRvIHJlc3BvbmQgd2l0aCBzdGF0aWMgb3IgZHluYW1pYyByZXNwb25zZXMgdmlhIHRoZVxuICogYGV4cGVjdGAgYW5kIGB3aGVuYCBhcGlzIGFuZCB0aGVpciBzaG9ydGN1dHMgKGBleHBlY3RHRVRgLCBgd2hlblBPU1RgLCBldGMpLlxuICpcbiAqIFdoZW4gYW4gQW5ndWxhciBhcHBsaWNhdGlvbiBuZWVkcyBzb21lIGRhdGEgZnJvbSBhIHNlcnZlciwgaXQgY2FsbHMgdGhlICRodHRwIHNlcnZpY2UsIHdoaWNoXG4gKiBzZW5kcyB0aGUgcmVxdWVzdCB0byBhIHJlYWwgc2VydmVyIHVzaW5nICRodHRwQmFja2VuZCBzZXJ2aWNlLiBXaXRoIGRlcGVuZGVuY3kgaW5qZWN0aW9uLCBpdCBpc1xuICogZWFzeSB0byBpbmplY3QgJGh0dHBCYWNrZW5kIG1vY2sgKHdoaWNoIGhhcyB0aGUgc2FtZSBBUEkgYXMgJGh0dHBCYWNrZW5kKSBhbmQgdXNlIGl0IHRvIHZlcmlmeVxuICogdGhlIHJlcXVlc3RzIGFuZCByZXNwb25kIHdpdGggc29tZSB0ZXN0aW5nIGRhdGEgd2l0aG91dCBzZW5kaW5nIGEgcmVxdWVzdCB0byBhIHJlYWwgc2VydmVyLlxuICpcbiAqIFRoZXJlIGFyZSB0d28gd2F5cyB0byBzcGVjaWZ5IHdoYXQgdGVzdCBkYXRhIHNob3VsZCBiZSByZXR1cm5lZCBhcyBodHRwIHJlc3BvbnNlcyBieSB0aGUgbW9ja1xuICogYmFja2VuZCB3aGVuIHRoZSBjb2RlIHVuZGVyIHRlc3QgbWFrZXMgaHR0cCByZXF1ZXN0czpcbiAqXG4gKiAtIGAkaHR0cEJhY2tlbmQuZXhwZWN0YCAtIHNwZWNpZmllcyBhIHJlcXVlc3QgZXhwZWN0YXRpb25cbiAqIC0gYCRodHRwQmFja2VuZC53aGVuYCAtIHNwZWNpZmllcyBhIGJhY2tlbmQgZGVmaW5pdGlvblxuICpcbiAqXG4gKiAjIFJlcXVlc3QgRXhwZWN0YXRpb25zIHZzIEJhY2tlbmQgRGVmaW5pdGlvbnNcbiAqXG4gKiBSZXF1ZXN0IGV4cGVjdGF0aW9ucyBwcm92aWRlIGEgd2F5IHRvIG1ha2UgYXNzZXJ0aW9ucyBhYm91dCByZXF1ZXN0cyBtYWRlIGJ5IHRoZSBhcHBsaWNhdGlvbiBhbmRcbiAqIHRvIGRlZmluZSByZXNwb25zZXMgZm9yIHRob3NlIHJlcXVlc3RzLiBUaGUgdGVzdCB3aWxsIGZhaWwgaWYgdGhlIGV4cGVjdGVkIHJlcXVlc3RzIGFyZSBub3QgbWFkZVxuICogb3IgdGhleSBhcmUgbWFkZSBpbiB0aGUgd3Jvbmcgb3JkZXIuXG4gKlxuICogQmFja2VuZCBkZWZpbml0aW9ucyBhbGxvdyB5b3UgdG8gZGVmaW5lIGEgZmFrZSBiYWNrZW5kIGZvciB5b3VyIGFwcGxpY2F0aW9uIHdoaWNoIGRvZXNuJ3QgYXNzZXJ0XG4gKiBpZiBhIHBhcnRpY3VsYXIgcmVxdWVzdCB3YXMgbWFkZSBvciBub3QsIGl0IGp1c3QgcmV0dXJucyBhIHRyYWluZWQgcmVzcG9uc2UgaWYgYSByZXF1ZXN0IGlzIG1hZGUuXG4gKiBUaGUgdGVzdCB3aWxsIHBhc3Mgd2hldGhlciBvciBub3QgdGhlIHJlcXVlc3QgZ2V0cyBtYWRlIGR1cmluZyB0ZXN0aW5nLlxuICpcbiAqXG4gKiA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPlxuICogICA8dHI+PHRoIHdpZHRoPVwiMjIwcHhcIj48L3RoPjx0aD5SZXF1ZXN0IGV4cGVjdGF0aW9uczwvdGg+PHRoPkJhY2tlbmQgZGVmaW5pdGlvbnM8L3RoPjwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGg+U3ludGF4PC90aD5cbiAqICAgICA8dGQ+LmV4cGVjdCguLi4pLnJlc3BvbmQoLi4uKTwvdGQ+XG4gKiAgICAgPHRkPi53aGVuKC4uLikucmVzcG9uZCguLi4pPC90ZD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0aD5UeXBpY2FsIHVzYWdlPC90aD5cbiAqICAgICA8dGQ+c3RyaWN0IHVuaXQgdGVzdHM8L3RkPlxuICogICAgIDx0ZD5sb29zZSAoYmxhY2stYm94KSB1bml0IHRlc3Rpbmc8L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRoPkZ1bGZpbGxzIG11bHRpcGxlIHJlcXVlc3RzPC90aD5cbiAqICAgICA8dGQ+Tk88L3RkPlxuICogICAgIDx0ZD5ZRVM8L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRoPk9yZGVyIG9mIHJlcXVlc3RzIG1hdHRlcnM8L3RoPlxuICogICAgIDx0ZD5ZRVM8L3RkPlxuICogICAgIDx0ZD5OTzwvdGQ+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGg+UmVxdWVzdCByZXF1aXJlZDwvdGg+XG4gKiAgICAgPHRkPllFUzwvdGQ+XG4gKiAgICAgPHRkPk5PPC90ZD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0aD5SZXNwb25zZSByZXF1aXJlZDwvdGg+XG4gKiAgICAgPHRkPm9wdGlvbmFsIChzZWUgYmVsb3cpPC90ZD5cbiAqICAgICA8dGQ+WUVTPC90ZD5cbiAqICAgPC90cj5cbiAqIDwvdGFibGU+XG4gKlxuICogSW4gY2FzZXMgd2hlcmUgYm90aCBiYWNrZW5kIGRlZmluaXRpb25zIGFuZCByZXF1ZXN0IGV4cGVjdGF0aW9ucyBhcmUgc3BlY2lmaWVkIGR1cmluZyB1bml0XG4gKiB0ZXN0aW5nLCB0aGUgcmVxdWVzdCBleHBlY3RhdGlvbnMgYXJlIGV2YWx1YXRlZCBmaXJzdC5cbiAqXG4gKiBJZiBhIHJlcXVlc3QgZXhwZWN0YXRpb24gaGFzIG5vIHJlc3BvbnNlIHNwZWNpZmllZCwgdGhlIGFsZ29yaXRobSB3aWxsIHNlYXJjaCB5b3VyIGJhY2tlbmRcbiAqIGRlZmluaXRpb25zIGZvciBhbiBhcHByb3ByaWF0ZSByZXNwb25zZS5cbiAqXG4gKiBJZiBhIHJlcXVlc3QgZGlkbid0IG1hdGNoIGFueSBleHBlY3RhdGlvbiBvciBpZiB0aGUgZXhwZWN0YXRpb24gZG9lc24ndCBoYXZlIHRoZSByZXNwb25zZVxuICogZGVmaW5lZCwgdGhlIGJhY2tlbmQgZGVmaW5pdGlvbnMgYXJlIGV2YWx1YXRlZCBpbiBzZXF1ZW50aWFsIG9yZGVyIHRvIHNlZSBpZiBhbnkgb2YgdGhlbSBtYXRjaFxuICogdGhlIHJlcXVlc3QuIFRoZSByZXNwb25zZSBmcm9tIHRoZSBmaXJzdCBtYXRjaGVkIGRlZmluaXRpb24gaXMgcmV0dXJuZWQuXG4gKlxuICpcbiAqICMgRmx1c2hpbmcgSFRUUCByZXF1ZXN0c1xuICpcbiAqIFRoZSAkaHR0cEJhY2tlbmQgdXNlZCBpbiBwcm9kdWN0aW9uIGFsd2F5cyByZXNwb25kcyB0byByZXF1ZXN0cyBhc3luY2hyb25vdXNseS4gSWYgd2UgcHJlc2VydmVkXG4gKiB0aGlzIGJlaGF2aW9yIGluIHVuaXQgdGVzdGluZywgd2UnZCBoYXZlIHRvIGNyZWF0ZSBhc3luYyB1bml0IHRlc3RzLCB3aGljaCBhcmUgaGFyZCB0byB3cml0ZSxcbiAqIHRvIGZvbGxvdyBhbmQgdG8gbWFpbnRhaW4uIEJ1dCBuZWl0aGVyIGNhbiB0aGUgdGVzdGluZyBtb2NrIHJlc3BvbmQgc3luY2hyb25vdXNseTsgdGhhdCB3b3VsZFxuICogY2hhbmdlIHRoZSBleGVjdXRpb24gb2YgdGhlIGNvZGUgdW5kZXIgdGVzdC4gRm9yIHRoaXMgcmVhc29uLCB0aGUgbW9jayAkaHR0cEJhY2tlbmQgaGFzIGFcbiAqIGBmbHVzaCgpYCBtZXRob2QsIHdoaWNoIGFsbG93cyB0aGUgdGVzdCB0byBleHBsaWNpdGx5IGZsdXNoIHBlbmRpbmcgcmVxdWVzdHMuIFRoaXMgcHJlc2VydmVzXG4gKiB0aGUgYXN5bmMgYXBpIG9mIHRoZSBiYWNrZW5kLCB3aGlsZSBhbGxvd2luZyB0aGUgdGVzdCB0byBleGVjdXRlIHN5bmNocm9ub3VzbHkuXG4gKlxuICpcbiAqICMgVW5pdCB0ZXN0aW5nIHdpdGggbW9jayAkaHR0cEJhY2tlbmRcbiAqIFRoZSBmb2xsb3dpbmcgY29kZSBzaG93cyBob3cgdG8gc2V0dXAgYW5kIHVzZSB0aGUgbW9jayBiYWNrZW5kIHdoZW4gdW5pdCB0ZXN0aW5nIGEgY29udHJvbGxlci5cbiAqIEZpcnN0IHdlIGNyZWF0ZSB0aGUgY29udHJvbGxlciB1bmRlciB0ZXN0OlxuICpcbiAgYGBganNcbiAgLy8gVGhlIGNvbnRyb2xsZXIgY29kZVxuICBmdW5jdGlvbiBNeUNvbnRyb2xsZXIoJHNjb3BlLCAkaHR0cCkge1xuICAgIHZhciBhdXRoVG9rZW47XG5cbiAgICAkaHR0cC5nZXQoJy9hdXRoLnB5Jykuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMpIHtcbiAgICAgIGF1dGhUb2tlbiA9IGhlYWRlcnMoJ0EtVG9rZW4nKTtcbiAgICAgICRzY29wZS51c2VyID0gZGF0YTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zYXZlTWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIHZhciBoZWFkZXJzID0geyAnQXV0aG9yaXphdGlvbic6IGF1dGhUb2tlbiB9O1xuICAgICAgJHNjb3BlLnN0YXR1cyA9ICdTYXZpbmcuLi4nO1xuXG4gICAgICAkaHR0cC5wb3N0KCcvYWRkLW1zZy5weScsIG1lc3NhZ2UsIHsgaGVhZGVyczogaGVhZGVycyB9ICkuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUuc3RhdHVzID0gJyc7XG4gICAgICB9KS5lcnJvcihmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnN0YXR1cyA9ICdFUlJPUiEnO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuICBgYGBcbiAqXG4gKiBOb3cgd2Ugc2V0dXAgdGhlIG1vY2sgYmFja2VuZCBhbmQgY3JlYXRlIHRoZSB0ZXN0IHNwZWNzOlxuICpcbiAgYGBganNcbiAgICAvLyB0ZXN0aW5nIGNvbnRyb2xsZXJcbiAgICBkZXNjcmliZSgnTXlDb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgdmFyICRodHRwQmFja2VuZCwgJHJvb3RTY29wZSwgY3JlYXRlQ29udHJvbGxlcjtcblxuICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uKCRpbmplY3Rvcikge1xuICAgICAgICAgLy8gU2V0IHVwIHRoZSBtb2NrIGh0dHAgc2VydmljZSByZXNwb25zZXNcbiAgICAgICAgICRodHRwQmFja2VuZCA9ICRpbmplY3Rvci5nZXQoJyRodHRwQmFja2VuZCcpO1xuICAgICAgICAgLy8gYmFja2VuZCBkZWZpbml0aW9uIGNvbW1vbiBmb3IgYWxsIHRlc3RzXG4gICAgICAgICAkaHR0cEJhY2tlbmQud2hlbignR0VUJywgJy9hdXRoLnB5JykucmVzcG9uZCh7dXNlcklkOiAndXNlclgnfSwgeydBLVRva2VuJzogJ3h4eCd9KTtcblxuICAgICAgICAgLy8gR2V0IGhvbGQgb2YgYSBzY29wZSAoaS5lLiB0aGUgcm9vdCBzY29wZSlcbiAgICAgICAgICRyb290U2NvcGUgPSAkaW5qZWN0b3IuZ2V0KCckcm9vdFNjb3BlJyk7XG4gICAgICAgICAvLyBUaGUgJGNvbnRyb2xsZXIgc2VydmljZSBpcyB1c2VkIHRvIGNyZWF0ZSBpbnN0YW5jZXMgb2YgY29udHJvbGxlcnNcbiAgICAgICAgIHZhciAkY29udHJvbGxlciA9ICRpbmplY3Rvci5nZXQoJyRjb250cm9sbGVyJyk7XG5cbiAgICAgICAgIGNyZWF0ZUNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgcmV0dXJuICRjb250cm9sbGVyKCdNeUNvbnRyb2xsZXInLCB7JyRzY29wZScgOiAkcm9vdFNjb3BlIH0pO1xuICAgICAgICAgfTtcbiAgICAgICB9KSk7XG5cblxuICAgICAgIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nRXhwZWN0YXRpb24oKTtcbiAgICAgICAgICRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCgpO1xuICAgICAgIH0pO1xuXG5cbiAgICAgICBpdCgnc2hvdWxkIGZldGNoIGF1dGhlbnRpY2F0aW9uIHRva2VuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0R0VUKCcvYXV0aC5weScpO1xuICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBjcmVhdGVDb250cm9sbGVyKCk7XG4gICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcbiAgICAgICB9KTtcblxuXG4gICAgICAgaXQoJ3Nob3VsZCBzZW5kIG1zZyB0byBzZXJ2ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgIHZhciBjb250cm9sbGVyID0gY3JlYXRlQ29udHJvbGxlcigpO1xuICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG5cbiAgICAgICAgIC8vIG5vdyB5b3UgZG9uw6LigqzihKJ0IGNhcmUgYWJvdXQgdGhlIGF1dGhlbnRpY2F0aW9uLCBidXRcbiAgICAgICAgIC8vIHRoZSBjb250cm9sbGVyIHdpbGwgc3RpbGwgc2VuZCB0aGUgcmVxdWVzdCBhbmRcbiAgICAgICAgIC8vICRodHRwQmFja2VuZCB3aWxsIHJlc3BvbmQgd2l0aG91dCB5b3UgaGF2aW5nIHRvXG4gICAgICAgICAvLyBzcGVjaWZ5IHRoZSBleHBlY3RhdGlvbiBhbmQgcmVzcG9uc2UgZm9yIHRoaXMgcmVxdWVzdFxuXG4gICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0UE9TVCgnL2FkZC1tc2cucHknLCAnbWVzc2FnZSBjb250ZW50JykucmVzcG9uZCgyMDEsICcnKTtcbiAgICAgICAgICRyb290U2NvcGUuc2F2ZU1lc3NhZ2UoJ21lc3NhZ2UgY29udGVudCcpO1xuICAgICAgICAgZXhwZWN0KCRyb290U2NvcGUuc3RhdHVzKS50b0JlKCdTYXZpbmcuLi4nKTtcbiAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICAgZXhwZWN0KCRyb290U2NvcGUuc3RhdHVzKS50b0JlKCcnKTtcbiAgICAgICB9KTtcblxuXG4gICAgICAgaXQoJ3Nob3VsZCBzZW5kIGF1dGggaGVhZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICB2YXIgY29udHJvbGxlciA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuXG4gICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0UE9TVCgnL2FkZC1tc2cucHknLCB1bmRlZmluZWQsIGZ1bmN0aW9uKGhlYWRlcnMpIHtcbiAgICAgICAgICAgLy8gY2hlY2sgaWYgdGhlIGhlYWRlciB3YXMgc2VuZCwgaWYgaXQgd2Fzbid0IHRoZSBleHBlY3RhdGlvbiB3b24ndFxuICAgICAgICAgICAvLyBtYXRjaCB0aGUgcmVxdWVzdCBhbmQgdGhlIHRlc3Qgd2lsbCBmYWlsXG4gICAgICAgICAgIHJldHVybiBoZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPT0gJ3h4eCc7XG4gICAgICAgICB9KS5yZXNwb25kKDIwMSwgJycpO1xuXG4gICAgICAgICAkcm9vdFNjb3BlLnNhdmVNZXNzYWdlKCd3aGF0ZXZlcicpO1xuICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgfSk7XG4gICAgfSk7XG4gICBgYGBcbiAqL1xuYW5ndWxhci5tb2NrLiRIdHRwQmFja2VuZFByb3ZpZGVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuJGdldCA9IFsnJHJvb3RTY29wZScsIGNyZWF0ZUh0dHBCYWNrZW5kTW9ja107XG59O1xuXG4vKipcbiAqIEdlbmVyYWwgZmFjdG9yeSBmdW5jdGlvbiBmb3IgJGh0dHBCYWNrZW5kIG1vY2suXG4gKiBSZXR1cm5zIGluc3RhbmNlIGZvciB1bml0IHRlc3RpbmcgKHdoZW4gbm8gYXJndW1lbnRzIHNwZWNpZmllZCk6XG4gKiAgIC0gcGFzc2luZyB0aHJvdWdoIGlzIGRpc2FibGVkXG4gKiAgIC0gYXV0byBmbHVzaGluZyBpcyBkaXNhYmxlZFxuICpcbiAqIFJldHVybnMgaW5zdGFuY2UgZm9yIGUyZSB0ZXN0aW5nICh3aGVuIGAkZGVsZWdhdGVgIGFuZCBgJGJyb3dzZXJgIHNwZWNpZmllZCk6XG4gKiAgIC0gcGFzc2luZyB0aHJvdWdoIChkZWxlZ2F0aW5nIHJlcXVlc3QgdG8gcmVhbCBiYWNrZW5kKSBpcyBlbmFibGVkXG4gKiAgIC0gYXV0byBmbHVzaGluZyBpcyBlbmFibGVkXG4gKlxuICogQHBhcmFtIHtPYmplY3Q9fSAkZGVsZWdhdGUgUmVhbCAkaHR0cEJhY2tlbmQgaW5zdGFuY2UgKGFsbG93IHBhc3NpbmcgdGhyb3VnaCBpZiBzcGVjaWZpZWQpXG4gKiBAcGFyYW0ge09iamVjdD19ICRicm93c2VyIEF1dG8tZmx1c2hpbmcgZW5hYmxlZCBpZiBzcGVjaWZpZWRcbiAqIEByZXR1cm4ge09iamVjdH0gSW5zdGFuY2Ugb2YgJGh0dHBCYWNrZW5kIG1vY2tcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSHR0cEJhY2tlbmRNb2NrKCRyb290U2NvcGUsICRkZWxlZ2F0ZSwgJGJyb3dzZXIpIHtcbiAgdmFyIGRlZmluaXRpb25zID0gW10sXG4gICAgICBleHBlY3RhdGlvbnMgPSBbXSxcbiAgICAgIHJlc3BvbnNlcyA9IFtdLFxuICAgICAgcmVzcG9uc2VzUHVzaCA9IGFuZ3VsYXIuYmluZChyZXNwb25zZXMsIHJlc3BvbnNlcy5wdXNoKSxcbiAgICAgIGNvcHkgPSBhbmd1bGFyLmNvcHk7XG5cbiAgZnVuY3Rpb24gY3JlYXRlUmVzcG9uc2Uoc3RhdHVzLCBkYXRhLCBoZWFkZXJzLCBzdGF0dXNUZXh0KSB7XG4gICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihzdGF0dXMpKSByZXR1cm4gc3RhdHVzO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGFuZ3VsYXIuaXNOdW1iZXIoc3RhdHVzKVxuICAgICAgICAgID8gW3N0YXR1cywgZGF0YSwgaGVhZGVycywgc3RhdHVzVGV4dF1cbiAgICAgICAgICA6IFsyMDAsIHN0YXR1cywgZGF0YV07XG4gICAgfTtcbiAgfVxuXG4gIC8vIFRPRE8odm9qdGEpOiBjaGFuZ2UgcGFyYW1zIHRvOiBtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycywgY2FsbGJhY2tcbiAgZnVuY3Rpb24gJGh0dHBCYWNrZW5kKG1ldGhvZCwgdXJsLCBkYXRhLCBjYWxsYmFjaywgaGVhZGVycywgdGltZW91dCwgd2l0aENyZWRlbnRpYWxzKSB7XG4gICAgdmFyIHhociA9IG5ldyBNb2NrWGhyKCksXG4gICAgICAgIGV4cGVjdGF0aW9uID0gZXhwZWN0YXRpb25zWzBdLFxuICAgICAgICB3YXNFeHBlY3RlZCA9IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gcHJldHR5UHJpbnQoZGF0YSkge1xuICAgICAgcmV0dXJuIChhbmd1bGFyLmlzU3RyaW5nKGRhdGEpIHx8IGFuZ3VsYXIuaXNGdW5jdGlvbihkYXRhKSB8fCBkYXRhIGluc3RhbmNlb2YgUmVnRXhwKVxuICAgICAgICAgID8gZGF0YVxuICAgICAgICAgIDogYW5ndWxhci50b0pzb24oZGF0YSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd3JhcFJlc3BvbnNlKHdyYXBwZWQpIHtcbiAgICAgIGlmICghJGJyb3dzZXIgJiYgdGltZW91dCAmJiB0aW1lb3V0LnRoZW4pIHRpbWVvdXQudGhlbihoYW5kbGVUaW1lb3V0KTtcblxuICAgICAgcmV0dXJuIGhhbmRsZVJlc3BvbnNlO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVSZXNwb25zZSgpIHtcbiAgICAgICAgdmFyIHJlc3BvbnNlID0gd3JhcHBlZC5yZXNwb25zZShtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycyk7XG4gICAgICAgIHhoci4kJHJlc3BIZWFkZXJzID0gcmVzcG9uc2VbMl07XG4gICAgICAgIGNhbGxiYWNrKGNvcHkocmVzcG9uc2VbMF0pLCBjb3B5KHJlc3BvbnNlWzFdKSwgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpLFxuICAgICAgICAgICAgICAgICBjb3B5KHJlc3BvbnNlWzNdIHx8ICcnKSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHJlc3BvbnNlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlc1tpXSA9PT0gaGFuZGxlUmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBjYWxsYmFjaygtMSwgdW5kZWZpbmVkLCAnJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXhwZWN0YXRpb24gJiYgZXhwZWN0YXRpb24ubWF0Y2gobWV0aG9kLCB1cmwpKSB7XG4gICAgICBpZiAoIWV4cGVjdGF0aW9uLm1hdGNoRGF0YShkYXRhKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCAnICsgZXhwZWN0YXRpb24gKyAnIHdpdGggZGlmZmVyZW50IGRhdGFcXG4nICtcbiAgICAgICAgICAgICdFWFBFQ1RFRDogJyArIHByZXR0eVByaW50KGV4cGVjdGF0aW9uLmRhdGEpICsgJ1xcbkdPVDogICAgICAnICsgZGF0YSk7XG5cbiAgICAgIGlmICghZXhwZWN0YXRpb24ubWF0Y2hIZWFkZXJzKGhlYWRlcnMpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkICcgKyBleHBlY3RhdGlvbiArICcgd2l0aCBkaWZmZXJlbnQgaGVhZGVyc1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0VYUEVDVEVEOiAnICsgcHJldHR5UHJpbnQoZXhwZWN0YXRpb24uaGVhZGVycykgKyAnXFxuR09UOiAgICAgICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJldHR5UHJpbnQoaGVhZGVycykpO1xuXG4gICAgICBleHBlY3RhdGlvbnMuc2hpZnQoKTtcblxuICAgICAgaWYgKGV4cGVjdGF0aW9uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlc3BvbnNlcy5wdXNoKHdyYXBSZXNwb25zZShleHBlY3RhdGlvbikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB3YXNFeHBlY3RlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgdmFyIGkgPSAtMSwgZGVmaW5pdGlvbjtcbiAgICB3aGlsZSAoKGRlZmluaXRpb24gPSBkZWZpbml0aW9uc1srK2ldKSkge1xuICAgICAgaWYgKGRlZmluaXRpb24ubWF0Y2gobWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMgfHwge30pKSB7XG4gICAgICAgIGlmIChkZWZpbml0aW9uLnJlc3BvbnNlKSB7XG4gICAgICAgICAgLy8gaWYgJGJyb3dzZXIgc3BlY2lmaWVkLCB3ZSBkbyBhdXRvIGZsdXNoIGFsbCByZXF1ZXN0c1xuICAgICAgICAgICgkYnJvd3NlciA/ICRicm93c2VyLmRlZmVyIDogcmVzcG9uc2VzUHVzaCkod3JhcFJlc3BvbnNlKGRlZmluaXRpb24pKTtcbiAgICAgICAgfSBlbHNlIGlmIChkZWZpbml0aW9uLnBhc3NUaHJvdWdoKSB7XG4gICAgICAgICAgJGRlbGVnYXRlKG1ldGhvZCwgdXJsLCBkYXRhLCBjYWxsYmFjaywgaGVhZGVycywgdGltZW91dCwgd2l0aENyZWRlbnRpYWxzKTtcbiAgICAgICAgfSBlbHNlIHRocm93IG5ldyBFcnJvcignTm8gcmVzcG9uc2UgZGVmaW5lZCAhJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgd2FzRXhwZWN0ZWQgP1xuICAgICAgICBuZXcgRXJyb3IoJ05vIHJlc3BvbnNlIGRlZmluZWQgIScpIDpcbiAgICAgICAgbmV3IEVycm9yKCdVbmV4cGVjdGVkIHJlcXVlc3Q6ICcgKyBtZXRob2QgKyAnICcgKyB1cmwgKyAnXFxuJyArXG4gICAgICAgICAgICAgICAgICAoZXhwZWN0YXRpb24gPyAnRXhwZWN0ZWQgJyArIGV4cGVjdGF0aW9uIDogJ05vIG1vcmUgcmVxdWVzdCBleHBlY3RlZCcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCBIVFRQIG1ldGhvZC5cbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKSk9fSBkYXRhIEhUVFAgcmVxdWVzdCBib2R5IG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXNcbiAgICogICBkYXRhIHN0cmluZyBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBkYXRhIGlzIGFzIGV4cGVjdGVkLlxuICAgKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycyBvciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGh0dHAgaGVhZGVyXG4gICAqICAgb2JqZWN0IGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGhlYWRlcnMgbWF0Y2ggdGhlIGN1cnJlbnQgZGVmaW5pdGlvbi5cbiAgICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBtZXRob2QgdGhhdCBjb250cm9scyBob3cgYSBtYXRjaGVkXG4gICAqICAgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKlxuICAgKiAgLSByZXNwb25kIMOi4oKs4oCcXG4gICAqICAgICAgYHtmdW5jdGlvbihbc3RhdHVzLF0gZGF0YVssIGhlYWRlcnMsIHN0YXR1c1RleHRdKVxuICAgKiAgICAgIHwgZnVuY3Rpb24oZnVuY3Rpb24obWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMpfWBcbiAgICogICAgw6LigqzigJwgVGhlIHJlc3BvbmQgbWV0aG9kIHRha2VzIGEgc2V0IG9mIHN0YXRpYyBkYXRhIHRvIGJlIHJldHVybmVkIG9yIGEgZnVuY3Rpb24gdGhhdCBjYW5cbiAgICogICAgcmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgcmVzcG9uc2Ugc3RhdHVzIChudW1iZXIpLCByZXNwb25zZSBkYXRhIChzdHJpbmcpLCByZXNwb25zZVxuICAgKiAgICBoZWFkZXJzIChPYmplY3QpLCBhbmQgdGhlIHRleHQgZm9yIHRoZSBzdGF0dXMgKHN0cmluZykuXG4gICAqL1xuICAkaHR0cEJhY2tlbmQud2hlbiA9IGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBoZWFkZXJzKSB7XG4gICAgdmFyIGRlZmluaXRpb24gPSBuZXcgTW9ja0h0dHBFeHBlY3RhdGlvbihtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycyksXG4gICAgICAgIGNoYWluID0ge1xuICAgICAgICAgIHJlc3BvbmQ6IGZ1bmN0aW9uKHN0YXR1cywgZGF0YSwgaGVhZGVycywgc3RhdHVzVGV4dCkge1xuICAgICAgICAgICAgZGVmaW5pdGlvbi5yZXNwb25zZSA9IGNyZWF0ZVJlc3BvbnNlKHN0YXR1cywgZGF0YSwgaGVhZGVycywgc3RhdHVzVGV4dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgaWYgKCRicm93c2VyKSB7XG4gICAgICBjaGFpbi5wYXNzVGhyb3VnaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBkZWZpbml0aW9uLnBhc3NUaHJvdWdoID0gdHJ1ZTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZGVmaW5pdGlvbnMucHVzaChkZWZpbml0aW9uKTtcbiAgICByZXR1cm4gY2hhaW47XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5HRVRcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBHRVQgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGB3aGVuKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAgICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKE9iamVjdCkpPX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbCBob3cgYSBtYXRjaGVkXG4gICAqIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5IRUFEXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiBmb3IgSEVBRCByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICAgKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAgICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBtZXRob2QgdGhhdCBjb250cm9sIGhvdyBhIG1hdGNoZWRcbiAgICogcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlbkRFTEVURVxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIG5ldyBiYWNrZW5kIGRlZmluaXRpb24gZm9yIERFTEVURSByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICAgKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAgICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBtZXRob2QgdGhhdCBjb250cm9sIGhvdyBhIG1hdGNoZWRcbiAgICogcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlblBPU1RcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBQT1NUIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgd2hlbigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKSk9fSBkYXRhIEhUVFAgcmVxdWVzdCBib2R5IG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXNcbiAgICogICBkYXRhIHN0cmluZyBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBkYXRhIGlzIGFzIGV4cGVjdGVkLlxuICAgKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAgICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBtZXRob2QgdGhhdCBjb250cm9sIGhvdyBhIG1hdGNoZWRcbiAgICogcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlblBVVFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIG5ldyBiYWNrZW5kIGRlZmluaXRpb24gZm9yIFBVVCByZXF1ZXN0cy4gIEZvciBtb3JlIGluZm8gc2VlIGB3aGVuKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cHxmdW5jdGlvbihzdHJpbmcpKT19IGRhdGEgSFRUUCByZXF1ZXN0IGJvZHkgb3IgZnVuY3Rpb24gdGhhdCByZWNlaXZlc1xuICAgKiAgIGRhdGEgc3RyaW5nIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGRhdGEgaXMgYXMgZXhwZWN0ZWQuXG4gICAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbihPYmplY3QpKT19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2wgaG93IGEgbWF0Y2hlZFxuICAgKiByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuSlNPTlBcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBKU09OUCByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2wgaG93IGEgbWF0Y2hlZFxuICAgKiByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gICAqL1xuICBjcmVhdGVTaG9ydE1ldGhvZHMoJ3doZW4nKTtcblxuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCNleHBlY3RcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgcmVxdWVzdCBleHBlY3RhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCBIVFRQIG1ldGhvZC5cbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKXxPYmplY3QpPX0gZGF0YSBIVFRQIHJlcXVlc3QgYm9keSBvciBmdW5jdGlvbiB0aGF0XG4gICAqICByZWNlaXZlcyBkYXRhIHN0cmluZyBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBkYXRhIGlzIGFzIGV4cGVjdGVkLCBvciBPYmplY3QgaWYgcmVxdWVzdCBib2R5XG4gICAqICBpcyBpbiBKU09OIGZvcm1hdC5cbiAgICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKE9iamVjdCkpPX0gaGVhZGVycyBIVFRQIGhlYWRlcnMgb3IgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBodHRwIGhlYWRlclxuICAgKiAgIG9iamVjdCBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBoZWFkZXJzIG1hdGNoIHRoZSBjdXJyZW50IGV4cGVjdGF0aW9uLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2wgaG93IGEgbWF0Y2hlZFxuICAgKiAgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKlxuICAgKiAgLSByZXNwb25kIMOi4oKs4oCcXG4gICAqICAgIGB7ZnVuY3Rpb24oW3N0YXR1cyxdIGRhdGFbLCBoZWFkZXJzLCBzdGF0dXNUZXh0XSlcbiAgICogICAgfCBmdW5jdGlvbihmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycyl9YFxuICAgKiAgICDDouKCrOKAnCBUaGUgcmVzcG9uZCBtZXRob2QgdGFrZXMgYSBzZXQgb2Ygc3RhdGljIGRhdGEgdG8gYmUgcmV0dXJuZWQgb3IgYSBmdW5jdGlvbiB0aGF0IGNhblxuICAgKiAgICByZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyByZXNwb25zZSBzdGF0dXMgKG51bWJlciksIHJlc3BvbnNlIGRhdGEgKHN0cmluZyksIHJlc3BvbnNlXG4gICAqICAgIGhlYWRlcnMgKE9iamVjdCksIGFuZCB0aGUgdGV4dCBmb3IgdGhlIHN0YXR1cyAoc3RyaW5nKS5cbiAgICovXG4gICRodHRwQmFja2VuZC5leHBlY3QgPSBmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycykge1xuICAgIHZhciBleHBlY3RhdGlvbiA9IG5ldyBNb2NrSHR0cEV4cGVjdGF0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBoZWFkZXJzKTtcbiAgICBleHBlY3RhdGlvbnMucHVzaChleHBlY3RhdGlvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3BvbmQ6IGZ1bmN0aW9uIChzdGF0dXMsIGRhdGEsIGhlYWRlcnMsIHN0YXR1c1RleHQpIHtcbiAgICAgICAgZXhwZWN0YXRpb24ucmVzcG9uc2UgPSBjcmVhdGVSZXNwb25zZShzdGF0dXMsIGRhdGEsIGhlYWRlcnMsIHN0YXR1c1RleHQpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjZXhwZWN0R0VUXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IHJlcXVlc3QgZXhwZWN0YXRpb24gZm9yIEdFVCByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYGV4cGVjdCgpYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbCBob3cgYSBtYXRjaGVkXG4gICAqIHJlcXVlc3QgaXMgaGFuZGxlZC4gU2VlICNleHBlY3QgZm9yIG1vcmUgaW5mby5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI2V4cGVjdEhFQURcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgcmVxdWVzdCBleHBlY3RhdGlvbiBmb3IgSEVBRCByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYGV4cGVjdCgpYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbCBob3cgYSBtYXRjaGVkXG4gICAqICAgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjZXhwZWN0REVMRVRFXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IHJlcXVlc3QgZXhwZWN0YXRpb24gZm9yIERFTEVURSByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYGV4cGVjdCgpYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbCBob3cgYSBtYXRjaGVkXG4gICAqICAgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjZXhwZWN0UE9TVFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIG5ldyByZXF1ZXN0IGV4cGVjdGF0aW9uIGZvciBQT1NUIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgZXhwZWN0KClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cHxmdW5jdGlvbihzdHJpbmcpfE9iamVjdCk9fSBkYXRhIEhUVFAgcmVxdWVzdCBib2R5IG9yIGZ1bmN0aW9uIHRoYXRcbiAgICogIHJlY2VpdmVzIGRhdGEgc3RyaW5nIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGRhdGEgaXMgYXMgZXhwZWN0ZWQsIG9yIE9iamVjdCBpZiByZXF1ZXN0IGJvZHlcbiAgICogIGlzIGluIEpTT04gZm9ybWF0LlxuICAgKiBAcGFyYW0ge09iamVjdD19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2wgaG93IGEgbWF0Y2hlZFxuICAgKiAgIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI2V4cGVjdFBVVFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIG5ldyByZXF1ZXN0IGV4cGVjdGF0aW9uIGZvciBQVVQgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGBleHBlY3QoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZyl8T2JqZWN0KT19IGRhdGEgSFRUUCByZXF1ZXN0IGJvZHkgb3IgZnVuY3Rpb24gdGhhdFxuICAgKiAgcmVjZWl2ZXMgZGF0YSBzdHJpbmcgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgZGF0YSBpcyBhcyBleHBlY3RlZCwgb3IgT2JqZWN0IGlmIHJlcXVlc3QgYm9keVxuICAgKiAgaXMgaW4gSlNPTiBmb3JtYXQuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbCBob3cgYSBtYXRjaGVkXG4gICAqICAgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjZXhwZWN0UEFUQ0hcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgcmVxdWVzdCBleHBlY3RhdGlvbiBmb3IgUEFUQ0ggcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGBleHBlY3QoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZyl8T2JqZWN0KT19IGRhdGEgSFRUUCByZXF1ZXN0IGJvZHkgb3IgZnVuY3Rpb24gdGhhdFxuICAgKiAgcmVjZWl2ZXMgZGF0YSBzdHJpbmcgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgZGF0YSBpcyBhcyBleHBlY3RlZCwgb3IgT2JqZWN0IGlmIHJlcXVlc3QgYm9keVxuICAgKiAgaXMgaW4gSlNPTiBmb3JtYXQuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbCBob3cgYSBtYXRjaGVkXG4gICAqICAgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjZXhwZWN0SlNPTlBcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgcmVxdWVzdCBleHBlY3RhdGlvbiBmb3IgSlNPTlAgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGBleHBlY3QoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2wgaG93IGEgbWF0Y2hlZFxuICAgKiAgIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICovXG4gIGNyZWF0ZVNob3J0TWV0aG9kcygnZXhwZWN0Jyk7XG5cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjZmx1c2hcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEZsdXNoZXMgYWxsIHBlbmRpbmcgcmVxdWVzdHMgdXNpbmcgdGhlIHRyYWluZWQgcmVzcG9uc2VzLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGNvdW50IE51bWJlciBvZiByZXNwb25zZXMgdG8gZmx1c2ggKGluIHRoZSBvcmRlciB0aGV5IGFycml2ZWQpLiBJZiB1bmRlZmluZWQsXG4gICAqICAgYWxsIHBlbmRpbmcgcmVxdWVzdHMgd2lsbCBiZSBmbHVzaGVkLiBJZiB0aGVyZSBhcmUgbm8gcGVuZGluZyByZXF1ZXN0cyB3aGVuIHRoZSBmbHVzaCBtZXRob2RcbiAgICogICBpcyBjYWxsZWQgYW4gZXhjZXB0aW9uIGlzIHRocm93biAoYXMgdGhpcyB0eXBpY2FsbHkgYSBzaWduIG9mIHByb2dyYW1taW5nIGVycm9yKS5cbiAgICovXG4gICRodHRwQmFja2VuZC5mbHVzaCA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XG4gICAgaWYgKCFyZXNwb25zZXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ05vIHBlbmRpbmcgcmVxdWVzdCB0byBmbHVzaCAhJyk7XG5cbiAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoY291bnQpKSB7XG4gICAgICB3aGlsZSAoY291bnQtLSkge1xuICAgICAgICBpZiAoIXJlc3BvbnNlcy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignTm8gbW9yZSBwZW5kaW5nIHJlcXVlc3QgdG8gZmx1c2ggIScpO1xuICAgICAgICByZXNwb25zZXMuc2hpZnQoKSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAocmVzcG9uc2VzLmxlbmd0aCkge1xuICAgICAgICByZXNwb25zZXMuc2hpZnQoKSgpO1xuICAgICAgfVxuICAgIH1cbiAgICAkaHR0cEJhY2tlbmQudmVyaWZ5Tm9PdXRzdGFuZGluZ0V4cGVjdGF0aW9uKCk7XG4gIH07XG5cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjdmVyaWZ5Tm9PdXRzdGFuZGluZ0V4cGVjdGF0aW9uXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBWZXJpZmllcyB0aGF0IGFsbCBvZiB0aGUgcmVxdWVzdHMgZGVmaW5lZCB2aWEgdGhlIGBleHBlY3RgIGFwaSB3ZXJlIG1hZGUuIElmIGFueSBvZiB0aGVcbiAgICogcmVxdWVzdHMgd2VyZSBub3QgbWFkZSwgdmVyaWZ5Tm9PdXRzdGFuZGluZ0V4cGVjdGF0aW9uIHRocm93cyBhbiBleGNlcHRpb24uXG4gICAqXG4gICAqIFR5cGljYWxseSwgeW91IHdvdWxkIGNhbGwgdGhpcyBtZXRob2QgZm9sbG93aW5nIGVhY2ggdGVzdCBjYXNlIHRoYXQgYXNzZXJ0cyByZXF1ZXN0cyB1c2luZyBhblxuICAgKiBcImFmdGVyRWFjaFwiIGNsYXVzZS5cbiAgICpcbiAgICogYGBganNcbiAgICogICBhZnRlckVhY2goJGh0dHBCYWNrZW5kLnZlcmlmeU5vT3V0c3RhbmRpbmdFeHBlY3RhdGlvbik7XG4gICAqIGBgYFxuICAgKi9cbiAgJGh0dHBCYWNrZW5kLnZlcmlmeU5vT3V0c3RhbmRpbmdFeHBlY3RhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICRyb290U2NvcGUuJGRpZ2VzdCgpO1xuICAgIGlmIChleHBlY3RhdGlvbnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc2F0aXNmaWVkIHJlcXVlc3RzOiAnICsgZXhwZWN0YXRpb25zLmpvaW4oJywgJykpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCN2ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVmVyaWZpZXMgdGhhdCB0aGVyZSBhcmUgbm8gb3V0c3RhbmRpbmcgcmVxdWVzdHMgdGhhdCBuZWVkIHRvIGJlIGZsdXNoZWQuXG4gICAqXG4gICAqIFR5cGljYWxseSwgeW91IHdvdWxkIGNhbGwgdGhpcyBtZXRob2QgZm9sbG93aW5nIGVhY2ggdGVzdCBjYXNlIHRoYXQgYXNzZXJ0cyByZXF1ZXN0cyB1c2luZyBhblxuICAgKiBcImFmdGVyRWFjaFwiIGNsYXVzZS5cbiAgICpcbiAgICogYGBganNcbiAgICogICBhZnRlckVhY2goJGh0dHBCYWNrZW5kLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KTtcbiAgICogYGBgXG4gICAqL1xuICAkaHR0cEJhY2tlbmQudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAocmVzcG9uc2VzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmZsdXNoZWQgcmVxdWVzdHM6ICcgKyByZXNwb25zZXMubGVuZ3RoKTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjcmVzZXRFeHBlY3RhdGlvbnNcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlc2V0cyBhbGwgcmVxdWVzdCBleHBlY3RhdGlvbnMsIGJ1dCBwcmVzZXJ2ZXMgYWxsIGJhY2tlbmQgZGVmaW5pdGlvbnMuIFR5cGljYWxseSwgeW91IHdvdWxkXG4gICAqIGNhbGwgcmVzZXRFeHBlY3RhdGlvbnMgZHVyaW5nIGEgbXVsdGlwbGUtcGhhc2UgdGVzdCB3aGVuIHlvdSB3YW50IHRvIHJldXNlIHRoZSBzYW1lIGluc3RhbmNlIG9mXG4gICAqICRodHRwQmFja2VuZCBtb2NrLlxuICAgKi9cbiAgJGh0dHBCYWNrZW5kLnJlc2V0RXhwZWN0YXRpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgZXhwZWN0YXRpb25zLmxlbmd0aCA9IDA7XG4gICAgcmVzcG9uc2VzLmxlbmd0aCA9IDA7XG4gIH07XG5cbiAgcmV0dXJuICRodHRwQmFja2VuZDtcblxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNob3J0TWV0aG9kcyhwcmVmaXgpIHtcbiAgICBhbmd1bGFyLmZvckVhY2goWydHRVQnLCAnREVMRVRFJywgJ0pTT05QJ10sIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAkaHR0cEJhY2tlbmRbcHJlZml4ICsgbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgaGVhZGVycykge1xuICAgICAgIHJldHVybiAkaHR0cEJhY2tlbmRbcHJlZml4XShtZXRob2QsIHVybCwgdW5kZWZpbmVkLCBoZWFkZXJzKTtcbiAgICAgfTtcbiAgICB9KTtcblxuICAgIGFuZ3VsYXIuZm9yRWFjaChbJ1BVVCcsICdQT1NUJywgJ1BBVENIJ10sIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgJGh0dHBCYWNrZW5kW3ByZWZpeCArIG1ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGhlYWRlcnMpIHtcbiAgICAgICAgcmV0dXJuICRodHRwQmFja2VuZFtwcmVmaXhdKG1ldGhvZCwgdXJsLCBkYXRhLCBoZWFkZXJzKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gTW9ja0h0dHBFeHBlY3RhdGlvbihtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycykge1xuXG4gIHRoaXMuZGF0YSA9IGRhdGE7XG4gIHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XG5cbiAgdGhpcy5tYXRjaCA9IGZ1bmN0aW9uKG0sIHUsIGQsIGgpIHtcbiAgICBpZiAobWV0aG9kICE9IG0pIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIXRoaXMubWF0Y2hVcmwodSkpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoZCkgJiYgIXRoaXMubWF0Y2hEYXRhKGQpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGgpICYmICF0aGlzLm1hdGNoSGVhZGVycyhoKSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIHRoaXMubWF0Y2hVcmwgPSBmdW5jdGlvbih1KSB7XG4gICAgaWYgKCF1cmwpIHJldHVybiB0cnVlO1xuICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24odXJsLnRlc3QpKSByZXR1cm4gdXJsLnRlc3QodSk7XG4gICAgcmV0dXJuIHVybCA9PSB1O1xuICB9O1xuXG4gIHRoaXMubWF0Y2hIZWFkZXJzID0gZnVuY3Rpb24oaCkge1xuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGhlYWRlcnMpKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGhlYWRlcnMpKSByZXR1cm4gaGVhZGVycyhoKTtcbiAgICByZXR1cm4gYW5ndWxhci5lcXVhbHMoaGVhZGVycywgaCk7XG4gIH07XG5cbiAgdGhpcy5tYXRjaERhdGEgPSBmdW5jdGlvbihkKSB7XG4gICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZGF0YSkpIHJldHVybiB0cnVlO1xuICAgIGlmIChkYXRhICYmIGFuZ3VsYXIuaXNGdW5jdGlvbihkYXRhLnRlc3QpKSByZXR1cm4gZGF0YS50ZXN0KGQpO1xuICAgIGlmIChkYXRhICYmIGFuZ3VsYXIuaXNGdW5jdGlvbihkYXRhKSkgcmV0dXJuIGRhdGEoZCk7XG4gICAgaWYgKGRhdGEgJiYgIWFuZ3VsYXIuaXNTdHJpbmcoZGF0YSkpIHJldHVybiBhbmd1bGFyLmVxdWFscyhkYXRhLCBhbmd1bGFyLmZyb21Kc29uKGQpKTtcbiAgICByZXR1cm4gZGF0YSA9PSBkO1xuICB9O1xuXG4gIHRoaXMudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbWV0aG9kICsgJyAnICsgdXJsO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNb2NrWGhyKCkge1xuICByZXR1cm4gbmV3IE1vY2tYaHIoKTtcbn1cblxuZnVuY3Rpb24gTW9ja1hocigpIHtcblxuICAvLyBoYWNrIGZvciB0ZXN0aW5nICRodHRwLCAkaHR0cEJhY2tlbmRcbiAgTW9ja1hoci4kJGxhc3RJbnN0YW5jZSA9IHRoaXM7XG5cbiAgdGhpcy5vcGVuID0gZnVuY3Rpb24obWV0aG9kLCB1cmwsIGFzeW5jKSB7XG4gICAgdGhpcy4kJG1ldGhvZCA9IG1ldGhvZDtcbiAgICB0aGlzLiQkdXJsID0gdXJsO1xuICAgIHRoaXMuJCRhc3luYyA9IGFzeW5jO1xuICAgIHRoaXMuJCRyZXFIZWFkZXJzID0ge307XG4gICAgdGhpcy4kJHJlc3BIZWFkZXJzID0ge307XG4gIH07XG5cbiAgdGhpcy5zZW5kID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHRoaXMuJCRkYXRhID0gZGF0YTtcbiAgfTtcblxuICB0aGlzLnNldFJlcXVlc3RIZWFkZXIgPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgdGhpcy4kJHJlcUhlYWRlcnNba2V5XSA9IHZhbHVlO1xuICB9O1xuXG4gIHRoaXMuZ2V0UmVzcG9uc2VIZWFkZXIgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgLy8gdGhlIGxvb2t1cCBtdXN0IGJlIGNhc2UgaW5zZW5zaXRpdmUsXG4gICAgLy8gdGhhdCdzIHdoeSB3ZSB0cnkgdHdvIHF1aWNrIGxvb2t1cHMgZmlyc3QgYW5kIGZ1bGwgc2NhbiBsYXN0XG4gICAgdmFyIGhlYWRlciA9IHRoaXMuJCRyZXNwSGVhZGVyc1tuYW1lXTtcbiAgICBpZiAoaGVhZGVyKSByZXR1cm4gaGVhZGVyO1xuXG4gICAgbmFtZSA9IGFuZ3VsYXIubG93ZXJjYXNlKG5hbWUpO1xuICAgIGhlYWRlciA9IHRoaXMuJCRyZXNwSGVhZGVyc1tuYW1lXTtcbiAgICBpZiAoaGVhZGVyKSByZXR1cm4gaGVhZGVyO1xuXG4gICAgaGVhZGVyID0gdW5kZWZpbmVkO1xuICAgIGFuZ3VsYXIuZm9yRWFjaCh0aGlzLiQkcmVzcEhlYWRlcnMsIGZ1bmN0aW9uKGhlYWRlclZhbCwgaGVhZGVyTmFtZSkge1xuICAgICAgaWYgKCFoZWFkZXIgJiYgYW5ndWxhci5sb3dlcmNhc2UoaGVhZGVyTmFtZSkgPT0gbmFtZSkgaGVhZGVyID0gaGVhZGVyVmFsO1xuICAgIH0pO1xuICAgIHJldHVybiBoZWFkZXI7XG4gIH07XG5cbiAgdGhpcy5nZXRBbGxSZXNwb25zZUhlYWRlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGluZXMgPSBbXTtcblxuICAgIGFuZ3VsYXIuZm9yRWFjaCh0aGlzLiQkcmVzcEhlYWRlcnMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgIGxpbmVzLnB1c2goa2V5ICsgJzogJyArIHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG4gIH07XG5cbiAgdGhpcy5hYm9ydCA9IGFuZ3VsYXIubm9vcDtcbn1cblxuXG4vKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSAkdGltZW91dFxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIGp1c3QgYSBzaW1wbGUgZGVjb3JhdG9yIGZvciB7QGxpbmsgbmcuJHRpbWVvdXQgJHRpbWVvdXR9IHNlcnZpY2VcbiAqIHRoYXQgYWRkcyBhIFwiZmx1c2hcIiBhbmQgXCJ2ZXJpZnlOb1BlbmRpbmdUYXNrc1wiIG1ldGhvZHMuXG4gKi9cblxuYW5ndWxhci5tb2NrLiRUaW1lb3V0RGVjb3JhdG9yID0gZnVuY3Rpb24oJGRlbGVnYXRlLCAkYnJvd3Nlcikge1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICR0aW1lb3V0I2ZsdXNoXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBGbHVzaGVzIHRoZSBxdWV1ZSBvZiBwZW5kaW5nIHRhc2tzLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGRlbGF5IG1heGltdW0gdGltZW91dCBhbW91bnQgdG8gZmx1c2ggdXAgdW50aWxcbiAgICovXG4gICRkZWxlZ2F0ZS5mbHVzaCA9IGZ1bmN0aW9uKGRlbGF5KSB7XG4gICAgJGJyb3dzZXIuZGVmZXIuZmx1c2goZGVsYXkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICR0aW1lb3V0I3ZlcmlmeU5vUGVuZGluZ1Rhc2tzXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBWZXJpZmllcyB0aGF0IHRoZXJlIGFyZSBubyBwZW5kaW5nIHRhc2tzIHRoYXQgbmVlZCB0byBiZSBmbHVzaGVkLlxuICAgKi9cbiAgJGRlbGVnYXRlLnZlcmlmeU5vUGVuZGluZ1Rhc2tzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCRicm93c2VyLmRlZmVycmVkRm5zLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdEZWZlcnJlZCB0YXNrcyB0byBmbHVzaCAoJyArICRicm93c2VyLmRlZmVycmVkRm5zLmxlbmd0aCArICcpOiAnICtcbiAgICAgICAgICBmb3JtYXRQZW5kaW5nVGFza3NBc1N0cmluZygkYnJvd3Nlci5kZWZlcnJlZEZucykpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBmb3JtYXRQZW5kaW5nVGFza3NBc1N0cmluZyh0YXNrcykge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBhbmd1bGFyLmZvckVhY2godGFza3MsIGZ1bmN0aW9uKHRhc2spIHtcbiAgICAgIHJlc3VsdC5wdXNoKCd7aWQ6ICcgKyB0YXNrLmlkICsgJywgJyArICd0aW1lOiAnICsgdGFzay50aW1lICsgJ30nKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQuam9pbignLCAnKTtcbiAgfVxuXG4gIHJldHVybiAkZGVsZWdhdGU7XG59O1xuXG5hbmd1bGFyLm1vY2suJFJBRkRlY29yYXRvciA9IGZ1bmN0aW9uKCRkZWxlZ2F0ZSkge1xuICB2YXIgcXVldWUgPSBbXTtcbiAgdmFyIHJhZkZuID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgaW5kZXggPSBxdWV1ZS5sZW5ndGg7XG4gICAgcXVldWUucHVzaChmbik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcXVldWUuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9O1xuICB9O1xuXG4gIHJhZkZuLnN1cHBvcnRlZCA9ICRkZWxlZ2F0ZS5zdXBwb3J0ZWQ7XG5cbiAgcmFmRm4uZmx1c2ggPSBmdW5jdGlvbigpIHtcbiAgICBpZihxdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gckFGIGNhbGxiYWNrcyBwcmVzZW50Jyk7XG4gICAgfVxuXG4gICAgdmFyIGxlbmd0aCA9IHF1ZXVlLmxlbmd0aDtcbiAgICBmb3IodmFyIGk9MDtpPGxlbmd0aDtpKyspIHtcbiAgICAgIHF1ZXVlW2ldKCk7XG4gICAgfVxuXG4gICAgcXVldWUgPSBbXTtcbiAgfTtcblxuICByZXR1cm4gcmFmRm47XG59O1xuXG5hbmd1bGFyLm1vY2suJEFzeW5jQ2FsbGJhY2tEZWNvcmF0b3IgPSBmdW5jdGlvbigkZGVsZWdhdGUpIHtcbiAgdmFyIGNhbGxiYWNrcyA9IFtdO1xuICB2YXIgYWRkRm4gPSBmdW5jdGlvbihmbikge1xuICAgIGNhbGxiYWNrcy5wdXNoKGZuKTtcbiAgfTtcbiAgYWRkRm4uZmx1c2ggPSBmdW5jdGlvbigpIHtcbiAgICBhbmd1bGFyLmZvckVhY2goY2FsbGJhY2tzLCBmdW5jdGlvbihmbikge1xuICAgICAgZm4oKTtcbiAgICB9KTtcbiAgICBjYWxsYmFja3MgPSBbXTtcbiAgfTtcbiAgcmV0dXJuIGFkZEZuO1xufTtcblxuLyoqXG4gKlxuICovXG5hbmd1bGFyLm1vY2suJFJvb3RFbGVtZW50UHJvdmlkZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudCgnPGRpdiBuZy1hcHA+PC9kaXY+Jyk7XG4gIH07XG59O1xuXG4vKipcbiAqIEBuZ2RvYyBtb2R1bGVcbiAqIEBuYW1lIG5nTW9ja1xuICogQHBhY2thZ2VOYW1lIGFuZ3VsYXItbW9ja3NcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqICMgbmdNb2NrXG4gKlxuICogVGhlIGBuZ01vY2tgIG1vZHVsZSBwcm92aWRlcyBzdXBwb3J0IHRvIGluamVjdCBhbmQgbW9jayBBbmd1bGFyIHNlcnZpY2VzIGludG8gdW5pdCB0ZXN0cy5cbiAqIEluIGFkZGl0aW9uLCBuZ01vY2sgYWxzbyBleHRlbmRzIHZhcmlvdXMgY29yZSBuZyBzZXJ2aWNlcyBzdWNoIHRoYXQgdGhleSBjYW4gYmVcbiAqIGluc3BlY3RlZCBhbmQgY29udHJvbGxlZCBpbiBhIHN5bmNocm9ub3VzIG1hbm5lciB3aXRoaW4gdGVzdCBjb2RlLlxuICpcbiAqXG4gKiA8ZGl2IGRvYy1tb2R1bGUtY29tcG9uZW50cz1cIm5nTW9ja1wiPjwvZGl2PlxuICpcbiAqL1xuYW5ndWxhci5tb2R1bGUoJ25nTW9jaycsIFsnbmcnXSkucHJvdmlkZXIoe1xuICAkYnJvd3NlcjogYW5ndWxhci5tb2NrLiRCcm93c2VyUHJvdmlkZXIsXG4gICRleGNlcHRpb25IYW5kbGVyOiBhbmd1bGFyLm1vY2suJEV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlcixcbiAgJGxvZzogYW5ndWxhci5tb2NrLiRMb2dQcm92aWRlcixcbiAgJGludGVydmFsOiBhbmd1bGFyLm1vY2suJEludGVydmFsUHJvdmlkZXIsXG4gICRodHRwQmFja2VuZDogYW5ndWxhci5tb2NrLiRIdHRwQmFja2VuZFByb3ZpZGVyLFxuICAkcm9vdEVsZW1lbnQ6IGFuZ3VsYXIubW9jay4kUm9vdEVsZW1lbnRQcm92aWRlclxufSkuY29uZmlnKFsnJHByb3ZpZGUnLCBmdW5jdGlvbigkcHJvdmlkZSkge1xuICAkcHJvdmlkZS5kZWNvcmF0b3IoJyR0aW1lb3V0JywgYW5ndWxhci5tb2NrLiRUaW1lb3V0RGVjb3JhdG9yKTtcbiAgJHByb3ZpZGUuZGVjb3JhdG9yKCckJHJBRicsIGFuZ3VsYXIubW9jay4kUkFGRGVjb3JhdG9yKTtcbiAgJHByb3ZpZGUuZGVjb3JhdG9yKCckJGFzeW5jQ2FsbGJhY2snLCBhbmd1bGFyLm1vY2suJEFzeW5jQ2FsbGJhY2tEZWNvcmF0b3IpO1xufV0pO1xuXG4vKipcbiAqIEBuZ2RvYyBtb2R1bGVcbiAqIEBuYW1lIG5nTW9ja0UyRVxuICogQG1vZHVsZSBuZ01vY2tFMkVcbiAqIEBwYWNrYWdlTmFtZSBhbmd1bGFyLW1vY2tzXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBUaGUgYG5nTW9ja0UyRWAgaXMgYW4gYW5ndWxhciBtb2R1bGUgd2hpY2ggY29udGFpbnMgbW9ja3Mgc3VpdGFibGUgZm9yIGVuZC10by1lbmQgdGVzdGluZy5cbiAqIEN1cnJlbnRseSB0aGVyZSBpcyBvbmx5IG9uZSBtb2NrIHByZXNlbnQgaW4gdGhpcyBtb2R1bGUgLVxuICogdGhlIHtAbGluayBuZ01vY2tFMkUuJGh0dHBCYWNrZW5kIGUyZSAkaHR0cEJhY2tlbmR9IG1vY2suXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCduZ01vY2tFMkUnLCBbJ25nJ10pLmNvbmZpZyhbJyRwcm92aWRlJywgZnVuY3Rpb24oJHByb3ZpZGUpIHtcbiAgJHByb3ZpZGUuZGVjb3JhdG9yKCckaHR0cEJhY2tlbmQnLCBhbmd1bGFyLm1vY2suZTJlLiRodHRwQmFja2VuZERlY29yYXRvcik7XG59XSk7XG5cbi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lICRodHRwQmFja2VuZFxuICogQG1vZHVsZSBuZ01vY2tFMkVcbiAqIEBkZXNjcmlwdGlvblxuICogRmFrZSBIVFRQIGJhY2tlbmQgaW1wbGVtZW50YXRpb24gc3VpdGFibGUgZm9yIGVuZC10by1lbmQgdGVzdGluZyBvciBiYWNrZW5kLWxlc3MgZGV2ZWxvcG1lbnQgb2ZcbiAqIGFwcGxpY2F0aW9ucyB0aGF0IHVzZSB0aGUge0BsaW5rIG5nLiRodHRwICRodHRwIHNlcnZpY2V9LlxuICpcbiAqICpOb3RlKjogRm9yIGZha2UgaHR0cCBiYWNrZW5kIGltcGxlbWVudGF0aW9uIHN1aXRhYmxlIGZvciB1bml0IHRlc3RpbmcgcGxlYXNlIHNlZVxuICoge0BsaW5rIG5nTW9jay4kaHR0cEJhY2tlbmQgdW5pdC10ZXN0aW5nICRodHRwQmFja2VuZCBtb2NrfS5cbiAqXG4gKiBUaGlzIGltcGxlbWVudGF0aW9uIGNhbiBiZSB1c2VkIHRvIHJlc3BvbmQgd2l0aCBzdGF0aWMgb3IgZHluYW1pYyByZXNwb25zZXMgdmlhIHRoZSBgd2hlbmAgYXBpXG4gKiBhbmQgaXRzIHNob3J0Y3V0cyAoYHdoZW5HRVRgLCBgd2hlblBPU1RgLCBldGMpIGFuZCBvcHRpb25hbGx5IHBhc3MgdGhyb3VnaCByZXF1ZXN0cyB0byB0aGVcbiAqIHJlYWwgJGh0dHBCYWNrZW5kIGZvciBzcGVjaWZpYyByZXF1ZXN0cyAoZS5nLiB0byBpbnRlcmFjdCB3aXRoIGNlcnRhaW4gcmVtb3RlIGFwaXMgb3IgdG8gZmV0Y2hcbiAqIHRlbXBsYXRlcyBmcm9tIGEgd2Vic2VydmVyKS5cbiAqXG4gKiBBcyBvcHBvc2VkIHRvIHVuaXQtdGVzdGluZywgaW4gYW4gZW5kLXRvLWVuZCB0ZXN0aW5nIHNjZW5hcmlvIG9yIGluIHNjZW5hcmlvIHdoZW4gYW4gYXBwbGljYXRpb25cbiAqIGlzIGJlaW5nIGRldmVsb3BlZCB3aXRoIHRoZSByZWFsIGJhY2tlbmQgYXBpIHJlcGxhY2VkIHdpdGggYSBtb2NrLCBpdCBpcyBvZnRlbiBkZXNpcmFibGUgZm9yXG4gKiBjZXJ0YWluIGNhdGVnb3J5IG9mIHJlcXVlc3RzIHRvIGJ5cGFzcyB0aGUgbW9jayBhbmQgaXNzdWUgYSByZWFsIGh0dHAgcmVxdWVzdCAoZS5nLiB0byBmZXRjaFxuICogdGVtcGxhdGVzIG9yIHN0YXRpYyBmaWxlcyBmcm9tIHRoZSB3ZWJzZXJ2ZXIpLiBUbyBjb25maWd1cmUgdGhlIGJhY2tlbmQgd2l0aCB0aGlzIGJlaGF2aW9yXG4gKiB1c2UgdGhlIGBwYXNzVGhyb3VnaGAgcmVxdWVzdCBoYW5kbGVyIG9mIGB3aGVuYCBpbnN0ZWFkIG9mIGByZXNwb25kYC5cbiAqXG4gKiBBZGRpdGlvbmFsbHksIHdlIGRvbid0IHdhbnQgdG8gbWFudWFsbHkgaGF2ZSB0byBmbHVzaCBtb2NrZWQgb3V0IHJlcXVlc3RzIGxpa2Ugd2UgZG8gZHVyaW5nIHVuaXRcbiAqIHRlc3RpbmcuIEZvciB0aGlzIHJlYXNvbiB0aGUgZTJlICRodHRwQmFja2VuZCBmbHVzaGVzIG1vY2tlZCBvdXQgcmVxdWVzdHNcbiAqIGF1dG9tYXRpY2FsbHksIGNsb3NlbHkgc2ltdWxhdGluZyB0aGUgYmVoYXZpb3Igb2YgdGhlIFhNTEh0dHBSZXF1ZXN0IG9iamVjdC5cbiAqXG4gKiBUbyBzZXR1cCB0aGUgYXBwbGljYXRpb24gdG8gcnVuIHdpdGggdGhpcyBodHRwIGJhY2tlbmQsIHlvdSBoYXZlIHRvIGNyZWF0ZSBhIG1vZHVsZSB0aGF0IGRlcGVuZHNcbiAqIG9uIHRoZSBgbmdNb2NrRTJFYCBhbmQgeW91ciBhcHBsaWNhdGlvbiBtb2R1bGVzIGFuZCBkZWZpbmVzIHRoZSBmYWtlIGJhY2tlbmQ6XG4gKlxuICogYGBganNcbiAqICAgbXlBcHBEZXYgPSBhbmd1bGFyLm1vZHVsZSgnbXlBcHBEZXYnLCBbJ215QXBwJywgJ25nTW9ja0UyRSddKTtcbiAqICAgbXlBcHBEZXYucnVuKGZ1bmN0aW9uKCRodHRwQmFja2VuZCkge1xuICogICAgIHBob25lcyA9IFt7bmFtZTogJ3Bob25lMSd9LCB7bmFtZTogJ3Bob25lMid9XTtcbiAqXG4gKiAgICAgLy8gcmV0dXJucyB0aGUgY3VycmVudCBsaXN0IG9mIHBob25lc1xuICogICAgICRodHRwQmFja2VuZC53aGVuR0VUKCcvcGhvbmVzJykucmVzcG9uZChwaG9uZXMpO1xuICpcbiAqICAgICAvLyBhZGRzIGEgbmV3IHBob25lIHRvIHRoZSBwaG9uZXMgYXJyYXlcbiAqICAgICAkaHR0cEJhY2tlbmQud2hlblBPU1QoJy9waG9uZXMnKS5yZXNwb25kKGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhKSB7XG4gKiAgICAgICB2YXIgcGhvbmUgPSBhbmd1bGFyLmZyb21Kc29uKGRhdGEpO1xuICogICAgICAgcGhvbmVzLnB1c2gocGhvbmUpO1xuICogICAgICAgcmV0dXJuIFsyMDAsIHBob25lLCB7fV07XG4gKiAgICAgfSk7XG4gKiAgICAgJGh0dHBCYWNrZW5kLndoZW5HRVQoL15cXC90ZW1wbGF0ZXNcXC8vKS5wYXNzVGhyb3VnaCgpO1xuICogICAgIC8vLi4uXG4gKiAgIH0pO1xuICogYGBgXG4gKlxuICogQWZ0ZXJ3YXJkcywgYm9vdHN0cmFwIHlvdXIgYXBwIHdpdGggdGhpcyBuZXcgbW9kdWxlLlxuICovXG5cbi8qKlxuICogQG5nZG9jIG1ldGhvZFxuICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5cbiAqIEBtb2R1bGUgbmdNb2NrRTJFXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgSFRUUCBtZXRob2QuXG4gKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApPX0gZGF0YSBIVFRQIHJlcXVlc3QgYm9keS5cbiAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbihPYmplY3QpKT19IGhlYWRlcnMgSFRUUCBoZWFkZXJzIG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgaHR0cCBoZWFkZXJcbiAqICAgb2JqZWN0IGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGhlYWRlcnMgbWF0Y2ggdGhlIGN1cnJlbnQgZGVmaW5pdGlvbi5cbiAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgYW5kIGBwYXNzVGhyb3VnaGAgbWV0aG9kcyB0aGF0XG4gKiAgIGNvbnRyb2wgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gKlxuICogIC0gcmVzcG9uZCDDouKCrOKAnFxuICogICAgYHtmdW5jdGlvbihbc3RhdHVzLF0gZGF0YVssIGhlYWRlcnMsIHN0YXR1c1RleHRdKVxuICogICAgfCBmdW5jdGlvbihmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycyl9YFxuICogICAgw6LigqzigJwgVGhlIHJlc3BvbmQgbWV0aG9kIHRha2VzIGEgc2V0IG9mIHN0YXRpYyBkYXRhIHRvIGJlIHJldHVybmVkIG9yIGEgZnVuY3Rpb24gdGhhdCBjYW4gcmV0dXJuXG4gKiAgICBhbiBhcnJheSBjb250YWluaW5nIHJlc3BvbnNlIHN0YXR1cyAobnVtYmVyKSwgcmVzcG9uc2UgZGF0YSAoc3RyaW5nKSwgcmVzcG9uc2UgaGVhZGVyc1xuICogICAgKE9iamVjdCksIGFuZCB0aGUgdGV4dCBmb3IgdGhlIHN0YXR1cyAoc3RyaW5nKS5cbiAqICAtIHBhc3NUaHJvdWdoIMOi4oKs4oCcIGB7ZnVuY3Rpb24oKX1gIMOi4oKs4oCcIEFueSByZXF1ZXN0IG1hdGNoaW5nIGEgYmFja2VuZCBkZWZpbml0aW9uIHdpdGhcbiAqICAgIGBwYXNzVGhyb3VnaGAgaGFuZGxlciB3aWxsIGJlIHBhc3NlZCB0aHJvdWdoIHRvIHRoZSByZWFsIGJhY2tlbmQgKGFuIFhIUiByZXF1ZXN0IHdpbGwgYmUgbWFkZVxuICogICAgdG8gdGhlIHNlcnZlci4pXG4gKi9cblxuLyoqXG4gKiBAbmdkb2MgbWV0aG9kXG4gKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlbkdFVFxuICogQG1vZHVsZSBuZ01vY2tFMkVcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhIG5ldyBiYWNrZW5kIGRlZmluaXRpb24gZm9yIEdFVCByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSB1cmwgSFRUUCB1cmwuXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgYW5kIGBwYXNzVGhyb3VnaGAgbWV0aG9kcyB0aGF0XG4gKiAgIGNvbnRyb2wgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gKi9cblxuLyoqXG4gKiBAbmdkb2MgbWV0aG9kXG4gKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlbkhFQURcbiAqIEBtb2R1bGUgbmdNb2NrRTJFXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBIRUFEIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgd2hlbigpYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbihPYmplY3QpKT19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBhbmQgYHBhc3NUaHJvdWdoYCBtZXRob2RzIHRoYXRcbiAqICAgY29udHJvbCBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAqL1xuXG4vKipcbiAqIEBuZ2RvYyBtZXRob2RcbiAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuREVMRVRFXG4gKiBAbW9kdWxlIG5nTW9ja0UyRVxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiBmb3IgREVMRVRFIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgd2hlbigpYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbihPYmplY3QpKT19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBhbmQgYHBhc3NUaHJvdWdoYCBtZXRob2RzIHRoYXRcbiAqICAgY29udHJvbCBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAqL1xuXG4vKipcbiAqIEBuZ2RvYyBtZXRob2RcbiAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuUE9TVFxuICogQG1vZHVsZSBuZ01vY2tFMkVcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhIG5ldyBiYWNrZW5kIGRlZmluaXRpb24gZm9yIFBPU1QgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGB3aGVuKClgLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cCk9fSBkYXRhIEhUVFAgcmVxdWVzdCBib2R5LlxuICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKE9iamVjdCkpPX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIGFuZCBgcGFzc1Rocm91Z2hgIG1ldGhvZHMgdGhhdFxuICogICBjb250cm9sIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICovXG5cbi8qKlxuICogQG5nZG9jIG1ldGhvZFxuICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5QVVRcbiAqIEBtb2R1bGUgbmdNb2NrRTJFXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBQVVQgcmVxdWVzdHMuICBGb3IgbW9yZSBpbmZvIHNlZSBgd2hlbigpYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApPX0gZGF0YSBIVFRQIHJlcXVlc3QgYm9keS5cbiAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbihPYmplY3QpKT19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBhbmQgYHBhc3NUaHJvdWdoYCBtZXRob2RzIHRoYXRcbiAqICAgY29udHJvbCBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAqL1xuXG4vKipcbiAqIEBuZ2RvYyBtZXRob2RcbiAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuUEFUQ0hcbiAqIEBtb2R1bGUgbmdNb2NrRTJFXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBQQVRDSCByZXF1ZXN0cy4gIEZvciBtb3JlIGluZm8gc2VlIGB3aGVuKClgLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gdXJsIEhUVFAgdXJsLlxuICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cCk9fSBkYXRhIEhUVFAgcmVxdWVzdCBib2R5LlxuICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKE9iamVjdCkpPX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIGFuZCBgcGFzc1Rocm91Z2hgIG1ldGhvZHMgdGhhdFxuICogICBjb250cm9sIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICovXG5cbi8qKlxuICogQG5nZG9jIG1ldGhvZFxuICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5KU09OUFxuICogQG1vZHVsZSBuZ01vY2tFMkVcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhIG5ldyBiYWNrZW5kIGRlZmluaXRpb24gZm9yIEpTT05QIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgd2hlbigpYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHVybCBIVFRQIHVybC5cbiAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgYW5kIGBwYXNzVGhyb3VnaGAgbWV0aG9kcyB0aGF0XG4gKiAgIGNvbnRyb2wgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gKi9cbmFuZ3VsYXIubW9jay5lMmUgPSB7fTtcbmFuZ3VsYXIubW9jay5lMmUuJGh0dHBCYWNrZW5kRGVjb3JhdG9yID1cbiAgWyckcm9vdFNjb3BlJywgJyRkZWxlZ2F0ZScsICckYnJvd3NlcicsIGNyZWF0ZUh0dHBCYWNrZW5kTW9ja107XG5cblxuYW5ndWxhci5tb2NrLmNsZWFyRGF0YUNhY2hlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBrZXksXG4gICAgICBjYWNoZSA9IGFuZ3VsYXIuZWxlbWVudC5jYWNoZTtcblxuICBmb3Ioa2V5IGluIGNhY2hlKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjYWNoZSxrZXkpKSB7XG4gICAgICB2YXIgaGFuZGxlID0gY2FjaGVba2V5XS5oYW5kbGU7XG5cbiAgICAgIGhhbmRsZSAmJiBhbmd1bGFyLmVsZW1lbnQoaGFuZGxlLmVsZW0pLm9mZigpO1xuICAgICAgZGVsZXRlIGNhY2hlW2tleV07XG4gICAgfVxuICB9XG59O1xuXG5cbmlmKHdpbmRvdy5qYXNtaW5lIHx8IHdpbmRvdy5tb2NoYSkge1xuXG4gIHZhciBjdXJyZW50U3BlYyA9IG51bGwsXG4gICAgICBpc1NwZWNSdW5uaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhIWN1cnJlbnRTcGVjO1xuICAgICAgfTtcblxuXG4gICh3aW5kb3cuYmVmb3JlRWFjaCB8fCB3aW5kb3cuc2V0dXApKGZ1bmN0aW9uKCkge1xuICAgIGN1cnJlbnRTcGVjID0gdGhpcztcbiAgfSk7XG5cbiAgKHdpbmRvdy5hZnRlckVhY2ggfHwgd2luZG93LnRlYXJkb3duKShmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5qZWN0b3IgPSBjdXJyZW50U3BlYy4kaW5qZWN0b3I7XG5cbiAgICBhbmd1bGFyLmZvckVhY2goY3VycmVudFNwZWMuJG1vZHVsZXMsIGZ1bmN0aW9uKG1vZHVsZSkge1xuICAgICAgaWYgKG1vZHVsZSAmJiBtb2R1bGUuJCRoYXNoS2V5KSB7XG4gICAgICAgIG1vZHVsZS4kJGhhc2hLZXkgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjdXJyZW50U3BlYy4kaW5qZWN0b3IgPSBudWxsO1xuICAgIGN1cnJlbnRTcGVjLiRtb2R1bGVzID0gbnVsbDtcbiAgICBjdXJyZW50U3BlYyA9IG51bGw7XG5cbiAgICBpZiAoaW5qZWN0b3IpIHtcbiAgICAgIGluamVjdG9yLmdldCgnJHJvb3RFbGVtZW50Jykub2ZmKCk7XG4gICAgICBpbmplY3Rvci5nZXQoJyRicm93c2VyJykucG9sbEZucy5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIGFuZ3VsYXIubW9jay5jbGVhckRhdGFDYWNoZSgpO1xuXG4gICAgLy8gY2xlYW4gdXAganF1ZXJ5J3MgZnJhZ21lbnQgY2FjaGVcbiAgICBhbmd1bGFyLmZvckVhY2goYW5ndWxhci5lbGVtZW50LmZyYWdtZW50cywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgIGRlbGV0ZSBhbmd1bGFyLmVsZW1lbnQuZnJhZ21lbnRzW2tleV07XG4gICAgfSk7XG5cbiAgICBNb2NrWGhyLiQkbGFzdEluc3RhbmNlID0gbnVsbDtcblxuICAgIGFuZ3VsYXIuZm9yRWFjaChhbmd1bGFyLmNhbGxiYWNrcywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgIGRlbGV0ZSBhbmd1bGFyLmNhbGxiYWNrc1trZXldO1xuICAgIH0pO1xuICAgIGFuZ3VsYXIuY2FsbGJhY2tzLmNvdW50ZXIgPSAwO1xuICB9KTtcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIGFuZ3VsYXIubW9jay5tb2R1bGVcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqXG4gICAqICpOT1RFKjogVGhpcyBmdW5jdGlvbiBpcyBhbHNvIHB1Ymxpc2hlZCBvbiB3aW5kb3cgZm9yIGVhc3kgYWNjZXNzLjxicj5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiByZWdpc3RlcnMgYSBtb2R1bGUgY29uZmlndXJhdGlvbiBjb2RlLiBJdCBjb2xsZWN0cyB0aGUgY29uZmlndXJhdGlvbiBpbmZvcm1hdGlvblxuICAgKiB3aGljaCB3aWxsIGJlIHVzZWQgd2hlbiB0aGUgaW5qZWN0b3IgaXMgY3JlYXRlZCBieSB7QGxpbmsgYW5ndWxhci5tb2NrLmluamVjdCBpbmplY3R9LlxuICAgKlxuICAgKiBTZWUge0BsaW5rIGFuZ3VsYXIubW9jay5pbmplY3QgaW5qZWN0fSBmb3IgdXNhZ2UgZXhhbXBsZVxuICAgKlxuICAgKiBAcGFyYW0gey4uLihzdHJpbmd8RnVuY3Rpb258T2JqZWN0KX0gZm5zIGFueSBudW1iZXIgb2YgbW9kdWxlcyB3aGljaCBhcmUgcmVwcmVzZW50ZWQgYXMgc3RyaW5nXG4gICAqICAgICAgICBhbGlhc2VzIG9yIGFzIGFub255bW91cyBtb2R1bGUgaW5pdGlhbGl6YXRpb24gZnVuY3Rpb25zLiBUaGUgbW9kdWxlcyBhcmUgdXNlZCB0b1xuICAgKiAgICAgICAgY29uZmlndXJlIHRoZSBpbmplY3Rvci4gVGhlICduZycgYW5kICduZ01vY2snIG1vZHVsZXMgYXJlIGF1dG9tYXRpY2FsbHkgbG9hZGVkLiBJZiBhblxuICAgKiAgICAgICAgb2JqZWN0IGxpdGVyYWwgaXMgcGFzc2VkIHRoZXkgd2lsbCBiZSByZWdpc3RlcmVkIGFzIHZhbHVlcyBpbiB0aGUgbW9kdWxlLCB0aGUga2V5IGJlaW5nXG4gICAqICAgICAgICB0aGUgbW9kdWxlIG5hbWUgYW5kIHRoZSB2YWx1ZSBiZWluZyB3aGF0IGlzIHJldHVybmVkLlxuICAgKi9cbiAgd2luZG93Lm1vZHVsZSA9IGFuZ3VsYXIubW9jay5tb2R1bGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbW9kdWxlRm5zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICByZXR1cm4gaXNTcGVjUnVubmluZygpID8gd29ya0ZuKCkgOiB3b3JrRm47XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgZnVuY3Rpb24gd29ya0ZuKCkge1xuICAgICAgaWYgKGN1cnJlbnRTcGVjLiRpbmplY3Rvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luamVjdG9yIGFscmVhZHkgY3JlYXRlZCwgY2FuIG5vdCByZWdpc3RlciBhIG1vZHVsZSEnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBtb2R1bGVzID0gY3VycmVudFNwZWMuJG1vZHVsZXMgfHwgKGN1cnJlbnRTcGVjLiRtb2R1bGVzID0gW10pO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2gobW9kdWxlRm5zLCBmdW5jdGlvbihtb2R1bGUpIHtcbiAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChtb2R1bGUpICYmICFhbmd1bGFyLmlzQXJyYXkobW9kdWxlKSkge1xuICAgICAgICAgICAgbW9kdWxlcy5wdXNoKGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChtb2R1bGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAkcHJvdmlkZS52YWx1ZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW9kdWxlcy5wdXNoKG1vZHVsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSBhbmd1bGFyLm1vY2suaW5qZWN0XG4gICAqIEBkZXNjcmlwdGlvblxuICAgKlxuICAgKiAqTk9URSo6IFRoaXMgZnVuY3Rpb24gaXMgYWxzbyBwdWJsaXNoZWQgb24gd2luZG93IGZvciBlYXN5IGFjY2Vzcy48YnI+XG4gICAqXG4gICAqIFRoZSBpbmplY3QgZnVuY3Rpb24gd3JhcHMgYSBmdW5jdGlvbiBpbnRvIGFuIGluamVjdGFibGUgZnVuY3Rpb24uIFRoZSBpbmplY3QoKSBjcmVhdGVzIG5ld1xuICAgKiBpbnN0YW5jZSBvZiB7QGxpbmsgYXV0by4kaW5qZWN0b3IgJGluamVjdG9yfSBwZXIgdGVzdCwgd2hpY2ggaXMgdGhlbiB1c2VkIGZvclxuICAgKiByZXNvbHZpbmcgcmVmZXJlbmNlcy5cbiAgICpcbiAgICpcbiAgICogIyMgUmVzb2x2aW5nIFJlZmVyZW5jZXMgKFVuZGVyc2NvcmUgV3JhcHBpbmcpXG4gICAqIE9mdGVuLCB3ZSB3b3VsZCBsaWtlIHRvIGluamVjdCBhIHJlZmVyZW5jZSBvbmNlLCBpbiBhIGBiZWZvcmVFYWNoKClgIGJsb2NrIGFuZCByZXVzZSB0aGlzXG4gICAqIGluIG11bHRpcGxlIGBpdCgpYCBjbGF1c2VzLiBUbyBiZSBhYmxlIHRvIGRvIHRoaXMgd2UgbXVzdCBhc3NpZ24gdGhlIHJlZmVyZW5jZSB0byBhIHZhcmlhYmxlXG4gICAqIHRoYXQgaXMgZGVjbGFyZWQgaW4gdGhlIHNjb3BlIG9mIHRoZSBgZGVzY3JpYmUoKWAgYmxvY2suIFNpbmNlIHdlIHdvdWxkLCBtb3N0IGxpa2VseSwgd2FudFxuICAgKiB0aGUgdmFyaWFibGUgdG8gaGF2ZSB0aGUgc2FtZSBuYW1lIG9mIHRoZSByZWZlcmVuY2Ugd2UgaGF2ZSBhIHByb2JsZW0sIHNpbmNlIHRoZSBwYXJhbWV0ZXJcbiAgICogdG8gdGhlIGBpbmplY3QoKWAgZnVuY3Rpb24gd291bGQgaGlkZSB0aGUgb3V0ZXIgdmFyaWFibGUuXG4gICAqXG4gICAqIFRvIGhlbHAgd2l0aCB0aGlzLCB0aGUgaW5qZWN0ZWQgcGFyYW1ldGVycyBjYW4sIG9wdGlvbmFsbHksIGJlIGVuY2xvc2VkIHdpdGggdW5kZXJzY29yZXMuXG4gICAqIFRoZXNlIGFyZSBpZ25vcmVkIGJ5IHRoZSBpbmplY3RvciB3aGVuIHRoZSByZWZlcmVuY2UgbmFtZSBpcyByZXNvbHZlZC5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRoZSBwYXJhbWV0ZXIgYF9teVNlcnZpY2VfYCB3b3VsZCBiZSByZXNvbHZlZCBhcyB0aGUgcmVmZXJlbmNlIGBteVNlcnZpY2VgLlxuICAgKiBTaW5jZSBpdCBpcyBhdmFpbGFibGUgaW4gdGhlIGZ1bmN0aW9uIGJvZHkgYXMgX215U2VydmljZV8sIHdlIGNhbiB0aGVuIGFzc2lnbiBpdCB0byBhIHZhcmlhYmxlXG4gICAqIGRlZmluZWQgaW4gYW4gb3V0ZXIgc2NvcGUuXG4gICAqXG4gICAqIGBgYFxuICAgKiAvLyBEZWZpbmVkIG91dCByZWZlcmVuY2UgdmFyaWFibGUgb3V0c2lkZVxuICAgKiB2YXIgbXlTZXJ2aWNlO1xuICAgKlxuICAgKiAvLyBXcmFwIHRoZSBwYXJhbWV0ZXIgaW4gdW5kZXJzY29yZXNcbiAgICogYmVmb3JlRWFjaCggaW5qZWN0KCBmdW5jdGlvbihfbXlTZXJ2aWNlXyl7XG4gICAqICAgbXlTZXJ2aWNlID0gX215U2VydmljZV87XG4gICAqIH0pKTtcbiAgICpcbiAgICogLy8gVXNlIG15U2VydmljZSBpbiBhIHNlcmllcyBvZiB0ZXN0cy5cbiAgICogaXQoJ21ha2VzIHVzZSBvZiBteVNlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICogICBteVNlcnZpY2UuZG9TdHVmZigpO1xuICAgKiB9KTtcbiAgICpcbiAgICogYGBgXG4gICAqXG4gICAqIFNlZSBhbHNvIHtAbGluayBhbmd1bGFyLm1vY2subW9kdWxlIGFuZ3VsYXIubW9jay5tb2R1bGV9XG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICogRXhhbXBsZSBvZiB3aGF0IGEgdHlwaWNhbCBqYXNtaW5lIHRlc3RzIGxvb2tzIGxpa2Ugd2l0aCB0aGUgaW5qZWN0IG1ldGhvZC5cbiAgICogYGBganNcbiAgICpcbiAgICogICBhbmd1bGFyLm1vZHVsZSgnbXlBcHBsaWNhdGlvbk1vZHVsZScsIFtdKVxuICAgKiAgICAgICAudmFsdWUoJ21vZGUnLCAnYXBwJylcbiAgICogICAgICAgLnZhbHVlKCd2ZXJzaW9uJywgJ3YxLjAuMScpO1xuICAgKlxuICAgKlxuICAgKiAgIGRlc2NyaWJlKCdNeUFwcCcsIGZ1bmN0aW9uKCkge1xuICAgKlxuICAgKiAgICAgLy8gWW91IG5lZWQgdG8gbG9hZCBtb2R1bGVzIHRoYXQgeW91IHdhbnQgdG8gdGVzdCxcbiAgICogICAgIC8vIGl0IGxvYWRzIG9ubHkgdGhlIFwibmdcIiBtb2R1bGUgYnkgZGVmYXVsdC5cbiAgICogICAgIGJlZm9yZUVhY2gobW9kdWxlKCdteUFwcGxpY2F0aW9uTW9kdWxlJykpO1xuICAgKlxuICAgKlxuICAgKiAgICAgLy8gaW5qZWN0KCkgaXMgdXNlZCB0byBpbmplY3QgYXJndW1lbnRzIG9mIGFsbCBnaXZlbiBmdW5jdGlvbnNcbiAgICogICAgIGl0KCdzaG91bGQgcHJvdmlkZSBhIHZlcnNpb24nLCBpbmplY3QoZnVuY3Rpb24obW9kZSwgdmVyc2lvbikge1xuICAgKiAgICAgICBleHBlY3QodmVyc2lvbikudG9FcXVhbCgndjEuMC4xJyk7XG4gICAqICAgICAgIGV4cGVjdChtb2RlKS50b0VxdWFsKCdhcHAnKTtcbiAgICogICAgIH0pKTtcbiAgICpcbiAgICpcbiAgICogICAgIC8vIFRoZSBpbmplY3QgYW5kIG1vZHVsZSBtZXRob2QgY2FuIGFsc28gYmUgdXNlZCBpbnNpZGUgb2YgdGhlIGl0IG9yIGJlZm9yZUVhY2hcbiAgICogICAgIGl0KCdzaG91bGQgb3ZlcnJpZGUgYSB2ZXJzaW9uIGFuZCB0ZXN0IHRoZSBuZXcgdmVyc2lvbiBpcyBpbmplY3RlZCcsIGZ1bmN0aW9uKCkge1xuICAgKiAgICAgICAvLyBtb2R1bGUoKSB0YWtlcyBmdW5jdGlvbnMgb3Igc3RyaW5ncyAobW9kdWxlIGFsaWFzZXMpXG4gICAqICAgICAgIG1vZHVsZShmdW5jdGlvbigkcHJvdmlkZSkge1xuICAgKiAgICAgICAgICRwcm92aWRlLnZhbHVlKCd2ZXJzaW9uJywgJ292ZXJyaWRkZW4nKTsgLy8gb3ZlcnJpZGUgdmVyc2lvbiBoZXJlXG4gICAqICAgICAgIH0pO1xuICAgKlxuICAgKiAgICAgICBpbmplY3QoZnVuY3Rpb24odmVyc2lvbikge1xuICAgKiAgICAgICAgIGV4cGVjdCh2ZXJzaW9uKS50b0VxdWFsKCdvdmVycmlkZGVuJyk7XG4gICAqICAgICAgIH0pO1xuICAgKiAgICAgfSk7XG4gICAqICAgfSk7XG4gICAqXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBmbnMgYW55IG51bWJlciBvZiBmdW5jdGlvbnMgd2hpY2ggd2lsbCBiZSBpbmplY3RlZCB1c2luZyB0aGUgaW5qZWN0b3IuXG4gICAqL1xuXG5cblxuICB2YXIgRXJyb3JBZGRpbmdEZWNsYXJhdGlvbkxvY2F0aW9uU3RhY2sgPSBmdW5jdGlvbihlLCBlcnJvckZvclN0YWNrKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gZS5tZXNzYWdlO1xuICAgIHRoaXMubmFtZSA9IGUubmFtZTtcbiAgICBpZiAoZS5saW5lKSB0aGlzLmxpbmUgPSBlLmxpbmU7XG4gICAgaWYgKGUuc291cmNlSWQpIHRoaXMuc291cmNlSWQgPSBlLnNvdXJjZUlkO1xuICAgIGlmIChlLnN0YWNrICYmIGVycm9yRm9yU3RhY2spXG4gICAgICB0aGlzLnN0YWNrID0gZS5zdGFjayArICdcXG4nICsgZXJyb3JGb3JTdGFjay5zdGFjaztcbiAgICBpZiAoZS5zdGFja0FycmF5KSB0aGlzLnN0YWNrQXJyYXkgPSBlLnN0YWNrQXJyYXk7XG4gIH07XG4gIEVycm9yQWRkaW5nRGVjbGFyYXRpb25Mb2NhdGlvblN0YWNrLnByb3RvdHlwZS50b1N0cmluZyA9IEVycm9yLnByb3RvdHlwZS50b1N0cmluZztcblxuICB3aW5kb3cuaW5qZWN0ID0gYW5ndWxhci5tb2NrLmluamVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBibG9ja0ZucyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgdmFyIGVycm9yRm9yU3RhY2sgPSBuZXcgRXJyb3IoJ0RlY2xhcmF0aW9uIExvY2F0aW9uJyk7XG4gICAgcmV0dXJuIGlzU3BlY1J1bm5pbmcoKSA/IHdvcmtGbi5jYWxsKGN1cnJlbnRTcGVjKSA6IHdvcmtGbjtcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBmdW5jdGlvbiB3b3JrRm4oKSB7XG4gICAgICB2YXIgbW9kdWxlcyA9IGN1cnJlbnRTcGVjLiRtb2R1bGVzIHx8IFtdO1xuXG4gICAgICBtb2R1bGVzLnVuc2hpZnQoJ25nTW9jaycpO1xuICAgICAgbW9kdWxlcy51bnNoaWZ0KCduZycpO1xuICAgICAgdmFyIGluamVjdG9yID0gY3VycmVudFNwZWMuJGluamVjdG9yO1xuICAgICAgaWYgKCFpbmplY3Rvcikge1xuICAgICAgICBpbmplY3RvciA9IGN1cnJlbnRTcGVjLiRpbmplY3RvciA9IGFuZ3VsYXIuaW5qZWN0b3IobW9kdWxlcyk7XG4gICAgICB9XG4gICAgICBmb3IodmFyIGkgPSAwLCBpaSA9IGJsb2NrRm5zLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvKiBqc2hpbnQgLVcwNDAgKi8vKiBKYXNtaW5lIGV4cGxpY2l0bHkgcHJvdmlkZXMgYSBgdGhpc2Agb2JqZWN0IHdoZW4gY2FsbGluZyBmdW5jdGlvbnMgKi9cbiAgICAgICAgICBpbmplY3Rvci5pbnZva2UoYmxvY2tGbnNbaV0gfHwgYW5ndWxhci5ub29wLCB0aGlzKTtcbiAgICAgICAgICAvKiBqc2hpbnQgK1cwNDAgKi9cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChlLnN0YWNrICYmIGVycm9yRm9yU3RhY2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvckFkZGluZ0RlY2xhcmF0aW9uTG9jYXRpb25TdGFjayhlLCBlcnJvckZvclN0YWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBlcnJvckZvclN0YWNrID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuXG59KSh3aW5kb3csIHdpbmRvdy5hbmd1bGFyKTsiXX0=
