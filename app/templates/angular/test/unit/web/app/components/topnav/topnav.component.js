(function topnavComponentTests () {
	'use strict';

	describe ('topnav component', function topnavComponent () {
		beforeEach (function beforeEach () {
			inject (function inject ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('topnav', { $scope: this.scope });
			});

			this.$templateCache.put ('app/components/topnav/topnav.view.html', '_topnav_component_content_');
		});

		it ('should load', function load () {
			var el = this.$compile ('<topnav></topnav>') (this.$rootScope);

			this.authenticate (200);
			this.$rootScope.$digest ();
			expect (el.html ()).toContain ('_topnav_component_content_');
		});

		it ('should logout', function logout () {
			this.scope.logout ();
		});
	});
} ());
