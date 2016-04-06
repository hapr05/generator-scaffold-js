(function authDirective () {
	'use strict';

	angular.module ('<%= appSlug %>').directive ('<%= appCamel %>Authenticated', function authenticated (authFactory) {
		return {
			restrict: 'A',
			link: function link (scope, element) {
				var setVisibility = function setVisibility () {
					if (authFactory.authenticated) {
						element.removeClass ('hidden');
					} else {
						element.addClass ('hidden');
					}
				};

				setVisibility ();
				scope.$watch (function watchAuthenticatedVar () {
					return authFactory.authenticated;
				}, function watchAuthenticatedHandler () {
					setVisibility ();
				});
			}
		};
	}).directive ('<%= appCamel %>Unauthenticated', function unauthenticated (authFactory) {
		return {
			restrict: 'A',
			link: function link (scope, element) {
				var setVisibility = function setVisibility () {
					if (authFactory.authenticated) {
						element.addClass ('hidden');
					} else {
						element.removeClass ('hidden');
					}
				};

				setVisibility ();
				scope.$watch (function watchUnauthenticatedVar () {
					return authFactory.authenticated;
				}, function watchUnauthenticatedHandler () {
					setVisibility ();
				});
			}
		};
	}).directive ('<%= appCamel %>HasAuthority', function hasAuthority (authFactory) {
		return {
			restrict: 'A',
			link: function link (scope, element, attrs) {
				var authority = attrs.<%= appCamel %>HasAuthority,
					setVisibility = function setVisiblity () {
						if (authFactory.hasAuthority (authority)) {
							element.removeClass ('hidden');
						} else {
							element.addClass ('hidden');
						}
					};

				setVisibility ();
				scope.$watch (function watchHasAuthorityVar () {
					return authFactory.authenticated;
				}, function watchHasAuthorityHandler () {
					setVisibility ();
				});
			}
		};
	});
} ());
