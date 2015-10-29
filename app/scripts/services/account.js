'use strict';

/**
 * @ngdoc service
 * @name givagoApp.account
 * @description
 * # account
 * Factory in the givagoApp.
 */
angular.module('givagoApp')
  .factory('account', function($rootScope, $http, $auth, $modal) {
    var modalInstance;
    return {
      openLoginModal: function ($scope, back) {
	var backdrop = back || true;
	
        if($auth.isAuthenticated()) {
          return;
	}
	
        modalInstance = $modal.open({
          templateUrl: 'login.html',
          controller: 'ModalCtrl',
          size: 'sm',
	  backdrop: backdrop
        });

	/*        $scope.$watch(
          $auth.isAuthenticated,
          function(newVal){
            if(newVal === true){
              modalInstance.close();
	    }
          }
        );*/
      }
    };
  });
