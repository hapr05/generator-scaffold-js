(function accountFactory () {
	'use strict';

	angular.module ('<%= appSlug %>').factory ('accountFactory', function factory ($q, $resource) {
		var accountRoute = $resource ('account/:username');

		return {
			available: function available (username, email) {
				var d = $q.defer ();

				accountRoute.get ({
					username: username || undefined,
					email: email
				}).$promise.then (function reject () {
					d.reject ();
				}).catch (function resolve () {
					d.resolve ();
				});

				return d.promise;
			},

			create: function create (user) {
				return accountRoute.save (user).$promise;
			}
		};
	});
} ());
