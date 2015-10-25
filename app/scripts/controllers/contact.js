'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the contact pages
 */
angular.module('givagoApp').controller('ContactCtrl', function ($scope, $state, toastr, ajax) {
  $scope.htmlReady();
  
  $scope.contactCharity = function() {
    ajax.contactCharity($scope.firstName, $scope.lastName, $scope.email, $scope.phone, $scope.charityName, $scope.position, $scope.comment).success(function() {      
      toastr.success('An email has been sent.');
      $state.go('home');
    }).error(function(response) {
      if(angular.isObject(response)) {
        $scope.errors = response;
      }      
      toastr.error('The email hasn\'t been sent.');    
    }); 
  };
  
  $scope.contactSponsor = function() {
    ajax.contactSponsor($scope.firstName, $scope.lastName, $scope.email, $scope.phone, $scope.companyName, $scope.position, $scope.budget, $scope.comment).success(function() {      
      toastr.success('An email has been sent.');
      $state.go('home');
    }).error(function(response) {
      if(angular.isObject(response)) {
        $scope.errors = response;
      }      
      toastr.error('The email hasn\'t been sent.');    
    });   
  };
  
  $scope.contactCommunity = function() {
    ajax.contactCharity($scope.firstName, $scope.lastName, $scope.email, $scope.phone, $scope.comment).success(function() {      
      toastr.success('An email has been sent.');
      $state.go('home');
    }).error(function(response) {
      if(angular.isObject(response)) {
        $scope.errors = response;
      }      
      toastr.error('The email hasn\'t been sent.');    
    }); 
  };
});
