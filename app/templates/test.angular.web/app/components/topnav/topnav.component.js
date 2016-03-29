(function () {
	'use strict';

	describe ('topnav component', function () {
		beforeEach (function () {
			inject (function ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('topnav', { $scope: this.scope });
			});
			
			this.$templateCache.put ('app/components/topnav/topnav.view.html', '_topnav_component_content_');
		});

		it ('should load', function () {
			var el = this.$compile ("<topnav></topnav>") (this.$rootScope);
			this.$httpBackend.whenGET ('authenticate').respond (200);
			this.$rootScope.$digest ();
			expect (el.html ()).toContain ('_topnav_component_content_');
		});

		it ('should logout', function () {
			this.scope.logout ();
		});
	});
} ());
