(function authFactory () {
	'use strict';

	// TODO see if this can be broken up into subfunctions for params
	angular.module ('<%= appSlug %>').factory ('authFactory', function factory ($timeout, $http, $state, jwtHelper, localStorageService, accountFactory) {
		var _auth = localStorageService.get ('token'),
			_timeout = false,
			_reset = function _reset () {
				_auth = false;
				localStorageService.set ('token', false);

				if (_timeout) {
					$timeout.cancel (_timeout);
					_timeout = false;
				}

				accountFactory.reset ();
			},
			_set = function _set (token) {
				_auth = token;
				localStorageService.set ('token', token);
			},
			_refresh = function _refresh (loadAccount) {
				$http.get ('authenticate').then (function _refreshSuccessHandler (response) {
					_set (response.headers ('Authorization'));
					_timeout = $timeout (_refresh, Math.min (jwtHelper.getTokenExpirationDate (_auth) - Date.now () - 5 * 60 * 1000, 117440512));

					if (loadAccount) {
						accountFactory.get (jwtHelper.decodeToken (_auth).user);
					}
				}).catch (function _refreshFailureHandler () {
					_reset ();
					$state.go ('login');
				});
			};

		if (_auth && !jwtHelper.isTokenExpired (_auth)) {
			_refresh (true);
		} else {
			_reset ();
		}

		return {
			get authenticated () {
				return _auth && !jwtHelper.isTokenExpired (_auth);
			},

			authenticate: function authenticate (username, password, rememberMe) {
				_reset ();
				return $http.post ('authenticate', {
					username: username,
					password: password,
					rememberMe: rememberMe
				}).then (function authenticateSuccessHandler (response) {
					_set (response.headers ('Authorization'));
					_timeout = $timeout (_refresh, Math.min (jwtHelper.getTokenExpirationDate (_auth) - Date.now () - 5 * 60 * 1000, 117440512));
					accountFactory.get (jwtHelper.decodeToken (_auth).user);
				});
			},

			forgot: function forgot (email, token, password) {
				return $http.post ('authenticate/forgot', {
					email: email,
					token: token || undefined,
					password: password
				});
			},

			hasAuthority: function hasAuthority (authority) {
				return _auth && !jwtHelper.isTokenExpired (_auth) && -1 !== jwtHelper.decodeToken (_auth).scope.indexOf (authority);
			},

			hasAnyAuthority: function hasAnyAuthority (authorities) {
				var i;

				if (_auth && !jwtHelper.isTokenExpired (_auth)) {
					for (i = 0; i < authorities.length; i++) {
						if (-1 !== jwtHelper.decodeToken (_auth).scope.indexOf (authorities [i])) {
							return true;
						}
					}
				}

				return false;
			},

			reset: function reset () {
				_reset ();
			},

			refresh: function refresh (loadAccount) {
				_refresh (loadAccount);
			},

			get token () {
				var token;

				if (_auth) {
					token = localStorageService.get ('token');

					if (jwtHelper.isTokenExpired (token)) {
						_reset ();
						return null;
					}

					return token;
				}

				return null;
			}
		};
	});
} ());
