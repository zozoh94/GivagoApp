'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the givagoApp to see and edit client profile
 */
angular.module('givagoApp').controller('ProfileCtrl', function ($scope, $modal){

  $scope.goToEditProfile = function() {
    $modal.open({
      templateUrl: 'editProfile.html',
      controller: 'ProfileModalCtrl'   
    });    
  };

  $scope.goToChangePassword = function() {
    $modal.open({
      templateUrl: 'changePassword.html',
      controller: 'ProfileModalCtrl'     
    });      
  };
});

angular.module('givagoApp').controller('ProfileModalCtrl', function ($scope, $modalInstance, $rootScope, $window, ajax, toastr) {
  $scope.username = $rootScope.currentUser.username;
  $scope.firstName = $rootScope.currentUser.first_name; // jshint ignore:line
  $scope.lastName = $rootScope.currentUser.last_name; // jshint ignore:line
  $scope.age = $rootScope.currentUser.age;
  $scope.gender = $rootScope.currentUser.gender;
  $scope.incomeLevel = $rootScope.currentUser.income_level; // jshint ignore:line
  
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
    ajax.editProfile($scope.username, $scope.firstName, $scope.lastName, $scope.age, $scope.gender, $scope.incomeLevel).success(function(response) {
      $window.localStorage.currentUser = JSON.stringify(response);
      $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
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
