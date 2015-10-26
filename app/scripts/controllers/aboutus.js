'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:AboutUsCtrl
 * @description
 * # AboutUsCtrl
 * Controller of the About Us page
 */
angular.module('givagoApp').controller('AboutUsCtrl', function ($scope, ajax) {
  ajax.staff().success(function(response) {
    $scope.staffs = response;
    $scope.htmlReady();
  });
});
