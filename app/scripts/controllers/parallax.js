angular.module('givagoApp')
    .controller('ParallaxCtrl', function ($rootScope, $scope)
    {
        $scope.parallaxScene = {};

        var doResize = function() {
            var height = $(window).height();
            var playerPosition = $('.player').position();

            if($(window).width() < 1024)
                $scope.parallaxScene.parallax('disable');
            else
                $scope.parallaxScene.parallax('enable');

            if(!playerPosition)
                return;

            var minHeight = playerPosition.top + $('.player').height() + 30;

            if(height < minHeight)
                height = minHeight;

            console.log(playerPosition);
            console.log($('.player').height());
            console.log(height);
            console.log(minHeight);

            $('#parallax-wrapper').height(height);

            var getSceneMargin = -($('#parallax-scene').css('marginTop').replace("px", "") * 2);

            $('#parallax-scene > li > div').each(function(){
                $(this).width(($(window).width() + getSceneMargin)); //* ($(this).parent().attr('data-depth') + 1));
                $(this).height(height + getSceneMargin); //* ($(this).parent().attr('data-depth') + 1));
            });

            /*$('#top-menu').affix({
             offset: {
             top: function() {
             return $(window).height()
             }
             }
             });*/
        }

        $rootScope.$on('$viewContentLoaded', function() {
            console.log('coucou');
            setTimeout(function(){$(window).resize(doResize).resize()},100);

            $scope.parallaxScene = $('#parallax-scene').parallax({
                scalarX: 10,
                scalarY: 15
            });
        });
    }
);