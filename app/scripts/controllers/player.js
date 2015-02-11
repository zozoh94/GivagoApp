'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:PlayerCtrl
 * @description
 * # MainCtrl
 * Controller of the givagoApp's Player
 */
angular.module('givagoApp')
    .controller('PlayerCtrl', function ($window, $scope, $sce, $q, $state, $log, $stateParams, Account, Video){

        $scope.progress = 0;

        $scope.progressbar = {};

        $scope.uiRouterState = $state;

        $scope.player = {};

        $scope.getPartnerVideo = function(partner)
        {
            for(var i = 0; i < $scope.videos.length; i++)
            {
                if($scope.videos[i].sponsor.id == partner)
                {
                    var video = $scope.videos[i];

                    $log.info('Get ' + partner + ' video campaign:');
                    $log.info(video);

                    return video;
                }
            }
        };

        $scope.videos = (function(){
            return Video.getAll();
        })();

        $scope.video = (function(){
            return $scope.getPartnerVideo($state.params.partner);
        })();

        var bufferingTimer,
            progressBar,
            bufferingBar;

        var onPlayerReady = function(event)
        {
            setFluidVideo();
            //createBufferingTimer();

            var duration = $scope.player.getDuration() * 1000;

            $log.info('Video duration: ' + duration);

            progressBar = new ProgressBar.Line('#progress-bar', {
                trailColor: "",
                color: "rgba(66, 139, 202, 0.8)",
                duration: duration
            });

            bufferingBar = new ProgressBar.Line('#buffering-bar', {
                trailColor: "rgba(255, 255, 255, 0.4)",
                color: "rgba(66, 139, 202, 0.6)",
            });

            bufferingTimer = setInterval(function()
            {
                var loadedFraction = $scope.player.getVideoLoadedFraction();

                bufferingBar.animate(loadedFraction, {
                    duration: 200
                });

                if(loadedFraction == 1)
                    clearTimeout(bufferingTimer);

            }, 200);

            event.target.setVolume(100);
            event.target.playVideo();
        };

        var onPlayerStateChange = function(event) {
            console.log(event.data);

            if (event.data == YT.PlayerState.PLAYING)
            {
                progressBar.animate(1);
            }

            else
            {
                progressBar.stop();
            }

            if (event.data == YT.PlayerState.ENDED)
            {
                swal("Thank you!", "You're amazing !<br />The World will thank you for that :)", "success")
            }
        };

        function loadPlayer(videoId){
            $log.info('Instanciating new YT player');

            $scope.player = new YT.Player('ytplayer', {
                width: 640,
                height: 390,
                videoId: videoId,
                playerVars: {
                    controls: 0,
                    disablekb: 1,
                    enablejsapi: 1,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    theme: 'light',
                    playerapiid: 'ytplayer'
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });

            $(window).blur(function () {
                $scope.pause();
            }).focus(function () {
                $scope.player.playVideo();
            });

            /*bufferingTimer = setInterval(function()
            {
                var loadedFraction = $scope.player.getVideoLoadedFraction();

                if(loadedFraction < 1)
                    return $('#progress-bar .buffering').width(loadedFraction*100 + '%');

                $('#progress-bar .buffering').width('100%');
                clearTimeout(bufferingTimer);

            }, 200);*/


        }

        $scope.pause = function()
        {
            $scope.player.pauseVideo();

            toastr["error"]("Please fully watch the video to validate your gift.");
        };

        $scope.$watch('$viewContentLoaded', function()
        {
            clearTimeout(bufferingTimer);

            if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined')
            {
                $log.info('Youtube API is not ready yet');

                $window.onYouTubeIframeAPIReady = function()
                {
                    $log.info('Youtube API is ready');

                    loadPlayer($scope.video.ytid);
                };

                loadScript('https://www.youtube.com/player_api');
            } else {
                $log.info('Youtube API is ready');

                if($state.current.name === 'player')
                    setTimeout(function(){ return loadPlayer($scope.video.ytid)}, 500);
            }
        });

        $scope.getVideo = function(id)
        {
            $log.log('Get video ' + id);

            for(var i = 0; i < $scope.videos.length; i++)
            {
                if($scope.videos[i].id == id)
                {
                    return $scope.videos[i];
                }
            }
        };

        $scope.getVideoYoutubeId = function(id)
        {
            var video = $scope.getVideo(id);
            return video.ytid;
        };

        function setPlayerSize(player)
        {
            var parentWidth = player.parent().width();

            return setPlayerWidth(player, parentWidth);
        }

        function expectedHeight(width, player)
        {
            return width * player.attr('data-aspectRatio');
        }

        function setPlayerWidth(player, width)
        {
            $log.info('Set player width');

            player.width(width)
                .height(expectedHeight(width, player));
        }

        function loadScript(url)
        {
            $log.info('Load script: ' + url);

            var tag = document.createElement('script');
            tag.src = url;
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        var setFluidVideo = function()
        {
            var deferred = $q.defer(),
                player = $("#ytplayer");

            $log.info('Set fluid video');

            // jQuery .data does not work on object/embed elements
            player.attr('data-aspectRatio', player.height() / player.width())
                .removeAttr('height')
                .removeAttr('width');

            $(window).resize(function(){ return setPlayerSize(player) }).resize();

            return deferred.promise;
        }



    });
