/**
 * Email directives
 * @class client.<%= appSlug %>.emailDirective
 */
(function emailDirective () {
	'use strict';

	/**
	 * Validates an email address does not already exist
	 * @function client.<%= appSlug %>.emailDirective#<%= appCamel %>Email
	 * @public
	 * @param {angular.$q} $q - anulgar promise
	 * @param {client.<%= appSlug %>.accountFactory} authFactory - authorization factory
	 * @returns {Boolean} true if email address doe not exit
	 */
	angular.module ('<%= appSlug %>').directive ('<%= appCamel %>Email', function directive ($q, accountFactory) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link (scope, elm, attrs, ctrl) {
				ctrl.$asyncValidators.taken = function taken (modelValue) {
					if (ctrl.$isEmpty (modelValue)) {
						return $q.when ();
					}

					return accountFactory.available (false, modelValue);
				};
			}
		};
	/**
	 * Validates an email address does not already exist or belongs to the current user
	 * @function client.<%= appSlug %>.emailDirective#<%= appCamel %>EmailChange
	 * @public
	 * @param {angular.$q} $q - anulgar promise
	 * @param {client.<%= appSlug %>.accountFactory} authFactory - authorization factory
	 * @returns {Boolean} true if email address doe not exit or belongs to the current user
	 */
	}).directive ('<%= appCamel %>EmailChange', function directive ($q, accountFactory) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link (scope, elm, attrs, ctrl) {
				ctrl.$asyncValidators.taken = function taken (modelValue) {
					var check = scope.$eval (attrs.<%= appCamel %>EmailChange) || accountFactory.email;

					if (modelValue === check || ctrl.$isEmpty (modelValue)) {
						return $q.when ();
					}

					return accountFactory.available (false, modelValue);
				};
			}
		};
	});
} ());
