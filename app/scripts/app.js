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

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
	resolve: {	  
	  $canUrl: function() { return 'http://givago.co'; }
	}
      })
      .state('sponsor', {
        url: '/sponsor',
        templateUrl: 'views/sponsor.html',
	controller: 'ContactCtrl',
	resolve: {	  
	  $title: function() { return 'Sponsor'; },
	  $description: function() { return 'Givago is made for you! Contact us for more information. Together, let’s make a difference. We just need to start from somewhere.'; },
	  $canUrl: function() { return 'http://givago.co/sponsor'; }
	}
      })
      .state('charity', {
        url: '/charity',
        templateUrl: 'views/charity.html',
	controller: 'ContactCtrl',
	resolve: {
	  $title: function() { return 'Charity'; },
	  $description: function() { return 'Givago wants to support charities! Please contact us if you have some projects, and together with the community we will try our best to help you.'; },
	  $canUrl: function() { return 'http://givago.co/charity'; }	  
	}
      })
      .state('community', {
        url: '/community',
        templateUrl: 'views/community.html',
	controller: 'ContactCtrl',
	resolve: {
	  $title: function() { return 'Community'; },
	  $description: function() { return 'Givago wants to support the community. So please contact us if you have any project, and together with the community we will try our best to turn it into a reality!'; },
	  $canUrl: function() { return 'http://givago.co/community'; }
	}
      })
      .state('mosaic', {
        url: '/give/:gift',
        templateUrl: 'views/player.mosaic.html',
        controller: 'MosaicCtrl',
	resolve: {
	  $title: function() { return 'Ads'; },
	  $canUrl: function($stateParams) { return 'http://givago.co/give/'+$stateParams.gift; }	
	}
      })
      .state('player', {
        url: '/give/:gift/ad/:ad',
        templateUrl: 'views/player.video.html',
        controller: 'PlayerCtrl',
        protected: true,
	resolve: {
	  $title: function() { return 'Player'; },
	  $canUrl: function($stateParams) { return 'http://givago.co/give/'+$stateParams.gift+'/ad/'+$stateParams.ad; }
	}
      })
      .state('verifyEmail', {
        url: '/verify-email/:key/',
        templateUrl: 'views/home.html',
        controller: 'VerifyEmailCtrl',
	resolve: {
	  $title: function() { return 'Verify you email address'; }
	}
      })
      .state('resetConfirm', {
        url: '/reset/:uid/:token/',
        templateUrl: 'views/home.html',
        controller: 'ResetCtrl'
      })
      .state('profile', {
	url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
	resolve: {
	  $title: function() { return 'Profile'; }
	}
      })
      .state('legal', {
	url: '/legal',
        templateUrl: 'views/legal.html',
	resolve: {
	  $title: function() { return 'Legal'; },
	  $canUrl: function($stateParams) { return 'http://givago.co/legal'; }	
	}
      })
      .state('aboutus', {
	url: '/about-us',	
	templateUrl: 'views/aboutus.html',
	resolve: {
	  $title: function() { return 'About Us'; },
	  $canUrl: function($stateParams) { return 'http://givago.co/about-us'; }	
	}
      });

    $locationProvider.html5Mode(true);
  })

  .run(function($rootScope, $window, $auth, ajax) {
    ajax.profile()
      .success(function(response) {
        $window.localStorage.currentUser = JSON.stringify(response);
        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);	
      })
      .error(function() {        
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
  })
  .run(['$rootScope', '$timeout', '$state', function($rootScope, $timeout, $state) {

    $rootScope.$on('$stateChangeSuccess', function() {
      var title = getTitleValue($state.$current.locals.globals.$title);
      var description = getDescriptionValue($state.$current.locals.globals.$description);
      var canUrl = getCanUrlValue($state.$current.locals.globals.$canUrl);
      
      $timeout(function() {
	$rootScope.$title = title;
	$rootScope.$description = description;
	$rootScope.$canUrl = canUrl;
      });
    });

    function getTitleValue(title) {
      return angular.isFunction(title) ? title() : title;
    }

    function getDescriptionValue(description) {
      return angular.isFunction(description) ? description() : description;
    }

    function getCanUrlValue(canUrl) {
      return angular.isFunction(canUrl) ? canUrl() : canUrl;
    }
  }]);
