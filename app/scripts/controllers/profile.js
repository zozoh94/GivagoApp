'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the givagoApp to see and edit client profile
 */
angular.module('givagoApp').controller('ProfileCtrl', function ($scope, $modal, $window, $rootScope, ajax, toastr){

  $scope.goToEditProfile = function() {
    var modalInstance = $modal.open({
      templateUrl: 'editProfile.html',
      controller: 'ProfileModalCtrl'   
    });
    modalInstance.result.then(function() {
      $scope.getProfile();
    });
  };

  $scope.goToChangePassword = function() {
    $modal.open({
      templateUrl: 'changePassword.html',
      controller: 'ProfileModalCtrl'     
    });      
  };
  
  $scope.getProfile = function() {
    ajax.profile()
      .success(function(response) {
        $window.localStorage.currentUser = JSON.stringify(response);
        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
      })
      .error(function(error) {
        toastr.error(error.message);
      }); 
  };

  $scope.getProfile();
});

angular.module('givagoApp').controller('ProfileModalCtrl', function ($scope, $modalInstance, $rootScope, ajax, toastr) {
  $scope.username = $rootScope.currentUser.username;
  $scope.email = $rootScope.currentUser.email;
  
  $scope.changePassword = function() {
    ajax.changePassword($scope.password, $scope.confirmPassword, $scope.oldPassword).success(function(response) {       
      $modalInstance.close();
      toastr.success(response.success);
    }).error(function(response) {
      if(angular.isObject(response)) {
        $scope.errors = response;
      }      
      toastr.error('New password hasn\'t been changed.');     
    });
  };

  $scope.editProfile = function() {
    ajax.editProfile($scope.username, $scope.email).success(function() {
      $rootScope.currentUser.username = $scope.username;
      $rootScope.currentUser.email = $scope.email;        
      $modalInstance.close();
      toastr.success('You have updated your profile.');
    }).error(function(response) {
      if(angular.isObject(response)) {
        $scope.errors = response;
      }      
      toastr.error('Your profile hasn\'t been updated.');    
    });
  };
  
});
