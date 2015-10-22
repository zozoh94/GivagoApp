'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:VerifyEmailCtrl
 * @description
 * # VerifyEmailCtrl
 * Controller of the givagoApp to confirm user email
 */
angular.module('givagoApp')
  .controller('VerifyEmailCtrl', function ($scope, $state, $stateParams, $location, account, ajax, toastr){
    ajax.verifyEmail($stateParams.key).success(function(){
      toastr.info('Now you can login!');
    }).error(function(data) {
      toastr.error('Key error : '+data.detail);
    });
    $state.go('home');
    account.openLoginModal($scope); 
  });
