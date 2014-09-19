'use strict';

var angular = require('angular');
require('./ctrl');

var app = angular.module('SeedApp', ['ctrl']);

app.controller('SeedController', function($scope) {
  $scope.name = 'Johnny';
  $scope.banana = 'cake';
  $scope.sayHi = function() {
    $scope.hi = 'Hi ' + $scope.name;
  };
  $scope.sayBye = function() {
    $scope.bye = 'Bye.';
  };
});
