'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:ParallaxCtrl
 * @description
 * # ParallaxCtrl
 * Controller of the givagoApp parallax
 */
/* jshint ignore:start */
angular.module('givagoApp').controller('ParallaxCtrl', function ($rootScope, $scope){
  $scope.parallaxScene = {};

  var doResize = function() {
    var height = $(window).height();
    var playerPosition = $('.parallax-player').position();

    if($(window).width() < 1024) {
      $scope.parallaxScene.parallax('disable');
    } else {
      $scope.parallaxScene.parallax('enable');
    }

    if(!playerPosition) {
      return;
    }
    
    //var minHeight = playerPosition.top + $('.parallax-player').height() + 30;

    /*if(height < minHeight) {
      height = minHeight;
    }*/

    //$('#parallax-wrapper').height(height);

    var getSceneMargin = -($('#parallax-scene').css('marginTop').replace('px', '') * 2);

    $('#parallax-scene > li > div').each(function(){
      $(this).width(($(window).width() + getSceneMargin)); 
      $(this).height(height + getSceneMargin);
    });
  };

  $rootScope.$on('$viewContentLoaded', function() {
    setTimeout(function(){$(window).resize(doResize).resize();},100);

    $scope.parallaxScene = $('#parallax-scene').parallax({
      scalarX: 10,
      scalarY: 15
    });
  });
});
/* jshint ignore:end */
