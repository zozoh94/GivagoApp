angular.module('givagoApp')
    .controller('MosaicCtrl', function ($scope, $state, $auth, Video, Account){

        $scope.uiRouterState = $state;

        console.log($state.params);

        $scope.videos = (function(){ return Video.getAll(); })();

        $scope.authenticate = function(provider) {
            Account.authenticate(provider, $scope, $rootScope).then(function(){
                toastr["info"]("Now you can select a video you'd like to watch!");
            });
        };

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.clickOnMosaic = function(){
            if(!$auth.isAuthenticated())
                return Account.openLoginModal($scope);
        };

        if(!$auth.isAuthenticated())
            return Account.openLoginModal($scope);
    }
);