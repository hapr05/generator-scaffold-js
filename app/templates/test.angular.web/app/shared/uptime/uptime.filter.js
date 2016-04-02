(function () {
	'use strict';

	describe ('uptime filter', function () {
		beforeEach (function () {
			inject (function ($filter) {
				this.$filter = $filter;
			});
		});
	
		it ('should report years', function () {
			expect (this.$filter ('uptime') (60 * 60 * 24 * 365, 'seconds')).toEqual ('a year');
		});
	
		it ('should report months', function () {
			expect (this.$filter ('uptime') (60 * 60 * 24 * 30, 'seconds')).toEqual ('a month');
		});
	
		it ('should report days', function () {
			expect (this.$filter ('uptime') (60 * 60 * 24, 'seconds')).toEqual ('a day');
		});
	
		it ('should report hours', function () {
			expect (this.$filter ('uptime') (1000 * 60 * 60)).toEqual ('an hour');
		});
	
		it ('should report minutes', function () {
			expect (this.$filter ('uptime') (1000 * 60)).toEqual ('a minute');
		});
	
		it ('should report seconds', function () {
			expect (this.$filter ('uptime') (1000 * 1)).toEqual ('a few seconds');
		});
	});
} ());
