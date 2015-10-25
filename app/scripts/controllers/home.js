'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the home page
 */
angular.module('givagoApp').controller('HomeCtrl', function ($rootScope, $scope, $document, $auth, $state, ajax){
  ajax.gifts().success(function(data) {
    $scope.gifts = data;
    $scope.htmlReady();
  });
  $scope.scrollToContent = function()
  {
    var contentContainer = angular.element(document.getElementById('content-container'));
    $document.scrollTo(contentContainer, 0, 800);
  };

  $scope.$watch(
    $auth.isAuthenticated, function(newVal){
      if(newVal === true && $rootScope.currentStep === 0){
	$rootScope.currentStep = 1;	
      }
    });
});
