(function () {
	'use strict';

	angular.module ('<%= appSlug %>').factory ('authFactory', function ($timeout, $http, jwtHelper, localStorageService) {
		var _auth = localStorageService.get ('token'),
			_reset = function () {
				_auth = false;
				localStorageService.set ('token', false);
			},
			_set = function (token) {
				_auth = token;
				localStorageService.set ('token', token);
			},
			_refresh = function () {
				$http.get ('authenticate').then (function (response) {
					_set (response.headers ('Authorization'));
					$timeout (_refresh, jwtHelper.getTokenExpirationDate (_auth) - Date.now () - 5 * 60 * 1000);
				}).catch (function () {
					_reset ();
				});
			};

		if (_auth && !jwtHelper.isTokenExpired (_auth)) {
			_refresh ();
		} else {
			_reset ();
		}

		return {
			get authenticated () {
				return _auth && !jwtHelper.isTokenExpired (_auth);
			},

			authenticate: function (username, password) {
				_reset ();
				return $http.post ('authenticate', {
					username: username,
					password: password
				}).then (function (response) {
					_set (response.headers ('Authorization'));
					$timeout (_refresh, jwtHelper.getTokenExpirationDate (_auth) - Date.now () - 5 * 60 * 1000);
				});
			},

			forgot: function (email, token, password) {
				return $http.post ('authenticate/forgot', {
					email: email,
					token: token || undefined,
					password: password
				});
			},

			hasAuthority: function (authority) {
				return _auth && !jwtHelper.isTokenExpired (_auth) && -1 !== jwtHelper.decodeToken (_auth).scope.indexOf (authority);
			},

			reset: function () {
				_reset ();
			},

			refresh: function () {
				_refresh ();
			},

			get token () {
				var token;

				if (_auth) {
					token = localStorageService.get ('token');

					if (jwtHelper.isTokenExpired (token)) {
						_reset ();
						return null;
					} else {
						return token;
					}
				} else {
					return null;
				}
			}
		};
	});
} ());
