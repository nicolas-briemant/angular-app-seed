'use strict';

var angular = require('angular');

module.exports = angular.module('Module1', []).controller('SeedController1', function($scope) {
  $scope.name1 = 'M. Doe';

  $scope.sayHi = function() {
    $scope.hi = 'Hi ' + $scope.name;
  };
});
