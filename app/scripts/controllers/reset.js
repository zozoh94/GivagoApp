'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:PlayerCtrl
 * @description
 * # ResetCtrl
 * Controller of the givagoApp reset password
 */
angular.module('givagoApp').controller('ResetCtrl', function ($modal){    
  return $modal.open({
    templateUrl: 'reset.html',
    controller: 'ResetModalCtrl',
    size: 'sm',
    backdrop: 'static'
  });
});

angular.module('givagoApp').controller('ResetModalCtrl', function ($scope, $stateParams, ajax, toastr){
  $scope.resetConfirm = function() {
    ajax.resetConfirm($stateParams.uid, $stateParams.token, $scope.password, $scope.confirmPassword).success(function(response) {
      toastr.success(response.success);
    }).error(function () {
      toastr.error('Tokens are invalid or expired.');
    });
  };
});
