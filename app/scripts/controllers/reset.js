'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:PlayerCtrl
 * @description
 * # ResetCtrl
 * Controller of the givagoApp reset password
 */
angular.module('givagoApp')
  .controller('ResetCtrl', function ($modal){    
    modalInstance = $modal.open({
          templateUrl: 'reset.html',
          controller: 'ModalCtrl',
          size: 'sm'
    });
  });
