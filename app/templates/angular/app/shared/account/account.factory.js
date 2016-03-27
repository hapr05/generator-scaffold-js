(function () {
	'use strict';

	angular.module ('<%= appSlug %>').factory ('accountFactory', function ($q, $http) {
		return {
			available: function (username, email) {
				var d = $q.defer ();

				$http.get ('/account/' + (username || ''), {
					params: {
						email: email
					}
				}).then (function () {
					d.reject ();
				}).catch (function () {
					d.resolve ();
				});

				return d.promise;
			},

			create: function (params) {
				return $http.post ('/account/', params);
			}
		};
	});
} ());
