(function <%= entity.collectionCamel %>ComponentTests () {
	'use strict';

	describe ('<%= entity.collectionName %> component', function <%= entity.collectionCamel %>Component () {
		beforeEach (function beforeEach () {
			inject (function inject ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('<%= entity.collectionCamel %>', { $scope: this.scope });
			});

			inject (function inject (authFactory) {
				this.authFactory = authFactory;
			});

			this.<%= entity.collectionCamel %> = {
				_id: 'test'<% entity.fields.forEach (field => { %>,
				<%= field.camel %>: <% if ('Boolean' === field.type) {
					%>true<%
				} else if ('Date' === field.type) {
					%>'<%= moment ().format ('MM-DD-YYYY'); %>'<%
				} else if ('Number' === field.type) {
					%>1<%
				} else {
					%>'test'<%
			   }
			}); %>
			};
			this.$templateCache.put ('app/components/<%= entity.collectionSlug %>/<%= entity.collectionSlug %>.view.html', '_<%= entity.collectionSlug %>in_component_content_');
			this.$httpBackend.whenGET ('<%= entity.collectionSlug %>/?limit=20&sortDir=asc&start=0').respond (200, [ this.<%= entity.collectionCamel %> ]);
		});

		it ('should transition to <%= entity.collectionName %> state', function transitionToState () {
			this.authenticate (200);
			this.$state.go ('<%= entity.collectionSlug %>');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('<%= entity.collectionSlug %>');
		});

		it ('should fail to transition to <%= entity.collectionName %> if not authorized', function failToTransitionIfNotAuthorized () {
			this.authFactory.reset ();
			this.$state.go ('<%= entity.collectionSlug %>');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('login');
		});

		it ('should search <%= entity.collectionName %>', function search () {
			this.$httpBackend.expectGET ('<%= entity.collectionSlug %>/?limit=20&sortDir=asc&start=0').respond (200, []);
			this.scope.search ();
			this.$httpBackend.flush ();
		});

		it ('should sort <%= entity.collectionName %>', function sort () {<% entity.fields.forEach ((field, index) => { if (0 === index) { %>
			this.scope.sortBy = '<%= field.camel %>';
			this.$httpBackend.expectGET ('<%= entity.collectionSlug %>/?limit=20&sortBy=<%= field.camel %>&sortDir=desc&start=0').respond (200, []);
			this.scope.sort ('<%= field.camel %>');
			this.$httpBackend.flush ();
			this.$httpBackend.expectGET ('<%= entity.collectionSlug %>/?limit=20&sortBy=<%= field.camel %>&sortDir=asc&start=0').respond (200, []);
			this.scope.sort ('<%= field.camel %>');
			this.$httpBackend.flush ();<% } else if (1 === index) { %>
			this.$httpBackend.expectGET ('<%= entity.collectionSlug %>/?limit=20&sortBy=<%= field.camel %>&sortDir=asc&start=0').respond (200, []);
			this.scope.sort ('<%= field.camel %>');
			this.$httpBackend.flush ();<% } else { return false; }}); %>
		});

		describe ('create', function create () {
			it ('should create <%= entity.collectionName %>', function createEntity () {
				this.$httpBackend.flush ();
				this.scope.create ();
				expect (this.scope.createEntity).not.toBeFalsy ();
			});

			it ('should go cancel <%= entity.collectionName %>', function cancel () {
				this.scope.create ();
				expect (this.scope.createEntity).not.toBeFalsy ();
				this.scope.cancel ();
				expect (this.scope.createEntity).toBeFalsy ();
			});

			it ('should save ', function save () {
				this.scope.create ();
				this.$httpBackend.expectPOST ('<%= entity.collectionSlug %>/').respond (200, this.<%= entity.collectionCamel %>);
				this.scope.save ({
					preventDefault: function preventDefault () {}
				});
				this.$httpBackend.flush ();
				expect (this.scope.createEntity).toBeFalsy ();
			});

			it ('should handle save failure', function saveFail () {
				this.scope.create ();
				this.$httpBackend.expectPOST ('<%= entity.collectionSlug %>/').respond (500);
				this.scope.save ({
					preventDefault: function preventDefault () {}
				});
				this.$httpBackend.flush ();
				expect (this.scope.createFailure).toBeTruthy ();
			});
		});

		describe ('edit', function edit () {
			it ('should edit <%= entity.collectionName %>', function editEntity () {
				this.scope.search ();
				this.$httpBackend.flush ();
				this.scope.edit (0);
				expect (this.scope.editIndex).toBe (0);
			});

			it ('should go back <%= entity.collectionName %>', function back () {
				this.scope.search ();
				this.$httpBackend.flush ();
				this.scope.edit (0);
				expect (this.scope.editIndex).toBe (0);
				this.scope.back ();
				expect (this.scope.editIndex).toBe (false);
			});

			it ('should update', function update () {
				this.scope.search ();
				this.$httpBackend.flush ();
				this.scope.edit (0);
				this.$httpBackend.expectPOST ('<%= entity.collectionSlug %>/test').respond (200, this.<%= entity.collectionCamel %>);
				this.scope.update ({
					preventDefault: function preventDefault () {}
				});
				this.$httpBackend.flush ();
				expect (this.scope.updateSuccess).toBeTruthy ();
			});

			it ('should handle update failure', function updateFailure () {
				this.scope.search ();
				this.$httpBackend.flush ();
				this.scope.edit (0);
				this.$httpBackend.expectPOST ('<%= entity.collectionSlug %>/test').respond (400, this.<%= entity.collectionCamel %>);
				this.scope.update ({
					preventDefault: function preventDefault () {}
				});
				this.$httpBackend.flush ();
				expect (this.scope.updateSuccess).toBeFalsy ();
			});
		});

		describe ('remove', function edit () {
			it ('should remove z', function remove () {
				this.scope.search ();
				this.$httpBackend.flush ();
				this.scope.edit (0);
				this.$httpBackend.expectPOST ('<%= entity.collectionSlug %>/test').respond (200, this.<%= entity.collectionCamel %>);
				this.scope.update ({
					preventDefault: function preventDefault () {}
				});
				this.$httpBackend.flush ();
				this.$httpBackend.expectDELETE ('<%= entity.collectionSlug %>/test').respond (200);
				this.scope.remove ();
				this.$httpBackend.flush ();
				expect (this.scope.entities.length).toBe (0);
			});
		});
	});
} ());
