(function () {
	'use strict';

	describe ('memory filter', function () {
		beforeEach (function () {
			inject (function ($filter) {
				this.$filter = $filter;
			});
		});
	
		it ('should report bytes', function () {
			expect (this.$filter ('memory') (1)).toEqual ('1 B');
		});
	
		it ('should report kilobytes', function () {
			expect (this.$filter ('memory') (1024)).toEqual ('1 KB');
		});
	
		it ('should report megabytes', function () {
			expect (this.$filter ('memory') (1024 * 1024)).toEqual ('1 MB');
		});
	
		it ('should report gigabytes', function () {
			expect (this.$filter ('memory') (1024 * 1024 * 1024)).toEqual ('1 GB');
		});
	
		it ('should report terabytes', function () {
			expect (this.$filter ('memory') (1024 * 1024 * 1024 * 1024)).toEqual ('1 TB');
		});
	});
} ());
