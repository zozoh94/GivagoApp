angular.module('givagoApp')
    .controller('ModalCtrl', function ($rootScope, $scope, $auth, $window, $log, Account){

        $scope.mode = 'login';

        $scope.authenticate = function(provider) {
            Account.authenticate(provider, $scope, $rootScope);
        };

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.goToSignup = function(){
            $scope.mode = 'signup';
        }

        $scope.goToLogin = function(){
            $scope.mode = 'login';
        }

        /*$scope.signup = function() {
            var user = {
                email: $scope.email,
                password: $scope.password
            };

            // Satellizer
            $auth.signup(user)
                .catch(function(response) {
                    console.log(response.data);
                });
        };*/

        $scope.login = function() {
            $auth.login({ email: $scope.email, password: $scope.password })
                .then(function(response) {

                    if(typeof response.data.user != 'undefined'){
                        $window.localStorage.currentUser = JSON.stringify(response.data.user);
                        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
                    } else {
                        $scope.getProfile();
                    }

                    toastr["success"]('You have successfully logged in');
                })
                .catch(function(response) {
                    toastr["error"](response.data.message);
                });
        };

        $scope.signup = function() {
            $auth.signup({
                displayName: $scope.displayName,
                email: $scope.email,
                password: $scope.password
            }).catch(function(response) {
                if (typeof response.data.message === 'object') {
                    angular.forEach(response.data.message, function(message) {
                        toastr["error"](message[0]);
                    });
                } else {
                    toastr["error"](response.data.message);
                }
            });
        };

        $scope.getProfile = function() {
            $log.info('Get user profile');

            Account.getProfile()
                .success(function(response) {
                    $log.info(response);

                    $window.localStorage.currentUser = JSON.stringify(response);
                    $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);

                })
                .error(function(error) {
                    toastr["error"](error.message);
                });
        };

    });