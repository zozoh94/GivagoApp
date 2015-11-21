'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the givagoApp's Player
 */
angular.module('givagoApp')
  .controller('PlayerCtrl', function ($window, $rootScope, $scope, $sce, $q, $state, $stateParams, $modal, account, ajax, toastr, ipCookie, SweetAlert){
    if($rootScope.currentStep === 2) {
      $rootScope.currentStep = 3;
    }

    $scope.loadAd = function() {
      ajax.ad($stateParams.ad).success(function(data) {
	$scope.ad = data;
	$scope.video = data.video.url;
      }).error(function(data) {
	$state.go('mosaic', { gift : $stateParams.gift });
	toastr.info(data.detail);
      });
    };
    
    $scope.playerVars = {
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      theme: 'light',
      playerapiid: 'ytplayer'
    };

    $scope.loadAd();

    var bufferingTimer,
        progressBar,
        bufferingBar;

    $scope.$on('youtube.player.ready', function ($event, player) {
      var duration = player.getDuration() * 1000;

      bufferingBar = new ProgressBar.Line('#buffering-bar', { // jshint ignore:line
        trailColor: 'rgba(255, 255, 255, 0.4)',
        color: 'rgba(66, 139, 202, 0.6)'
      });

      bufferingTimer = setInterval(function() {
	var loadedFraction = player.getVideoLoadedFraction();

	bufferingBar.animate(loadedFraction, {
	  duration: 200
	});

	if(loadedFraction === 1) {
	  clearTimeout(bufferingTimer);
	}

      }, 200);

      player.setVolume(100);

      progressBar = new ProgressBar.Line('#progress-bar', { // jshint ignore:line
        trailColor: '',
        color: 'rgba(66, 139, 202, 0.8)',
        duration: duration
      });
      
      player.playVideo();

      angular.element($window).bind('blur', function () {
	if(player.getCurrentTime() !== 0) {
          player.pauseVideo();
	}
      }).bind('focus', function () {
	if(player.getCurrentTime() !== 0) {
          player.playVideo();
	}
      });
    });

    $scope.$on('youtube.player.paused', function () {      
      toastr.error('Please fully watch the video to validate your gift.');
      progressBar.stop();
    });

    $scope.$on('youtube.player.playing', function () {
      progressBar.animate(1);
    });

    $scope.$on('youtube.player.ended', function ($event, player) {
      progressBar.stop();
      
      ajax.adSee($stateParams.ad, $stateParams.gift).success(function() {
	SweetAlert.swal({
	  title : 'Thank you!',
	  text : 'You\'re amazing! <br/>The World will thank you for that :)',
	  type : 'success',
          confirmButtonColor: '#5CB85C', confirmButtonText: 'OK',
          html: true
	}, function() {
	  $modal.open({
	    templateUrl: 'share.html',
	    controller: 'ModalCtrl'   
	  });
	});
	$scope.loadAd();
	player.stopVideo();
	player.seekTo(0, false);
	progressBar.set(0);
	$rootScope.currentStep = -1;
 	ipCookie('featureTour', true, { expires: 3000 });
      });      
    });

    $scope.$on('youtube.player.buffering', function () {      
      progressBar.stop();
    });

    $scope.$on('youtube.player.queued', function () {      
      progressBar.stop();
    });
    
    $scope.$on('youtube.player.error', function () {      
      progressBar.stop();
    });

  });
