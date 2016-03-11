(function () {
	'use strict';

	angular.module ('<%= appSlug %>').directive ('<%= appCamel %>Authenticated', function (authFactory) {
		return {
			restrict: 'A',
			link: function (scope, element) {
				var setVisibility = function () {
					if (authFactory.authenticated) {
						element.removeClass ('hidden');
					} else {
						element.addClass ('hidden');
					}
				};

				setVisibility ();
				scope.$watch (function () {
					return authFactory.authenticated;
				}, function () {
					setVisibility ();
				}); 
			}   
		};  
	}).directive ('<%= appCamel %>Unauthenticated', function (authFactory) {
		return {
			restrict: 'A',
			link: function (scope, element) {
				var setVisibility = function () {
					if (authFactory.authenticated) {
						element.addClass ('hidden');
					} else {
						element.removeClass ('hidden');
					}
				};

				setVisibility ();
				scope.$watch (function () {
					return authFactory.authenticated;
				}, function () {
					setVisibility ();
				}); 
			}   
		};  
	}).directive ('<%= appCamel %>HasAuthority', function (authFactory) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var authority = attrs.<%= appCamel %>HasAuthority,
					setVisibility = function () {
						if (authFactory.hasAuthority (authority)) {
							element.removeClass ('hidden');
						} else {
							element.addClass ('hidden');
						}
					};

				setVisibility ();
				scope.$watch (function () {
					return authFactory.authenticated;
				}, function () {
					setVisibility ();
				}); 
			}   
		};  
	});
} ());
