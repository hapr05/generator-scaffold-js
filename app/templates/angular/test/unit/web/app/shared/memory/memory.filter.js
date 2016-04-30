(function memoryFilterTests () {
	'use strict';

	describe ('memory filter', function memoryFilter () {
		beforeEach (function beforeEach () {
			inject (function inject ($filter) {
				this.$filter = $filter;
			});
		});

		it ('should report bytes', function reportBytes () {
			expect (this.$filter ('memory') (1)).toEqual ('1 B');
		});

		it ('should report kilobytes', function reportKilobytes () {
			expect (this.$filter ('memory') (1024)).toEqual ('1 KB');
		});

		it ('should report megabytes', function reportMegabytes () {
			expect (this.$filter ('memory') (1024 * 1024)).toEqual ('1 MB');
		});

		it ('should report gigabytes', function reportGigabytes () {
			expect (this.$filter ('memory') (1024 * 1024 * 1024)).toEqual ('1 GB');
		});

		it ('should report terabytes', function reportTerabytes () {
			expect (this.$filter ('memory') (1024 * 1024 * 1024 * 1024)).toEqual ('1 TB');
		});
	});
} ());
