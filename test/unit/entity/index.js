'use strict';

const assert = require ('yeoman-assert'),
	chai = require ('chai'),
	dirtyChai = require ('dirty-chai'),
	chaiAsPromised = require ('chai-as-promised'),
	expect = chai.expect,
	helpers = require ('yeoman-test'),
	path = require ('path');

chai.use (chaiAsPromised);
chai.use (dirtyChai);
chai.use ((_chai, utils) => {
	/* eslint-disable no-invalid-this */
	_chai.Assertion.addMethod ('existOnFs', function existOnFS () {
		var obj = utils.flag (this, 'object');

		assert.file (obj);
	});

	_chai.Assertion.addMethod ('content', function content (str) { // jscs:ignore requireArrowFunctions
		var obj = utils.flag (this, 'object');

		assert.fileContent (obj, str);
	});
	/* eslint-enable no-invalid-this */
});

describe ('scaffold-js:entity', () => {
	describe ('boolean', () => {
		beforeEach (done => {
			helpers.run (path.join (__dirname, '../../../entity')).withArguments ([ '--skip-install' ]).withPrompts ({
				collectionName: 'test',
				name0: 'test',
				type: 'Boolean',
				required: true
			}).on ('end', done);
		});

		it ('should generate files', () => {
			var files = [
				'src/server/models/test.js',
				'src/server/routes/test.js',
				'test/unit/server/routes/test.js'
			];

			files.forEach (i => {
				expect (i).to.exist ();
			});
		});
	});

	describe ('date', () => {
		beforeEach (done => {
			helpers.run (path.join (__dirname, '../../../entity')).withArguments ([ '--skip-install' ]).withPrompts ({
				collectionName: 'test',
				name0: 'test',
				type: 'Date',
				required: true,
				timestamp: 'No',
				format: 'short',
				min: '01-01-2014',
				max: '01-01-2015'
			}).on ('end', done);
		});

		it ('should generate files', () => {
			var files = [
				'src/server/models/test.js',
				'src/server/routes/test.js',
				'test/unit/server/routes/test.js'
			];

			files.forEach (i => {
				expect (i).to.exist ();
			});
		});
	});

	describe ('date', () => {
		beforeEach (done => {
			helpers.run (path.join (__dirname, '../../../entity')).withArguments ([ '--skip-install' ]).withPrompts ({
				collectionName: 'test',
				name0: 'test',
				type: 'Number'
			}).on ('end', done);
		});

		it ('should generate files', () => {
			var files = [
				'src/server/models/test.js',
				'src/server/routes/test.js',
				'test/unit/server/routes/test.js'
			];

			files.forEach (i => {
				expect (i).to.exist ();
			});
		});
	});
});
