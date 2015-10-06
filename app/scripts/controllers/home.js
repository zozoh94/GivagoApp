'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the home page
 */
angular.module('givagoApp').controller('HomeCtrl', function ($scope, $document, ajax){
  ajax.gifts().success(function(data) {
    $scope.gifts = data;  	
  });
  $scope.scrollToContent = function()
  {
    var contentContainer = angular.element(document.getElementById('content-container'));
    $document.scrollTo(contentContainer, 0, 800);
  };
});
