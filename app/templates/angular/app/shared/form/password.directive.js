(function () {
	'use strict';

	angular.module ('<%= appCamel %>').directive ('<%= appCamel %>PasswordStrength', function () {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/shared/form/password.strength.html',
			link: function (scope, element, attr) {
				var colors = [ 'zero', 'one', 'two', 'three', 'four', 'five'],
					measure = function measure (password) {
						return [
							/(?=.*[a-z])/.test (password),
							/(?=.*[A-Z])/.test (password),
							/(?=.*[0-9])/.test (password),
							/(?=.*\W)/.test(password),
							password.length >= 8
						].filter (function isTrue (test) {
							return test;
						}).length;
					};

				scope.$watch(attr.password, function (password) {
					var str = angular.isString (password) ? measure (password) : 0,
						c = colors [measure (password || '')];

					element.find ('ul').children ('li').removeClass ();
					element.find ('ul').children ('li').slice (0, str).addClass (c);
				});
			}   
		};  
	}).directive ('<%= appCamel %>PasswordValid', function () {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elm, attrs, ctrl) {
				ctrl.$validators.<%= appCamel %>PasswordValid = function validateStrength (modelValue, viewValue) {
					return 0 === viewValue.length || /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$/.test (viewValue);
				};
			}   
		};
	});
} ());
