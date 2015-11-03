'use strict';

/**
 * @ngdoc function
 * @name givagoApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the givagoApp to see and edit client profile
 */
angular.module('givagoApp').controller('ProfileCtrl', function ($scope, $modal){

  $scope.goToEditProfile = function() {
    $modal.open({
      templateUrl: 'editProfile.html',
      controller: 'ProfileModalCtrl'   
    });    
  };

  $scope.goToChangePassword = function() {
    $modal.open({
      templateUrl: 'changePassword.html',
      controller: 'ProfileModalCtrl'     
    });      
  };

  $scope.goToEditInterests = function () {
    $modal.open({
      templateUrl: 'interests.html',
      controller: 'InterestModalCtrl',
      size: 'sm'
    });
  };

  $scope.goToChangeAvatar = function () {
    $modal.open({
      templateUrl: 'avatar.html',
      controller: 'AvatarModalCtrl',
      size: 'lg'
    });
  };
});

angular.module('givagoApp').controller('ProfileModalCtrl', function ($scope, $modalInstance, $rootScope, $window, ajax, toastr) {
  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };


  $scope.username = $rootScope.currentUser.username;
  $scope.firstName = $rootScope.currentUser.first_name; // jshint ignore:line
  $scope.lastName = $rootScope.currentUser.last_name; // jshint ignore:line
  $scope.dateBirth = $rootScope.currentUser.date_birth; // jshint ignore:line
  $scope.gender = $rootScope.currentUser.gender;
  $scope.incomeLevel = $rootScope.currentUser.income_level; // jshint ignore:line
  
  $scope.changePassword = function() {
    ajax.changePassword($scope.password, $scope.confirmPassword, $scope.oldPassword).success(function(response) {       
      $modalInstance.close();
      toastr.success(response.success);
    }).error(function(response) {
      if(angular.isObject(response)) {
	$scope.errors = response;
      }      
      toastr.error('New password hasn\'t been changed.');     
    });
  };

  $scope.editProfile = function() {
    ajax.editProfile($scope.username, $scope.firstName, $scope.lastName, $scope.dateBirth, $scope.gender, $scope.incomeLevel).success(function(response) {
      $window.localStorage.currentUser = JSON.stringify(response);
      $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
      $modalInstance.close();
      toastr.success('You have updated your profile.');
    }).error(function(response) {
      if(angular.isObject(response)) {
	$scope.errors = response;
      }      
      toastr.error('Your profile hasn\'t been updated.');    
    });
  };
  
});

angular.module('givagoApp').controller('InterestModalCtrl', function ($scope, $q, $rootScope, ajax){
  $scope.interest = [];
  angular.forEach($rootScope.currentUser.interests, function(value) {
    var tag = { text : value };
    $scope.interest.push(tag);	
  });          
  $scope.addTag = function(tag) {
    ajax.addInterest(tag.text).success(function(data) {
      if(data.status === 'ok') {
	$rootScope.currentUser.interests.push(tag.text);
	return true;
      } else {
	return false;
      }
    }).error(function() { return false; });
  };
  $scope.removeTag = function(tag) {
    ajax.removeInterest(tag.text).success(function(data) {
      if(data.status === 'ok') {
	$rootScope.currentUser.interests.pop(tag.text);    
	return true;
      } else {
	return false;
      }
    }).error(function() { return false; });
  };
  $scope.loadTags = function(query) {
    var defer = $q.defer();
    ajax.tag(query).success(function(data) {
      defer.resolve(data);
    });
    return defer.promise;
  };
  
});

angular.module('givagoApp').controller('AvatarModalCtrl', function ($rootScope, $scope, $window, $modalInstance, Upload, $timeout, apiUrl, toastr){
  $scope.progress = 0;
  $scope.upload = function (dataUrl) {
    Upload.upload({
      url: apiUrl + '/auth/user/',
      method: 'PUT',
      data: {
	username: $rootScope.currentUser.username,
        avatar: Upload.rename(Upload.dataUrltoBlob(dataUrl), $rootScope.currentUser.username+'.png')
      },
    }).then(function (response) {
      $timeout(function () {
        $window.localStorage.currentUser = JSON.stringify(response.data);
	$rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
	$modalInstance.close();
	toastr.success('You have updated your picture.');
      });
    }, function (response) {
      toastr.error('Error.');
    }, function (evt) {
      $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
    });
  };
});
