'use strict';

var angular = require('angular');

module.exports = angular.module('ctrl', []).controller('SeedController2', function($scope) {
  $scope.name = 'Johnny';
  $scope.banana = 'cake';
  $scope.sayHi = function() {
    $scope.hi = 'Hi ' + $scope.name;
  };
  $scope.sayBye = function() {
    $scope.bye = 'Bye.';
  };
});
