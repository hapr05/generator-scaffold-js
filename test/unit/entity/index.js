'use strict';

const assert = require ('yeoman-assert'),
	chai = require ('chai'),
	dirtyChai = require ('dirty-chai'),
	chaiAsPromised = require ('chai-as-promised'),
	expect = chai.expect,
	helpers = require ('yeoman-test'),
	mockery = require ('mockery'),
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
	before (() => {
		mockery.enable ({
			warnOnReplace: false,
			warnOnUnregistered: false,
			useCleanCache: true
		});

		mockery.registerMock ('../util/editors', {
			appendHtml: () => true,
			appendJSON: () => true
		});
	});

	after (() => {
		mockery.deregisterAll ();
		mockery.disable ();
	});

	describe ('boolean', () => {
		beforeEach (done => {
			helpers.run (path.join (__dirname, '../../../entity')).withArguments ([ '--skip-install' ]).withPrompts ({
				collectionName: 'test',
				name0: 'test',
				type0: 'Boolean'
			}).withLocalConfig ({
				cfgName: 'test'
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
				name1: 'test',
				type0: 'Date',
				type1: 'Date',
				required0: true,
				required1: true,
				min0: '01-01-2014',
				max0: '01-01-2015'
			}).withLocalConfig ({
				cfgName: 'test'
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

	describe ('number', () => {
		beforeEach (done => {
			helpers.run (path.join (__dirname, '../../../entity')).withArguments ([ '--skip-install' ]).withPrompts ({
				collectionName: 'test',
				name0: 'test',
				name1: 'test',
				type0: 'Number',
				type1: 'Number',
				required0: true,
				required1: true,
				integer0: false,
				integer1: true,
				min0: 1,
				max0: 5
			}).withLocalConfig ({
				cfgName: 'test'
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

	describe ('string', () => {
		beforeEach (done => {
			helpers.run (path.join (__dirname, '../../../entity')).withArguments ([ '--skip-install' ]).withPrompts ({
				collectionName: 'test',
				name0: 'test',
				name1: 'test',
				type0: 'String',
				type1: 'String',
				required0: true,
				required1: true,
				min0: 1,
				max0: 5
			}).withLocalConfig ({
				cfgName: 'test'
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
