'use strict';

angular.module('givagoApp')
  .controller('ModalCtrl', function ($rootScope, $scope, $auth, $window, $log, $location, account, ajax){

    $scope.mode = 'login';

    $scope.authenticate = function(provider) {
      account.authenticate(provider, $scope, $rootScope);
    };

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.goToSignup = function(){
      $scope.mode = 'signup';
    }

    $scope.goToLogin = function(){
      $scope.mode = 'login';
    }

    $scope.goToReset = function(){
      $scope.mode = 'reset';
    }
    
    $scope.login = function() {
      $auth.login({ username: $scope.username, password: $scope.password })
        .then(function(response) {

          if(typeof response.data.username != 'undefined'){
            $window.localStorage.currentUser = JSON.stringify(response.data);
            $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
          } else {
            $scope.getProfile();
          }

          toastr["success"]('You have successfully logged in');
        })
        .catch(function(response) {
	  angular.forEach(response.data.non_field_errors, function(value) {
	    toastr["error"](value);
	  });
        });
    };

    $scope.signup = function() {
      $auth.signup({
        username: $scope.username,
        email: $scope.email,
        password1: $scope.password,
	password2: $scope.confirmPassword
      }).success(function(response) {
	toastr["success"]("Account created.");
	$scope.goToLogin();
      })
	.catch(function(response) {
	  if(angular.isObject(response.data)) {
            angular.forEach(response.data, function(value) {
	      angular.forEach(value, function(message) {
		toastr["error"](message);
              });
	    });
	  }
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
          toastr["error"](error.message);
        });
    };

  });
