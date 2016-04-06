(function uptimeFilterTests () {
	'use strict';

	describe ('uptime filter', function uptimeFilter () {
		beforeEach (function beforeEach () {
			inject (function inject ($filter) {
				this.$filter = $filter;
			});
		});

		it ('should report years', function reportYears () {
			expect (this.$filter ('uptime') (60 * 60 * 24 * 365, 'seconds')).toEqual ('a year');
		});

		it ('should report months', function reportMonths () {
			expect (this.$filter ('uptime') (60 * 60 * 24 * 30, 'seconds')).toEqual ('a month');
		});

		it ('should report days', function reportDays () {
			expect (this.$filter ('uptime') (60 * 60 * 24, 'seconds')).toEqual ('a day');
		});

		it ('should report hours', function reportHours () {
			expect (this.$filter ('uptime') (1000 * 60 * 60)).toEqual ('an hour');
		});

		it ('should report minutes', function reportMinutes () {
			expect (this.$filter ('uptime') (1000 * 60)).toEqual ('a minute');
		});

		it ('should report seconds', function reportSeconds () {
			expect (this.$filter ('uptime') (1000 * 1)).toEqual ('a few seconds');
		});
	});
} ());
