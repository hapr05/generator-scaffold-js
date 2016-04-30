/**
 * Username directive
 * @class client.<%= appSlug %>.usernameDirective
 */
(function usernameDirective () {
	'use strict';

	/**
	 * Validates username available
	 * @function client.<%= appSlug %>.usernameDirective#<%= appCamel %>Username
	 * @public
	 * @param {angular.$q} $q - angular promise
	 * @param {client.<%= appSlug %>.accountFactory} accountFactory - account factory
	 * @returns {Boolean} true if username is avilable
	 */
	angular.module ('<%= appSlug %>').directive ('<%= appCamel %>Username', function directive ($q, accountFactory) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link (scope, elm, attrs, ctrl) {
				ctrl.$asyncValidators.taken = function taken (modelValue) {
					if (ctrl.$isEmpty (modelValue)) {
						return $q.when ();
					}

					return accountFactory.available (modelValue);
				};
			}
		};
	});
} ());
