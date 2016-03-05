(function () {
	'use strict';

	describe ('topnav component', function () {
		beforeEach (function () {
			inject (function ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('home', { $scope: this.scope });
			});
			
			this.$templateCache.put ('app/components/topnav/topnavView.html', '_topnav_component_content_');
		});

		it ('should load', function () {
			var el = this.$compile ("<topnav></topnav>") (this.$rootScope);
			this.$rootScope.$digest ();
			expect (el.html ()).toContain ('_topnav_component_content_');
		});
	});
} ());
