(function () {
	'use strict';

	const chai = require ('chai'),
		expect = chai.expect,
		dirtyChai = require ('dirty-chai'),
		chaiAsPromised = require ('chai-as-promised'),
		validators = require ('../../../util/validators');

	chai.use (chaiAsPromised);
	chai.use (dirtyChai);

	describe ('validators', () => {
		describe ('required', () => {
			it ('should validate non-emty string', () => {
				expect (validators.required ('test')).to.be.true ();
			});

			it ('should fail emty string', () => {
				expect (validators.required ('')).to.be.false ();
			});

			it ('should fail non-string', () => {
				expect (validators.required (1)).to.be.false ();
			});
		});
	});
} ());
