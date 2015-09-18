'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the givagoApp's Player
 */
angular.module('givagoApp')
  .controller('PlayerCtrl', function ($window, $scope, $sce, $q, $state, $stateParams, account, ajax){

    
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
    
    ajax.ad($stateParams.ad).success(function(data) {
      $scope.ad = data;
      $scope.video = data.video.url;
    });

    var bufferingTimer,
        progressBar,
        bufferingBar;

    $scope.$on('youtube.player.ready', function ($event, player) {
      var duration = player.getDuration() * 1000;

      bufferingBar = new ProgressBar.Line('#buffering-bar', {
        trailColor: "rgba(255, 255, 255, 0.4)",
        color: "rgba(66, 139, 202, 0.6)",
      });

      bufferingTimer = setInterval(function() {
	var loadedFraction = player.getVideoLoadedFraction();

	bufferingBar.animate(loadedFraction, {
	  duration: 200
	});

	if(loadedFraction == 1)
	  clearTimeout(bufferingTimer);

      }, 200);

      player.setVolume(100);

      progressBar = new ProgressBar.Line('#progress-bar', {
        trailColor: "",
        color: "rgba(66, 139, 202, 0.8)",
        duration: duration
      });
      
      player.playVideo();

      $(window).blur(function () {
        player.pauseVideo();
      }).focus(function () {
        player.playVideo();
      });
    });

    $scope.$on('youtube.player.paused', function ($event, player) {      
      toastr["error"]("Please fully watch the video to validate your gift.");
      progressBar.stop();
    });

    $scope.$on('youtube.player.playing', function ($event, player) {
      progressBar.animate(1);
    });

    $scope.$on('youtube.player.ended', function ($event, player) {
      progressBar.stop();
      ajax.adSee($stateParams.ad).success(function(data) {
	swal({title : "Thank you!", text : "You're amazing ! The World will thank you for that :)", type : "success"});
	player.stopVideo();
      });
    });

    $scope.$on('youtube.player.buffering', function ($event, player) {      
      progressBar.stop();
    });

    $scope.$on('youtube.player.queued', function ($event, player) {      
      progressBar.stop();
    });
    
    $scope.$on('youtube.player.error', function ($event, player) {      
      progressBar.stop();
    });

  });
