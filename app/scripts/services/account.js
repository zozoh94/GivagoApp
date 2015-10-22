'use strict';

/**
 * @ngdoc service
 * @name givagoApp.account
 * @description
 * # account
 * Factory in the givagoApp.
 */
angular.module('givagoApp')
  .factory('account', function($http, $auth, $modal, $window, apiUrl, toastr) {
    var modalInstance;
    return {
      getProfile: function() {
        return $http.get(apiUrl+'/auth/user/');
      },
      updateProfile: function(profileData) {
        return $http.put(apiUrl+'/auth/user/', profileData);
      },
      openLoginModal: function ($scope) {

        if($auth.isAuthenticated()) {
          return;
	}
	
        modalInstance = $modal.open({
          templateUrl: 'login.html',
          controller: 'ModalCtrl',
          size: 'sm'
        });

        $scope.$watch(
          $auth.isAuthenticated,
          function(newVal){
            if(newVal === true){
              modalInstance.close();
	      $scope.$emit('account::authenticated');
	      console.log('auth');
	    }
          }
        );

      },
      authenticate: function(provider, $scope, $rootScope){
        $auth.authenticate(provider, true)
          .then(function(response) {
            if(typeof response.data.username !== 'undefined'){
              $window.localStorage.currentUser = JSON.stringify(response.data);
              $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
	      toastr.success('You have successfully logged in');
            } else {
              $scope.getProfile().success(function() {
		toastr.success('You have successfully logged in');
	      }).error(function(response) {
		toastr.success(response.detail);

		$auth.logout()
		  .then(function() {
		    $window.localStorage.currentUser = {};
		    $rootScope.currentUser = {};
		  });
	      });
            }	                
          })
          .catch(function() {
            toastr.error('You have already been connected with another social media or you\'ve already an account on Givago. Please use the correct way to log in');
          });
      }
    };
  });
