'use strict';

const chai = require ('chai'),
	expect = chai.expect,
	dirtyChai = require ('dirty-chai'),
	chaiAsPromised = require ('chai-as-promised'),
	sinon = require ('sinon'),
	jwt = require ('../../../src/server/jwt');

chai.use (chaiAsPromised);
chai.use (dirtyChai);

describe ('jwt helpers', () => {
	var users = {
			findOne: () => Promise.resolve ({})
		},
		request = {
			info: {
				host: 'test'
			},
			server: {
				plugins: {
					'hapi-mongodb': {
						db: {
							collection: () => users
						}
					}
				}
			}
		},
		sandbox = sinon.sandbox.create ();

	afterEach (() => {
		sandbox.restore ();
	});

	it ('should validate valid token', () => {
		jwt.validate ({
			host: 'test',
			user: '56e321368fb6511021ff1f8b'
		}, request, (err, response) => {
			expect (err).to.be.null ();
			expect (response).to.be.true ();
		});
	});

	it ('should fail to validate if host does not match', () => {
		jwt.validate ({
			host: 'invalid',
			user: '56e321368fb6511021ff1f8b'
		}, request, (err, response) => {
			expect (err).to.be.null ();
			expect (response).to.be.false ();
		});
	});

	it ('should fail to validate if user not found', () => {
		sandbox.stub (users, 'findOne', () => Promise.resolve (null));

		jwt.validate ({
			host: 'test',
			user: '56e321368fb6511021ff1f8b'
		}, request, (err, response) => {
			expect (err).to.be.null ();
			expect (response).to.be.false ();
		});
	});

	it ('should fail to validate if db fails', () => {
		sandbox.stub (users, 'findOne', () => Promise.reject ('err'));

		jwt.validate ({
			host: 'test',
			user: '56e321368fb6511021ff1f8b'
		}, request, (err, response) => {
			expect (err).to.be.null ();
			expect (response).to.be.false ();
		});
	});
});
