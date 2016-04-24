(function <%= entity.collectionName %>Component () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('<%= entity.collectionName %>', {
		templateUrl: 'app/components/<%= entity.collectionName %>/<%= entity.collectionName %>.view.html',
		controller: function controller ($scope, $state, $resource) {
			var Entity = $resource ('<%= entity.collectionName %>/:_id', { _id: '@_id' });

			angular.extend ($scope, {
				disable: false,
				page: 0,
				limit: 20,
				sortDir: 'asc',
				total: 0,
				createFailure: false,
				updateFailure: false,
				updateSuccess: false,
				editIndex: false,
				editEntity: false,
				entities: [],
				filter: {
				},<% entity.fields.forEach (function (field) { if ('Date' === field.type) { %>

				<%= field.name %>Open: false,
				<%= field.name %>Options: {<% if (field.min) { %>
					minDate: moment ('<%= field.min %>', 'MM-DD-YYYY').toDate ()<% if (field.max) %>,<% } if (field.max) { %>
					maxDate: moment ('<%= field.max %>', 'MM-DD-YYYY').toDate ()<% } %>
				},<% }}); %>

				sort: function sort (by) {
					if (by === $scope.sortBy) {
						$scope.sortDir = 'asc' === $scope.sortDir ? 'desc' : 'asc';
					} else {
						$scope.sortBy = by;
						$scope.sortDir = 'asc';
					}

					$scope.search ();
				},

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

				create: function create () {
					$scope.createEntity = new Entity ();
				},

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

				cancel: function cancel () {
					$scope.disable = false;
					$scope.createFailure = false;
					$scope.createEntity = false;
				},

				edit: function edit (index) {
					$scope.editIndex = index;
					$scope.editEntity = angular.copy ($scope.entities [index]);<% entity.fields.forEach (field => { if ('Date' === field.type) { %>
					$scope.editEntity.<%= field.name %> = moment ($scope.editEntity.<%= field.name %>).toDate ();<% }}); %>
				},

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

				remove: function update () {
					$scope.disable = true;
					$scope.editEntity.$delete ().then (function updateSuccessHandler () {
						$scope.entities.splice ($scope.editIndex, 1);
						$scope.updateFailure = $scope.updateSuccess = $scope.editIndex = $scope.editEntity = false;
					});
				},

				back: function back () {
					$scope.updateFailure = $scope.updateSuccess = $scope.editIndex = $scope.editEntity = false;
				}
			});

			$scope.search ();
		}
	}).config (function setupState ($stateProvider) {
		$stateProvider.state ('<%= entity.collectionName %>', {
			url: '/<%= entity.collectionName %>',
			template: '<<%= entity.collectionName %>></<%= entity.collectionName %>>',
			data: {
				authenticated: true
			}
		});
	});
} ());
