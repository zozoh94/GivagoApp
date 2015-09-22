'use strict';

angular.module('givagoApp')
  .controller('MosaicCtrl', function ($scope, $state, $auth, ajax, account){

    $scope.currentPage = 1;
    $scope.totalPages = 0;

    var loadAds = function(){
      $scope.loading = true;
      ajax.ads(/*$scope.currentPage*/).success(function(data){
	$scope.ads = data;
	//$scope.totalPages = data.count;
	//$scope.sizePage = data.page_size;
	//$scope.loading = false;
      });
    };

    $scope.pageChanged = function(){
      loadAds();
    };

    loadAds();
    
    $scope.uiRouterState = $state;

    $scope.$on('account::authenticated', function() {
	loadAds();
        toastr["info"]("Now you can select a video you'd like to watch!");
    });

    $scope.clickOnMosaic = function(){
      if(!$auth.isAuthenticated())
        return account.openLoginModal($scope);
    };

    return account.openLoginModal($scope);
  });