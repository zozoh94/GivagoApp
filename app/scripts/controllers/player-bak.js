'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:PlayerCtrl
 * @description
 * # MainCtrl
 * Controller of the givagoApp's Player
 */
angular.module('givagoApp')
    .controller('PlayerCtrl', function (
            $scope,
            $sce,
            $q,
            $document,
            $auth,
            $sessionStorage,
            $modal,
            $log,
            Account
        ){

        $scope.state = 0;
        $scope.notice = 0;
        $scope.progress = 0;
        $scope.notifications = [];
        $scope.video = {};

        $scope.modalInstance = {};

        //$scope.$storage = $sessionStorage.$default(defaultStorage);

        // Load the IFrame Player API code asynchronously.
        loadScript('https://www.youtube.com/player_api');

        $scope.authenticate = function(provider) {
            $auth.authenticate(provider)
                .then(function() {
                    $scope.getProfile();
                    $scope.notify('You have successfully logged in');
                })
                .catch(function(response) {
                    $scope.notify(response.data.message);
                });
        };

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.selectGift = function()
        {
            setState(1);

            $scope.notify('Please select a video you\'d like to watch');
        };

        $scope.showVideo = function(videoID)
        {
            setState(2);

            $scope.video = getVideo(videoID);
            $scope.sponsorLogo = $scope.video.sponsor.logo.url;

            displayPlayer(getVideoYoutubeId(videoID));
        };

        $scope.goToHome = function()
        {
            setState(0);
        };

        $scope.pause = function()
        {
            player.pauseVideo();

            $scope.notify('Please fully watch the video to validate your gift');
        };

        $scope.$watch('$viewContentLoaded', function()
        {

        });

        $scope.scrollToContent = function()
        {
            var contentContainer = angular.element(document.getElementById('content-container'));

            $document.scrollTo(contentContainer, 0, 800);
        };

        $scope.notify = function(notification)
        {
            if(!notification)
                return;

            $scope.notifications.push(notification);
        };

        $scope.getProfile = function() {
            Account.getProfile()
                .success(function(data) {
                    $scope.user = data;
                })
                .error(function(error) {
                    $scope.notify(error.message);
                });
        };

        $scope.getProfile();

        /**
         * Update user's profile information.
         */
        $scope.updateProfile = function() {
            Account.updateProfile({
                displayName: $scope.user.displayName,
                email: $scope.user.email
            }).then(function() {
                $scope.notify('Profile has been updated');
            });
        };
        /**
         * Link third-party provider.
         */
        $scope.link = function(provider) {
            $auth.link(provider)
                .then(function() {
                    $scope.notify('You have successfully linked ' + provider + ' account');
                })
                .then(function() {
                    $scope.getProfile();
                })
                .catch(function(response) {
                    $scope.notify(response.data.message);
                });
        };
        /**
         * Unlink third-party provider.
         */
        $scope.unlink = function(provider) {
            $auth.unlink(provider)
                .then(function() {
                    $scope.notify('You have successfully unlinked ' + provider + ' account');
                })
                .then(function() {
                    $scope.getProfile();
                })
                .catch(function(response) {
                    $scope.notify(response.data ? response.data.message : 'Could not unlink ' + provider + ' account');
                });
        };

        function resetStorage()
        {
            return $sessionStorage.$reset(defaultStorage);
        }

        /**
         * Logout
         */
        $scope.logout = function()
        {
            if (!$auth.isAuthenticated()) {
                return;
            }
            $auth.logout()
                .then(function() {
                    $scope.notify('You have been logged out');
                });
        };

        $scope.openLoginModal = function (size) {

            if($auth.isAuthenticated())
                return;

            $scope.modalInstance = $modal.open({
                templateUrl: 'login.html',
                controller: 'PlayerCtrl',
                size: size
            });

        };

        function setProfilePic()
        {
            console.log('Set Profile Picture');

            Facebook.api("/me/picture",
                {
                    "redirect": false,
                    "height": "200",
                    "type": "normal",
                    "width": "200"
                },
                function (response)
                {
                    if (response && !response.error)
                    {
                        //$scope.$apply(function()
                        //{
                            $scope.userProfilePic = response.url;
                        //});
                    }
                }
            );
        }

        function setState(state)
        {
            var deferred = $q.defer();

            if(player)
                $scope.pause();

            $scope.state = state;

            clearTimeout(bufferingTimer);
            $('#progress-bar .buffering').width('0%');

            return deferred.promise;
        }

        function getVideo(id)
        {
            var video = findInArray($scope.videos, id);
            return video[0];
        }

        function getSponsor(id)
        {
            var sponsor = findInArray($scope.sponsors, id);
            return sponsor[0];
        }

        function findInArray(haysatch, needle) {
            return $.grep(haysatch, function (e) {
                return e.id === needle;
            });
        }

        function getVideoYoutubeId(id)
        {
            var video = getVideo(id);
            return video.ytid;
        }

        var player;
        function displayPlayer(id)
        {
            var deferred  = $q.defer();

            deferred.notify('About to create the youtube player.');

            if(!player){
                player = new YT.Player('ytplayer', {
                    width: 640,
                    height: 390,
                    videoId: id,
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

                $(window).blur(function(){
                    if($scope.state == 2) {
                        $scope.pause();
                    }
                }).focus(function(){
                    if($scope.state == 2){
                        player.playVideo();
                    }
                });

            } else {
                player.loadVideoById(id);

                clearTimeout(bufferingTimer);
                $('#progress-bar .progress-bar').width('0%');
                createBufferingTimer();
            }

            deferred.resolve();

            return deferred.promise;
        }

        var bufferingTimer;
        function createBufferingTimer(){
            bufferingTimer = setInterval(function() {

                var loadedFraction = player.getVideoLoadedFraction();

                if(loadedFraction < 1)
                    return $('#progress-bar .buffering').width(loadedFraction*100 + '%');

                $('#progress-bar .buffering').width('100%');
                clearTimeout(bufferingTimer);

            }, 200);
        }

        var onPlayerReady = function(event)
        {
            setFluidVideo();
            createBufferingTimer();

            event.target.setVolume(0);
            event.target.playVideo();
        };

        var progressTimer;
        var onPlayerStateChange = function(event) {
            console.log(event.data);

            if (event.data == YT.PlayerState.PLAYING) {

                var playerTotalTime = player.getDuration();

                progressTimer = setInterval(function() {

                    var playerCurrentTime = player.getCurrentTime();
                    var playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100;

                    $scope.videoProgressBar = playerTimeDifference;

                    $('#progress-bar .actual-progress').width(playerTimeDifference + '%');

                }, 200);
            } else {

                clearTimeout(progressTimer);

            }

            if (event.data == YT.PlayerState.ENDED) {

                swal("Thank you!", "You're amazing ! The World will thank you for that :)", "success")

            }
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
            console.log('Set player width');

            player.width(width)
                  .height(expectedHeight(width, player));
        }

        function loadScript(url)
        {
            var tag = document.createElement('script');
            tag.src = url;
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        function setFluidVideo()
        {
            var deferred = $q.defer(),
                player = $("#ytplayer");

            console.log('Set fluid video');

            // jQuery .data does not work on object/embed elements
            player.attr('data-aspectRatio', player.height() / player.width())
                .removeAttr('height')
                .removeAttr('width');

            $(window).resize(function(){ return setPlayerSize(player) }).resize();

            return deferred.promise;
        }

        //+ Jonas Raoni Soares Silva
        //@ http://jsfromhell.com/array/shuffle [v1.0]
        function shuffle(o)
        {   //v1.0
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }

    });
