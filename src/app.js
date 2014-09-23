'use strict';

var angular = require('angular');

angular.module('SeedApp', [
  require('./module1').name
, require('./module2').name
]);
