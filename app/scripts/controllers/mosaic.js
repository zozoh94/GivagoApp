'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:MosaicCtrl
 * @description
 * # MosaicCtrl
 * Controller of the givagoApp ads mosaic
 */
angular.module('givagoApp').controller('MosaicCtrl', function ($rootScope, $scope, $state, $auth, $stateParams, $window, $timeout, ajax, account, toastr, startMode, ipCookie, apiUrl){
  $scope.startMode = startMode;
  $scope.adsBlocked = false;
  
  $rootScope.$on('$viewContentLoaded', function() {
    $timeout(function() {
      if(angular.element(document.getElementById('dailymotion-ads'))[0].offsetHeight === 0) {
	$scope.adsBlocked = true;
      }
    }, 2000);
  });

  $scope.apiUrl = apiUrl;
  
  $scope.isSmartphone = function(){
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };
  
  if($rootScope.currentStep === 1) {
    $rootScope.currentStep = 2;
  }
  
  $scope.currentPage = 1;
  $scope.totalPages = 0;

  var loadAds = function(){
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

  var loadApp = function() {
    var os ='';
    if(/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      os = 'iOS';
    }
    else {
      os = 'Android';
    }
    ajax.app(os).success(function(data){
      $scope.app = data;      
    });
  };

  if($scope.isSmartphone()) {    
    loadApp();
  }
  loadAds();
  
  $scope.uiRouterState = $state;

  $scope.$on('account::authenticated', function() {
    loadAds();
    toastr.info('Now you can select a video you\'d like to watch!');
  });

  $scope.clickOnMosaic = function(){
    if(!$auth.isAuthenticated()) {
      return account.openLoginModal($scope);
    }
  };

  window.addEventListener('message',function(event) {
    console.log(event);
    if(event.data.indexOf('timeupdate') !== -1 && event.data.indexOf('time=30') !== -1) {
      ajax.adDailymotionSee($stateParams.gift).success(function() {
	swal({title : 'Thank you!', text : 'You\'re amazing! The World will thank you for that :)', type : 'success'}); // jshint ignore:line
	$rootScope.currentStep = -1;
	ipCookie('featureTour', true, { expires: 3000 });
      });
    }
  },false);

  var back = true;
  if(startMode && !$scope.isSmartphone()) {    
    back = 'static';
  }
  return account.openLoginModal($scope, back);
});
