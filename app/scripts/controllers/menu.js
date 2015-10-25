'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the menu
 */
angular.module('givagoApp')
  .controller('MenuCtrl', function ($scope, $rootScope, $window, $auth, $log, account, $modal, toastr) {
    
    if($auth.isAuthenticated() && $rootScope.currentStep === 0) {
      $rootScope.currentStep = 1;
    }
    
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.openLoginModal = function ()
    {
      account.openLoginModal($scope);
    };

    $scope.openSettingsModal = function ()
    {
      $modal.open({
          templateUrl: 'settings.html',
          controller: 'SettingsCtrl',
          size: 'sm'
      });
    };    
    
    $scope.logout = function()
    {
      if (!$auth.isAuthenticated()) {
        return;
      }

      $auth.logout()
        .then(function() {

          $window.localStorage.currentUser = {};
          $rootScope.currentUser = {};

          toastr.info('You have been logged out.');
        });
    };

    $scope.isXs = function() {
      /* jshint ignore:start */
      return ($(window).width() < 768);
      /* jshint ignore:end */
    };
  });

