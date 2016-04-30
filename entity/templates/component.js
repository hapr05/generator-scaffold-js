/**
 * <%= entity.collectionName %> management
 * @class client.<%= appSlug %>.<%= entity.collectionCamel %>Component
 */
(function <%= entity.collectionCamel %>Component () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('<%= entity.collectionCamel %>', {
		templateUrl: 'app/components/<%= entity.collectionSlug %>/<%= entity.collectionSlug %>.view.html',
		controller: function controller ($scope, $state, $resource) {
			var Entity = $resource ('<%= entity.collectionSlug %>/:_id', { _id: '@_id' });

			angular.extend ($scope, {
				/**
				 * Disables the form
				 * @member client.<%= appSlug %>.<%= entity.collectionCamel %>Component#disable
				 */
				disable: false,
				/**
				 * Current data table page
				 * @member client.<%= appSlug %>.<%= entity.collectionCamel %>Component#page
				 */
				page: 0,
				/**
				 * Number of items to show per page
				 * @member client.<%= appSlug %>.<%= entity.collectionCamel %>Component#limit
				 */
				limit: 20,
				/**
				 * Sort column
				 * @member client.<%= appSlug %>.<%= entity.collectionCamel %>Component#sortBy
				 */
				/**
				 * Sort direction
				 * @member client.<%= appSlug %>.<%= entity.collectionCamel %>Component#sortDir
				 */
				sortDir: 'asc',
				/**
				 * Total number of items
				 * @member client.<%= appSlug %>.<%= entity.collectionCamel %>Component#total
				 */
				total: 0,
				/**
				 * Indicates a create failure
				 * @member client.<%= appSlug %>.<%= entity.collectionCamel %>Component#updateFailure
				 */
				createFailure: false,
				/**
				 * Indicates an update failure
				 * @member client.<%= appSlug %>.<%= entity.collectionCamel %>Component#updateFailure
				 */
				updateFailure: false,
				/**
				 * Indicates an update success
				 * @member client.<%= appSlug %>.<%= entity.collectionCamel %>Component#updateSuccess
				 */
				updateSuccess: false,
				/**
				 * Current <%= entity.collectionName %> being edited
				 * @member client.<%= appSlug %>.<%= entity.collectionCamel %>Component#editIndex
				 */
				editIndex: false,
				/**
				 * Current <%= entity.collectionName %> being edited
				 * @member client.<%= appSlug %>.<%= entity.collectionCamel %>Component#editEntity
				 */
				editEntity: false,
				/**
				 * <%= entity.collectionName %> list
				 * @member client.<%= appSlug %>.<%= entity.collectionCamel %>Component#entities
				 */
				entities: [],

				/**
				 * <%= entity.collectionName %> filter params
				 * @member client.<%= appSlug %>.<%= entity.collectionCamel %>Component#filter
				 */
				filter: {
				},<% entity.fields.forEach (function (field) { if ('Date' === field.type) { %>

				<%= field.camel %>Open: false,
				<%= field.camel %>Options: {<% if (field.min) { %>
					minDate: moment ('<%= field.min %>', 'MM-DD-YYYY').toDate ()<% if (field.max) %>,<% } if (field.max) { %>
					maxDate: moment ('<%= field.max %>', 'MM-DD-YYYY').toDate ()<% } %>
				},<% }}); %>

				/**
				 * Sorts the data table
				 * @function client.<%= appSlug %>.<%= entity.collectionCamel %>Component#sort
				 * @public
				 * @param {String} by - column to sort by
				 */
				sort: function sort (by) {
					if (by === $scope.sortBy) {
						$scope.sortDir = 'asc' === $scope.sortDir ? 'desc' : 'asc';
					} else {
						$scope.sortBy = by;
						$scope.sortDir = 'asc';
					}

					$scope.search ();
				},

				/**
				 * Searches for a <%= entity.collectionName %>
				 * @function client.<%= appSlug %>.<%= entity.collectionCamel %>Component#serch
				 * @public
				 */
				search: function search () {
					$scope.start = 0;

					$scope.entities = Entity.query (angular.extend ({
						start: $scope.page * $scope.limit,
						limit: $scope.limit,
						sortBy: $scope.sortBy,
						sortDir: $scope.sortDir
					}, $scope.page, $scope.filter), function getTotal (data, headers) {
						$scope.total = headers ('X-Total-Count');
					});
				},

				/**
				 * Opens create a <%= entity.collectionName %> form
				 * @function client.<%= appSlug %>.<%= entity.collectionCamel %>Component#create
				 * @public
				 */
				create: function create () {
					$scope.createEntity = new Entity ();
				},

				/**
				 * Saves a new <%= entity.collectionName %>
				 * @function client.<%= appSlug %>.<%= entity.collectionCamel %>Component#save
				 * @public
				 * @param {Event} event - form submit event
				 */
				save: function save (event) {
					$scope.disable = true;
					event.preventDefault ();
					$scope.createEntity.$save ().then (function saveSuccessHandler () {
						$scope.disable = false;
						$scope.createFailure = false;
						$scope.createEntity = false;
					}).catch (function updateFailureHandler () {
						$scope.disable = false;
						$scope.createFailure = true;
					});
				},

				/**
				 * Cancels <%= entity.collectionName %> creation
				 * @function client.<%= appSlug %>.<%= entity.collectionCamel %>Component#cancel
				 * @public
				 */
				cancel: function cancel () {
					$scope.disable = false;
					$scope.createFailure = false;
					$scope.createEntity = false;
				},

				/**
				 * Edits a <%= entity.collectionName %>
				 * @function client.<%= appSlug %>.<%= entity.collectionCamel %>Component#edit
				 * @public
				 * @param {Number} index - index of <%= entity.collectionName %> to edit
				 */
				edit: function edit (index) {
					$scope.editIndex = index;
					$scope.editEntity = angular.copy ($scope.entities [index]);<% entity.fields.forEach (field => { if ('Date' === field.type) { %>
					$scope.editEntity.<%= field.camel %> = moment ($scope.editEntity.<%= field.camel %>).toDate ();<% }}); %>
				},

				/**
				 * Updates <%= entity.collectionNamei %> being edited
				 * @function client.<%= appSlug %>.<%= entity.collectionCamel %>Component#update
				 * @public
				 * @param {Event} event - form submit event
				 */
				update: function update (event) {
					$scope.disable = true;
					delete $scope.editEntity.created;
					delete $scope.editEntity.modified;
					event.preventDefault ();
					$scope.editEntity.$save ().then (function updateSuccessHandler () {
						$scope.disable = false;
						$scope.updateFailure = false;
						$scope.updateSuccess = true;
						$scope.entities [$scope.editIndex] = angular.copy ($scope.editEntity);
					}).catch (function updateFailureHandler () {
						$scope.disable = false;
						$scope.updateFailure = true;
						$scope.updateSuccess = false;
					});
				},

				/**
				 * Deletes a <%= entity.collectionName %>
				 * @function client.<%= appSlug %>.<%= entity.collectionCamel %>Component#remove
				 * @public
				 */
				remove: function remove () {
					$scope.disable = true;
					$scope.editEntity.$delete ().then (function updateSuccessHandler () {
						$scope.entities.splice ($scope.editIndex, 1);
						$scope.updateFailure = $scope.updateSuccess = $scope.editIndex = $scope.editEntity = false;
					});
				},

				/**
				 * Returns to data view
				 * @function client.<%= appSlug %>.<%= entity.collectionCamel %>Component#back
				 * @public
				 */
				back: function back () {
					$scope.updateFailure = $scope.updateSuccess = $scope.editIndex = $scope.editEntity = false;
				}
			});

			$scope.search ();
		}
	}).config (function setupState ($stateProvider) {
		$stateProvider.state ('<%= entity.collectionSlug %>', {
			url: '/<%= entity.collectionSlug %>',
			template: '<<%= entity.collectionSlug %>></<%= entity.collectionSlug %>>',
			data: {
				authenticated: true
			}
		});
	});
} ());
