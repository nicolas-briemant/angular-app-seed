'use strict';

var angular = require('angular');

var app = angular.module('SeedApp', []);

app.controller('SeedController', function($scope) {
  $scope.name = 'John';
  $scope.sayHi = function() {
    $scope.hi = 'Hi ' + $scope.name;
  };
  $scope.sayBye = function() {
    $scope.bye = 'Bye.';
  };
});
