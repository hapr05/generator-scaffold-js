(function (require) {
	'use strict';

	const assert = require ('assert'),
		validators = require ('../../util/validators');

	describe ('validators', () => {
		describe ('required', () => {
			it ('should validate non-emty string', () => {
				assert.strictEqual (validators.required ('test'), true);
			});

			it ('should fail emty string', () => {
				assert.strictEqual (validators.required (''), false);
			});

			it ('should fail non-string', () => {
				assert.strictEqual (validators.required (1), false);
			});
		});
	});
} (require));


