'use strict';

angular.module('givagoApp')
  .factory('ajax', function ($http, apiUrl) {
    return {
      ads: function(/*page*/) {
        return $http.get(apiUrl+'/ad/');//?page='+page);
      },
      ad: function(id) {
	return $http.get(apiUrl+'/ad/'+id+'/');
      },
      adSee: function(id, give) {
	return $http.post(apiUrl+'/ad/'+id+'/see/', { 'give' : give });
      },
      adDailymotionSee: function(give) {
	return $http.post(apiUrl+'/ad/see/dailymotion/', { 'give' : give });
      },
      app: function(os) {
	return $http.get(apiUrl+'/app/?os='+os);
      },
      appClick: function(id, give) {
	return $http.post(apiUrl+'/app/'+id+'/click/', { 'give' : give});
      },
      gifts: function() {
	return $http.get(apiUrl+'/gift/');
      },
      verifyEmail: function(key) {
	return $http.post(apiUrl+'/auth/registration/verify-email/login/', { key : key});
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
      },
      changePassword: function(password1, password2, oldPassword) {
	return $http.post(apiUrl+'/auth/password/change/', { 'new_password1' : password1, 'new_password2' : password2, 'old_password' : oldPassword });
      },
      profile: function() {
        return $http.get(apiUrl+'/auth/user/');
      },
      editProfile: function(username, firstName, lastName, dateBirth, gender, incomeLevel) {
	var dateBirthFinal;
	if(dateBirth instanceof Date) {
	    dateBirthFinal = dateBirth.toISOString().slice(0,10);
	} else {
	    dateBirthFinal = dateBirth;
	}
	return $http.put(apiUrl+'/auth/user/', {'username' : username, 'first_name' : firstName, 'last_name' : lastName,  'date_birth' : dateBirthFinal, 'gender' : gender, 'income_level' : incomeLevel});
      },
      contactCharity: function(firstName, lastName, email, phone, charityName, position, comment) {
	return $http.post(apiUrl+'/contact/charity/', {'first_name': firstName, 'last_name': lastName, 'email': email, 'phone': phone, 'charity_name': charityName, 'position': position, 'comment': comment });
      },
      contactSponsor: function(firstName, lastName, email, phone, companyName, position, budget, comment) {
	return $http.post(apiUrl+'/contact/sponsor/', {'first_name': firstName, 'last_name': lastName, 'email': email, 'phone': phone, 'company_name': companyName, 'position': position, 'budget': budget, 'comment': comment });
      },
      contactCommunity: function(firstName, lastName, email, phone, comment) {
	return $http.post(apiUrl+'/auth/community/', {'first_name': firstName, 'last_name': lastName, 'email': email, 'phone': phone, 'comment': comment });
      }
    };
  });
