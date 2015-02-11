angular.module('givagoApp')
    .factory('Account', function($http, $auth, $modal, $log) {
        var modalInstance;
        return {
            getProfile: function() {
                return $http.get('http://api.givago.dev/api/me');
            },
            updateProfile: function(profileData) {
                return $http.put('http://api.givago.dev/api/me', profileData);
            },
            openLoginModal: function ($scope) {

                if($auth.isAuthenticated())
                    return;

                modalInstance = $modal.open({
                    templateUrl: 'login.html',
                    controller: 'ModalCtrl',
                    size: 'sm'
                });

                $scope.$watch(
                    function(){ return $scope.isAuthenticated() },
                    function(newVal, oldVal){
                        if(newVal == true){
                            modalInstance.close();
                        }
                    }
                );

            },
            authenticate: function(provider, $scope, $rootScope){
                $log.info(provider + ' auth attempt');

                $auth.authenticate(provider, true)
                    .then(function(response) {
                        console.log(response);

                        if(typeof response.data.user != 'undefined'){
                            $window.localStorage.currentUser = JSON.stringify(response.data.user);
                            $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
                        } else {
                            $scope.getProfile();
                        }

                        //$scope.getProfile();
                        toastr["success"]('You have successfully logged in');
                    })
                    .catch(function(response) {
                        console.log(response);
                        toastr["error"](response);
                    });
            }
        };
    });