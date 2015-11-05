'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:VerifyEmailCtrl
 * @description
 * # VerifyEmailCtrl
 * Controller of the givagoApp to confirm user email
 */
angular.module('givagoApp')
  .controller('VerifyEmailCtrl', function ($scope, $state, $stateParams, $location, $window, $rootScope, ajax, toastr, $auth){
    ajax.verifyEmail($stateParams.key).success(function(response){
      var token = {data: response};
      $auth.setToken(token);
      $scope.getProfile();	  
    }).error(function(data) {
      toastr.error('Key error : '+data.detail);
      $state.go('home');
    });

    $scope.getProfile = function() {
      ajax.profile()
	.success(function(response) {
          $window.localStorage.currentUser = JSON.stringify(response);
          $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
	  toastr.success('You have successfully logged in');
	  $state.go('home');
	})
	.error(function(error) {
          toastr.error(error.message);
	  $auth.logout()
	    .then(function() {
	      $window.localStorage.currentUser = {};
	      $rootScope.currentUser = {};
	    });
	  $state.go('home');
	}); 
    };
  });
