'use strict';

require('angular-mocks'); // extend angular with a mock property

describe('Unit: Module1 - SeedController1', function() {
  beforeEach(angular.mock.module('SeedApp'));

  var ctrl, scope;
  // inject the $controller and $rootScope services in the beforeEach block
  beforeEach(angular.mock.inject(function($controller, $rootScope) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('SeedController1', { $scope: scope });
  }));

  it('should create $scope.hi when calling sayHi', function() {
    expect(scope.hi).toBeUndefined();
    scope.sayHi();
    expect(scope.hi).toEqual('Hi ' + scope.name);
  });
});
