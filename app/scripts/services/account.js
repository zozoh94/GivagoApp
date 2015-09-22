'use strict';

/**
 * @ngdoc service
 * @name givagoApp.account
 * @description
 * # account
 * Factory in the givagoApp.
 */
angular.module('givagoApp')
  .factory('account', function($http, $auth, $modal, apiUrl) {
    var modalInstance;
    return {
      getProfile: function() {
        return $http.get(apiUrl+'/auth/user/');
      },
      updateProfile: function(profileData) {
        return $http.put(apiUrl+'/auth/user/', profileData);
      },
      openLoginModal: function ($scope) {

        if($auth.isAuthenticated())
          return;

        modalInstance = $modal.open({
          templateUrl: 'login.html',
          controller: 'ModalCtrl',
          size: 'sm'
        });

        $scope.$watch(
          $auth.isAuthenticated,
          function(newVal){
            if(newVal == true){
              modalInstance.close();
	      $scope.$emit('account::authenticated');
            }
          }
        );

      },
      authenticate: function(provider, $scope, $rootScope){
        $auth.authenticate(provider, true)
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
            toastr["error"](response);
          });
      }
    };
  });