/**
 * Handles logged in user account
 * @class client.<%= appSlug %>.accountFactory
 */
(function accountFactory () {
	'use strict';

	angular.module ('<%= appSlug %>').factory ('accountFactory', function factory ($q, $resource, $http, $state) {
		var AccountRoute = $resource ('account/:userId', {
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
			_user = new AccountRoute ();

		return {
			/**
			 * The currently logged in user
			 * @member client.<%= appSlug %>.accountFactory#user
			 * @public
			 */
			get user () {
				return _user;
			},

			/**
			 * Indicates if a username and/or email account is avilable for registration
			 * @function client.<%= appSlug %>.accountFactory#available
			 * @public
			 * @param {String} [username] - username to check
			 * @param {String} [email] - email address to check
			 * @returns {Boolean} true if available
			 */
			available: function available (username, email) {
				var d = $q.defer ();

				AccountRoute.query ({
					username: username || undefined,
					email: email
				}).$promise.then (function reject () {
					d.reject ();
				}).catch (function resolve () {
					d.resolve ();
				});

				return d.promise;
			},

			/**
			 * Retrieves a user account by id and sends to account page if email is invalid
			 * @function client.<%= appSlug %>.accountFactory#get
			 * @public
			 * @param {String} id - user id
			 */
			get: function get (id) {
				_user = AccountRoute.get ({ userId: id }, function getUser (user) {
					if (user.username && !user.email) {
						$state.go ('account');
					}
				});
			},

			/**
			 * Searches user accounts
			 * @function client.<%= appSlug %>.accountFactory#query
			 * @public
			 * @param {Object} params - query parameters
			 * @param {Function} [handler] - response handler
			 * @returns {angular.$resource} resource that is resolved with the user account array
			 */
			query: function query (params, handler) {
				return AccountRoute.query (params, handler);
			},

			/**
			 * Resets the current user account
			 * @function client.<%= appSlug %>.accountFactory#reset
			 * @public
			 */
			reset: function reset () {
				if (_user.$cancelRequest) {
					_user.$cancelRequest ();
				}

				_user = new AccountRoute ();
			},

			/**
			 * Creates a new user account
			 * @function client.<%= appSlug %>.accountFactory#create
			 * @public
			 * @param {Object} user - user information for account creation
			 * @returns {Promise} a promise that is resolved when the account is created
			 */
			create: function create (user) {
				return AccountRoute.save (user).$promise;
			},

			/**
			 * Sends a new account validation email
			 * @function client.<%= appSlug %>.accountFactory#resendValidation
			 * @public
			 * @returns {Promise} a promise that is resolved when the email has been sent
			 */
			resendValidation: function resendValidation () {
				return $http.post ('account/validate');
			}
		};
	});
} ());
