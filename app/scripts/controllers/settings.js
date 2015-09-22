'use strict';

angular.module('givagoApp')
  .controller('SettingsCtrl', function ($scope, $q, ajax){
    ajax.interest().success(function(data) {      
      $scope.interest = [];
      angular.forEach(data, function(value) {
	var tag = { text : value };
	$scope.interest.push(tag);	
      });      
    });
    $scope.addTag = function(tag) {
      ajax.addInterest(tag.text).success(function(data) {
	if(data.status == "ok")
	  return true;
	else
	  return false;
      }).error(function() { return false; });
    };
    $scope.removeTag = function(tag) {
      ajax.removeInterest(tag.text).success(function(data) {
	if(data.status == "ok")
	  return true;
	else
	  return false;
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
