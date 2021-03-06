'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:ModalCtrl
 * @description
 * # ModalCtrl
 * Controller of the givagoApp's main modal which deals with authentication
 */
angular.module('givagoApp').controller('ModalCtrl', function ($rootScope, $scope, $auth, $window, $stateParams, $modalInstance, account, ajax, toastr, facebookService){
  $scope.isCollapseShareFb = true;
  $scope.message = '';
  switch($stateParams.gift) {
  case 'Tree':
    $scope.message = 'Thanks to @Givago I\'ve just planted a tree for free! Plant your own on http://givago.co/';
    break;
  default:
    $scope.message = 'Thanks to @Givago ! Give a gift on http://givago.co/';
  }

  $scope.mode = 'login';

  $scope.shareOnFacebook = function() {
    facebookService.share($scope.message);
    $modalInstance.close();
  };

  $scope.ignore = function() {
    $modalInstance.close();
  };

  $scope.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function() {
        $scope.getProfile();
	$modalInstance.close();
      })
      .catch(function() {
        toastr.error('An error occured, please retry.');
	
	$auth.logout()
	  .then(function() {
	    $window.localStorage.currentUser = {};
	    $rootScope.currentUser = {};
	  });
      });
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
	$modalInstance.close();
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
      toastr.success('Account created. Check your emails.');
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
    ajax.profile()
      .success(function(response) {
        $window.localStorage.currentUser = JSON.stringify(response);
        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
	toastr.success('You have successfully logged in');
      })
      .error(function(error) {
        toastr.error(error.message);
	$auth.logout()
	  .then(function() {
	    $window.localStorage.currentUser = {};
	    $rootScope.currentUser = {};
	  });
      }); 
  };
  
});
