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
			var long = '',
				i;

			for (i = 0; i < 215; i++) {
				long = `${ long }a`;
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

	describe ('collectionName', () => {
		it ('should validate non-emty string', () => {
			expect (validators.collectionName ('test')).to.be.true ();
		});

		it ('should fail emty string', () => {
			expect (validators.collectionName ('')).to.equal ('Collection Name is required.');
		});

		it ('should fail non alpha', () => {
			expect (validators.collectionName (' ')).to.equal ('Collection Name cannot contain non alpha characters.');
		});
	});

	describe ('fieldName', () => {
		it ('should validate non-emty string', () => {
			expect (validators.fieldName ('test')).to.be.true ();
		});

		it ('should validate emty string', () => {
			expect (validators.fieldName ('')).to.be.true ();
		});

		it ('should fail non alpha', () => {
			expect (validators.fieldName (' ')).to.equal ('Field Name cannot contain non alpha characters.');
		});
	});

	describe ('number', () => {
		it ('should validate number', () => {
			expect (validators.number ('1.1')).to.be.true ();
		});

		it ('should validate emty string', () => {
			expect (validators.number ('')).to.be.true ();
		});

		it ('should fail non number', () => {
			expect (validators.number ('test')).to.equal ('Invalid number.');
		});
	});

	describe ('integer', () => {
		it ('should validate integer', () => {
			expect (validators.integer ('1')).to.be.true ();
		});

		it ('should validate emty string', () => {
			expect (validators.integer('')).to.be.true ();
		});

		it ('should fail non integer', () => {
			expect (validators.integer ('test')).to.equal ('Must be an integer.');
		});
	});

	describe ('date', () => {
		it ('should validate date', () => {
			expect (validators.date ('1-1-2016')).to.be.true ();
		});

		it ('should validate emty string', () => {
			expect (validators.date ('')).to.be.true ();
		});

		it ('should fail non date', () => {
			expect (validators.date ('test')).to.equal ('Invalid date.');
		});
	});
});
