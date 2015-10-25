'use strict';

var apiUrl = 'http://api.localhost:8000';

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
    'youtube-embed',
    'ngTagsInput',
    'toastr',
    'ipCookie'
  ])

  .constant('apiUrl', apiUrl)

  .constant('startMode', true)

  .config(function($authProvider) {

    $authProvider.facebook({
      url: apiUrl + '/auth/facebook/',
      clientId: '427235487450804'
    });

    $authProvider.google({
      url: apiUrl + '/auth/google/',
      clientId: '406053578965-00djbfv54okleuqarfk4aaoqatg2b1k7.apps.googleusercontent.com'
    });

    $authProvider.linkedin({
      url: apiUrl + '/auth/linkedin/',
      clientId: '75lavn75q37y6u'
    });
    
    $authProvider.loginUrl = apiUrl + '/auth/login/';
    $authProvider.signupUrl = apiUrl + '/auth/registration/';
    $authProvider.loginRoute = '/login';
    $authProvider.signupRoute = '/signup';
    $authProvider.tokenName = 'key';
    $authProvider.tokenPrefix = 'givago'; // Local Storage name prefix
    $authProvider.unlinkUrl = apiUrl + '/auth/logout/';
    $authProvider.authToken = 'Token';
    $authProvider.authHeader = 'Authorization';
    $authProvider.withCredentials = false;

  })
  .config(function(toastrConfig) {
    angular.extend(toastrConfig, {      
      'closeButton': false,   
      'positionClass': 'toast-top-left',     
      'timeOut': '5000',
      'extendedTimeOut': '1000'
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
      .state('sponsor', {
        url: '/sponsor',
        templateUrl: 'views/sponsor.html',
	controller: 'ContactCtrl'
      })
      .state('charity', {
        url: '/charity',
        templateUrl: 'views/charity.html',
	controller: 'ContactCtrl'
      })
      .state('community', {
        url: '/community',
        templateUrl: 'views/community.html',
	controller: 'ContactCtrl'
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
        url: '/reset/:uid/:token/',
        templateUrl: 'views/home.html',
        controller: 'ResetCtrl'
      })
      .state('profile', {
	url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .state('legal', {
	url: '/legal',
        templateUrl: 'views/legal.html'
      });
  })

  .run(function($rootScope, $window, $auth, ajax) {
    ajax.profile()
      .success(function(response) {
        $window.localStorage.currentUser = JSON.stringify(response);
        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);	
      })
      .error(function(error) {        
	$auth.logout()
	  .then(function() {
	    $window.localStorage.currentUser = {};
	    $rootScope.currentUser = {};
	  });
      });   
  })

  .run(function($rootScope, $auth){
    $rootScope.$on('$stateChangeStart', function (event, next) {
      // Don't redirect to player if user isn't authenticated
      if(next.name === 'player' && !$auth.isAuthenticated()) {
        event.preventDefault();
      }
    });
  })
  .run(function($rootScope, ipCookie) {
    if(ipCookie('featureTour')) {
      $rootScope.currentStep = -1;
    }
    else {
      $rootScope.currentStep = 0;
      ipCookie('featureTour', false, { expires: 3000 });
    }

    $rootScope.closeFeatureTour = function() {
      $rootScope.currentStep = -1;
      ipCookie('featureTour', true, { expires: 3000 });
    };
  });
