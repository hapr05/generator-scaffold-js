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
		describe ('name', () => {
			it ('should validate non-emty string', () => {
				expect (validators.name ('test')).to.be.true ();
			});

			it ('should fail emty string', () => {
				expect (validators.name ('')).to.equal ('Name is required.');
			});

			it ('should fail long string', () => {
				var long = '', i;

				for (i = 0; i < 215; i++) {
					long = long + 'a';
				}

				expect (validators.name (long)).to.equal ('Name must be less than or equal to 214 characters.');
			});

			it ('should fail non-string', () => {
				expect (validators.name (1)).to.equal ('Name is required.');
			});
		});

		describe ('dbUrl', () => {
			it ('should validate non-emty string', () => {
				expect (validators.dbUrl ('test')).to.be.true ();
			});

			it ('should fail emty string', () => {
				expect (validators.dbUrl ('')).to.equal ('Database Connection Url is required.');
			});

			it ('should fail non-string', () => {
				expect (validators.dbUrl (1)).to.equal ('Database Connection Url is required.');
			});
		});

		describe ('socialPassword', () => {
			it ('should validate non-emty string', () => {
				expect (validators.socialPassword ('01234567890123456789012345678901')).to.be.true ();
			});

			it ('should fail emty string', () => {
				expect (validators.socialPassword('')).to.equal ('Password is required.');
			});
 
			it ('should fail short string', () => {
				expect (validators.socialPassword ('test')).to.equal ('Password must be at least 32 characters.');
			});

			it ('should fail non-string', () => {
				expect (validators.socialPassword (1)).to.equal ('Password is required.');
			});
		});

		describe ('socialClientId', () => {
			it ('should validate non-emty string', () => {
				expect (validators.socialClientId ('test')).to.be.true ();
			});

			it ('should fail emty string', () => {
				expect (validators.socialClientId ('')).to.equal ('Client Id is required.');
			});

			it ('should fail non-string', () => {
				expect (validators.socialClientId (1)).to.equal ('Client Id is required.');
			});
		});

		describe ('socialClientSecret', () => {
			it ('should validate non-emty string', () => {
				expect (validators.socialClientSecret ('test')).to.be.true ();
			});

			it ('should fail emty string', () => {
				expect (validators.socialClientSecret ('')).to.equal ('Client Secret is required.');
			});

			it ('should fail non-string', () => {
				expect (validators.socialClientSecret (1)).to.equal ('Client Secret is required.');
			});
		});
	});
} ());
