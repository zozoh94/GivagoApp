'use strict';

var apiUrl = 'http://127.0.0.1:8000';

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
    'satellizer',
    'ngStorage',
    'ui.bootstrap',
    'ui.router',
    'ui.bootstrap.showErrors',
    'validation.match',
    'youtube-embed'
  ])

  .constant('apiUrl', apiUrl)

  .config(function($authProvider) {

    $authProvider.httpInterceptor = true; // Add Authorization header to HTTP request
    $authProvider.loginOnSignup = true;
    $authProvider.loginUrl = apiUrl + '/auth/login/';
    $authProvider.signupUrl = apiUrl + '/auth/registration/';
    $authProvider.loginRoute = '/login';
    $authProvider.signupRoute = '/signup';
    $authProvider.tokenName = 'key';
    $authProvider.tokenPrefix = 'givago'; // Local Storage name prefix
    $authProvider.unlinkUrl = apiUrl + '/auth/logout/';
    $authProvider.authToken = 'Token';
    $authProvider.authHeader = 'Authorization';

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
        url: '/give/:gift/',
        templateUrl: 'views/player.mosaic.html',
        controller: 'MosaicCtrl'
      })
      .state('player', {
        url: '/give/:gift/ad/:ad/',
        templateUrl: 'views/player.video.html',
        controller: 'PlayerCtrl',
        protected: true
      })
      .state('verifyEmail', {
        url: '/verify-email/:key/',
        templateUrl: 'views/home.html',
        controller: 'VerifyEmailCtrl'
      })
      .state('resetConfirm', {
        url: '/reset/confirm/:uid/:token/',
        templateUrl: 'views/home.html',
        controller: 'ResetCtrl'
      });
  })

  .run(function($rootScope, $window, $auth) {
    if ($auth.isAuthenticated()) {
      var user = $window.localStorage.currentUser;

      try
      {
        if(user !== 'undefined') {
          $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
	}
      }
      catch(e)
      {
        console.log('invalid json');
      }
    }
  })

  .run(function($rootScope, $auth){
    $rootScope.$on('$stateChangeStart', function (event, next) {
      // Don't redirect to player if user isn't authenticated
      if(next.name === 'player' && !$auth.isAuthenticated()) {
        event.preventDefault();
      }
    });
  });

toastr.options = {
  'closeButton': false,
  'debug': false,
  'progressBar': false,
  'positionClass': 'toast-top-left',
  'onclick': null,
  'showDuration': '300',
  'hideDuration': '1000',
  'timeOut': '5000',
  'extendedTimeOut': '1000',
  'showEasing': 'swing',
  'hideEasing': 'linear',
  'showMethod': 'fadeIn',
  'hideMethod': 'fadeOut'
};
