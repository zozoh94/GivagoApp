'use strict';

angular.module('givagoApp')
  .factory('ajax', function ($http, apiUrl) {
    return {
      ads: function(page) {
        return $http.get(apiUrl+'/ad/');//?page='+page);
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
      },
      interest: function() {
	return $http.get(apiUrl+'/auth/user/interest/');
      },
      addInterest: function(tag) {
	return $http.post(apiUrl+'/auth/user/interest/', { tags: tag});
      },
      removeInterest: function(tag) {
	return $http.delete(apiUrl+'/auth/user/interest/'+tag+'/');
      },
      tag: function(query) {
	return $http.get(apiUrl+'/tag/', {params : { query : query }});
      }
    };
  });
