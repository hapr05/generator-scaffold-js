(function () {
	'use strict';

	angular.module ('<%= appSlug %>').factory ('accountFactory', function ($q, $resource) {
		var accountRoute = $resource ('account/:username');

		return {
			available: function (username, email) {
				var d = $q.defer ();

				accountRoute.get ({
					username: username || undefined,
					email: email
				}).$promise.then (function () {
					d.reject ();
				}).catch (function () {
					d.resolve ();
				});

				return d.promise;
			},

			create: function (user) {
				return accountRoute.save (user).$promise;
			}
		};
	});
} ());
