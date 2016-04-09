(function accountFactory () {
	'use strict';

	angular.module ('<%= appSlug %>').factory ('accountFactory', function factory ($q, $resource) {
		var accountRoute = $resource ('account/:userId', {
			userId: '@id'
		}, {
			update: {
				method: 'POST',
				transformRequest: function transformRequest (data) {
					if (!data.password) {
						/* Don't send empty password */
						delete data.password;
					}
					delete data.username;
					delete data.created;

					return angular.toJson (data);
				}
			}
		}, {
			cancellable: true
		}),
			_user = new accountRoute ();

		return {
			get user () {
				return _user;
			},

			available: function available (username, email) {
				var d = $q.defer ();

				accountRoute.query ({
					username: username || undefined,
					email: email
				}).$promise.then (function reject () {
					d.reject ();
				}).catch (function resolve () {
					d.resolve ();
				});

				return d.promise;
			},

			get: function get (id) {
				_user = accountRoute.get ({ userId: id });
			},

			reset: function reset () {
				if (_user.$cancelRequest) {
					_user.$cancelRequest ();
				}

				_user = new accountRoute ();
			},

			create: function create (user) {
				return accountRoute.save (user).$promise;
			}
		};
	});
} ());
