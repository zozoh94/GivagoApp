'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the givagoApp
 */
angular.module('givagoApp')
  .controller('HomeCtrl', function ($scope, $document, ajax){
    ajax.gifts().success(function(data) {
      $scope.gifts = data;
      angular.forEach($scope.gifts, function(value) {
	if(value.name == 'Tree')
	  value.icon = 'glyphicon glyphicon-tree-deciduous fa-stack-1x';
	else if(value.name == 'Food')
	  value.icon = 'fa fa-spoon fa-stack-1x';
	else if(value.name == 'Water')
	  value.icon = 'fa fa-tint fa-stack-1x';
	else if(value.name == 'Educate')
	  value.icon = 'fa fa-graduation-cap fa-stack-1x';
      });	
    });
    $scope.scrollToContent = function()
    {
      var contentContainer = angular
	    .element(document.getElementById('content-container'));
      $document.scrollTo(contentContainer, 0, 800);
    };
  });
