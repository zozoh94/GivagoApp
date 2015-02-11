'use strict';

/**
 * @ngdoc overview
 * @name givagoApp
 * @description
 * # givagoApp
 *
 * Main module of the application.
 */
angular
    .module('givagoApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'duScroll',
        'growlNotifications',
        'satellizer',
        'ngStorage',
        'ui.bootstrap',
        'ui.router',
        'ui.bootstrap.showErrors',
        'validation.match'
    ])

    .config(function($authProvider) {

        $authProvider.httpInterceptor = false; // Add Authorization header to HTTP request
        $authProvider.loginOnSignup = true;
        $authProvider.loginRedirect = '';
        $authProvider.logoutRedirect = '/';
        $authProvider.signupRedirect = '/login';
        $authProvider.loginUrl = 'http://api.givago.co/auth/login/';
        $authProvider.signupUrl = 'http://api.givago.co/auth/signup/';
        $authProvider.loginRoute = '/login';
        $authProvider.signupRoute = '/signup';
        $authProvider.tokenName = 'token';
        $authProvider.tokenPrefix = 'givago'; // Local Storage name prefix
        $authProvider.unlinkUrl = 'http://api.givago.co/auth/unlink/';
        $authProvider.authHeader = 'Authorization';

        $authProvider.facebook({
            clientId: '914664205229427',
            url: 'http://api.givago.co/auth/facebook/'
        });

        $authProvider.google({
            clientId: '914098339668-vmo5h65htrk0c4ovej0cr5ntk31h0tti.apps.googleusercontent.com',
            url: 'http://api.givago.co/auth/google/'
        });

    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
            .state('mosaic', {
                url: '/give/:gift',
                templateUrl: 'views/player.mosaic.html',
                controller: 'MosaicCtrl'
            })
            .state('player', {
                url: '/give/:gift/thanks-to/:partner',
                templateUrl: 'views/player.video.html',
                controller: 'PlayerCtrl',
                protected: true
            })
    })

    .run(function($rootScope, $window, $auth) {
        if ($auth.isAuthenticated()) {
            var user = $window.localStorage.currentUser;

            try
            {
                if(user !== "undefined")
                    $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
            }
            catch(e)
            {
                console.log('invalid json');
            }
        }
    })

    .run(function($rootScope, $auth){
        $rootScope.$on('$stateChangeStart', function (event, next, current) {

            // Don't redirect to player if user isn't authenticated
            if(next.name === 'player' && !$auth.isAuthenticated())
                event.preventDefault();
        });
    })

    /**
     * Just for debugging purposes.
     * Shows objects in a pretty way
     */
    .directive('debug', function() {
        return {
            restrict:	'E',
            scope: {
                expression: '=val'
            },
            template:	'<pre>{{debug(expression)}}</pre>',
            link:	function(scope) {
                // pretty-prints
                scope.debug = function(exp) {
                    return angular.toJson(exp, true);
                };
            }
        }
    })

toastr.options = {
    "closeButton": false,
    "debug": false,
    "progressBar": false,
    "positionClass": "toast-top-left",
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}