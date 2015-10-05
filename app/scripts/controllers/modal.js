'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:ModalCtrl
 * @description
 * # ModalCtrl
 * Controller of the givagoApp's main modal which deals with authentication
 */
angular.module('givagoApp').controller('ModalCtrl', function ($rootScope, $scope, $auth, $window, $stateParams, account, ajax, toastr){

  $scope.mode = 'login';

  $scope.authenticate = function(provider) {
    account.authenticate(provider, $scope, $rootScope);
  };

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.goToSignup = function(){
    $scope.mode = 'signup';
  };

  $scope.goToLogin = function(){
    $scope.mode = 'login';
  };

  $scope.goToReset = function(){
    $scope.mode = 'reset';
  };
  
  $scope.login = function() {
    $auth.login({ username: $scope.username, password: $scope.password })
      .then(function() {
        $scope.getProfile();	
        toastr.success('You have successfully logged in');
      })
      .catch(function(response) {
	/*jshint camelcase: false */
	angular.forEach(response.data.non_field_errors, function(value) {
	  /*jshint camelcase: true */
	  toastr.error(value);
	});
      });
  };

  $scope.signup = function() {
    $auth.signup({
      'username': $scope.username,
      'email': $scope.email,
      'password1': $scope.password,
      'password2': $scope.confirmPassword	
    }).success(function() {
      toastr.success('Account created.');
      $scope.goToLogin();
    })
      .catch(function(response) {
	if(angular.isObject(response.data)) {
	  $scope.errors = response.data;          
	}
	toastr.error('Account not created.');
	$scope.$broadcast('show-errors-reset');
      });
  };

  $scope.reset = function() {
    ajax.reset($scope.email).success(function(data) {
      toastr.success(data.success);
      $scope.goToLogin();
    });
  };

  $scope.getProfile = function() {
    account.getProfile()
      .success(function(response) {
        $window.localStorage.currentUser = JSON.stringify(response);
        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
      })
      .error(function(error) {
        toastr.error(error.message);
      }); 
  };
  
});
