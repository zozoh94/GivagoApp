'use strict';

angular.module('givagoApp')
  .factory('ajax', function ($http, apiUrl) {
    return {
      ads: function(page) {
        return $http.get(apiUrl+'/ad/?page='+page);
      },
      ad: function(id) {
	return $http.get(apiUrl+'/ad/'+id+'/');
      },
      adSee: function(id) {
	return $http.post(apiUrl+'/ad/'+id+'/see/');
      },
      gifts: function() {
	return $http.get(apiUrl+'/gift/');
      },
      verifyEmail: function(key) {
	return $http.post(apiUrl+'/auth/registration/verify-email/', { key : key});
      },
      reset: function(email) {
	return $http.post(apiUrl+'/auth/password/reset/', { email : email});
      },
      resetConfirm: function(uid, token, password1, password2) {
	return $http.post(apiUrl+'/auth/password/reset/confirm/', { 'uid' : uid, 'token' : token, 'new_password1' : password1, 'new_password2' : password2 });
      }
    };
  });
