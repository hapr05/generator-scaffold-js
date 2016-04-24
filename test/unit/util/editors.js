'use strict';

const chai = require ('chai'),
	dirtyChai = require ('dirty-chai'),
	expect = chai.expect,
	sinon = require ('sinon'),
	editors = require ('../../../util/editors'),
	write = sinon.spy ();

chai.use (dirtyChai);

describe ('editors', () => {
	afterEach (() => {
		write.reset ();
	});

	it ('should append html', () => {
		expect (() => {
			editors.appendHtml ({
				fs: {
					read () {
						return 'test\n/test';
					},
					write
				}
			}, 'test', 'test', '/test', 'insert');
		}).to.not.throw (Error);
		expect (write.calledWith ('test', 'test\ninsert\n/test')).to.be.true ();
	});

	it ('should not reappend html', () => {
		expect (() => {
			editors.appendHtml ({
				fs: {
					read () {
						return 'test\ninsert\n/test';
					},
					write
				}
			}, 'test', 'test', '/test', 'insert');
		}).to.not.throw (Error);
		expect (write.called).to.be.false ();
	});

	it ('should add a line if needed', () => {
		expect (() => {
			editors.appendHtml ({
				fs: {
					read () {
						return 'test\ninsert\n/test';
					},
					write
				}
			}, 'test', 'test', '/test', 'bar');
		}).to.not.throw (Error);
		expect (write.calledWith ('test', 'test\ninsert\n\nbar\n/test')).to.be.true ();
	});

	it ('should fail to append html if needle not found', () => {
		expect (() => {
			editors.appendHtml ({
				fs: {
					read () {
						return 'test\n/test';
					},
					write
				}
			}, 'test', 'foo', 'bar', 'insert');
		}).to.throw (Error);
		expect (write.called).to.be.false ();
	});

	it ('should append json', () => {
		expect (() => {
			editors.appendJSON ({
				fs: {
					read () {
						return '{ "a": "b" }';
					},
					write
				}
			}, 'test', {});
		}).to.not.throw (Error);
		expect (write.calledWith ('test', '{\n\t"a": "b"\n}')).to.be.true ();
	});
});
