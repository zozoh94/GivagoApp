'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the givagoApp
 */
angular.module('givagoApp')
    .controller('MenuCtrl', function ($scope, $rootScope, $window, $auth, $log, account) {

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.getProfile = function() {
            $log.info('Get user profile');

            account.getProfile()
                .success(function(response) {
                    $log.info(response);

                    $window.localStorage.currentUser = JSON.stringify(response);
                    $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);

                })
                .error(function(error) {
                    toastr["error"](error.message);
                });
        };

        $scope.openLoginModal = function (size)
        {
            account.openLoginModal($scope);
        };

        /**
         * Logout
         */
        $scope.logout = function()
        {
            $log.info('Logout');

            if (!$auth.isAuthenticated()) {
                return;
            }

            $auth.logout()
                .then(function() {

                    $window.localStorage.currentUser = {};
                    $rootScope.currentUser = {};

                    toastr["info"]("You have been logged out");
                });
        };

        /**
         * Update user's profile information.
         */
        $scope.updateProfile = function() {
            $log.info('Update profile');

            account.updateProfile({
                displayName: $scope.user.displayName,
                email: $scope.user.email
            }).then(function() {
                toastr["success"]("Profile has been updated");
            });
        };

        /**
         * Link third-party provider.
         */
        $scope.link = function(provider) {
            $log.info('Link third-party provider');

            $auth.link(provider)
                .then(function() {
                    toastr["success"]('You have successfully linked ' + provider + ' account');
                })
                .then(function() {
                    $scope.getProfile();
                })
                .catch(function(response) {
                    toastr["error"](response.data.message);
                });
        };

        /**
         * Unlink third-party provider.
         */
        $scope.unlink = function(provider) {
            $log.info('Unlink third-party provider');

            $auth.unlink(provider)
                .then(function() {
                    toastr["success"]('You have successfully unlinked ' + provider + ' account');
                })
                .then(function() {
                    $scope.getProfile();
                })
                .catch(function(response) {
                    toastr["error"](response.data ? response.data.message : 'Could not unlink ' + provider + ' account');
                });
        };
    });

