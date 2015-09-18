'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:PlayerCtrl
 * @description
 * # VerifyEmailCtrl
 * Controller of the givagoApp's Player
 */
angular.module('givagoApp')
  .controller('VerifyEmailCtrl', function ($scope, $stateParams, $location, account, ajax){
    ajax.verifyEmail($stateParams.key).success(function(data){
      toastr["info"]("Now you can login!");
    }).error(function(data) {
      toastr["error"]("Key error : "+data.detail);
    });
    return account.openLoginModal($scope); 
  });
