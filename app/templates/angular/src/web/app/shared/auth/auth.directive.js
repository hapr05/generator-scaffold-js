/**
 * Authentication directives
 * @class client.<%= appSlug %>.authDirective
 */
(function authDirective () {
	'use strict';

	/**
	 * Shows/hides element based on authentication
	 * @function client.<%= appSlug %>.authDirective#<%= appCamel %>Authenticated
	 * @public
	 * @param {client.<%= appSlug %>.accountFactory} authFactory - authorization factory
	 * @returns {Object} attribute directive
	 */
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
	/**
	 * Shows/hides element based on authentication (inverse of <%= appCamel %>Authenticated
	 * @function client.<%= appSlug %>.authDirective#<%= appCamel %>Unauthenticated
	 * @public
	 * @param {client.<%= appSlug %>.accountFactory} authFactory - authorization factory
	 * @returns {Object} attribute directive
	 */
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
	/**
	 * Shows/hides element based on role
	 * @function client.<%= appSlug %>.authDirective#<%= appCamel %>HasAuthority
	 * @public
	 * @param {client.<%= appSlug %>.accountFactory} authFactory - authorization factory
	 * @returns {Object} attribute directive
	 */
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
