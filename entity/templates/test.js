'use strict';

const chai = require ('chai'),
	expect = chai.expect,
	dirtyChai = require ('dirty-chai'),
	chaiAsPromised = require ('chai-as-promised'),
	sinon = require ('sinon'),
	hapi = require ('hapi'),
	mocks = require ('../../helpers/mocks'),
	creds = require ('../../helpers/creds'),
	failed = require ('../../helpers/authFailed'),
	payload = {<% entity.fields.forEach ((field, index) => { %>
		<%= field.camel %>: <% if ('Boolean' === field.type) {
			%>true<%
		} else if ('Date' === field.type) {
			%><% if ('' !== field.min && undefined !== field.min) {
				%>'<%= moment (field.min, 'MM-DD-YYYY').format (); %>'<%
			} else if ('' !== field.max && undefined !== field.max) {
				%>'<%= moment (field.max, 'MM-DD-YYYY').format (); %>'<%
		   } else {
				%>'<%= moment ().format (); %>'<%
		   }
		} else if ('Number' === field.type) {
			if ('' !== field.min && undefined !== field.min) {
				%><%= field.min %><%
			} else if ('' !== field.max && undefined !== field.max) {
				%><%= field.max %><%
		   } else {
				%>1<%
		   }
		 } else {
			if ('' !== field.min && undefined !== field.min) {
				%>'<%= Array (parseInt (field.min, 10) + 1).join ('x') %>'<%
			} else if ('' !== field.max && undefined !== field.max) {
				%>'<%= Array (parseInt (field.max, 10) + 1).join ('x') %>'<%
		   } else {
				%>'test'<%
		   }
		}
		if (index !== (entity.fields.length - 1)) {
			%>,<%
		}}); %>
	};

chai.use (chaiAsPromised);
chai.use (dirtyChai);

describe ('<%= entity.collectionName %> route', () => {
	var server,
		<%= entity.collectionCamel %> = {
			find () {
				return {
					toArray () {
						return Promise.resolve ([ true ]);
					}
				};
			},
			findOne () {
				return Promise.resolve (true);
			},
			deleteOne () {
				return Promise.resolve (true);
			},
			insertOne () {
				return Promise.resolve (true);
			},
			updateOne () {
				return Promise.resolve (true);
			}
		},
		sandbox = sinon.sandbox.create ();

	before (() => {
		mocks.mongo ({ <%= entity.collectionCamel %> });
	});

	beforeEach (() => {
		server = new hapi.Server ();
		server.connection ();
		return expect (server.register ([ require ('hapi-mongodb'), require ('vision'), require ('hapi-accept-language'), failed ]).then (() => {
			require ('../../../../src/server/methods') (server);
			server.auth.strategy ('jwt', 'failed');
			server.route (require ('../../../../src/server/routes/<%= entity.collectionSlug %>'));
		})).to.be.fulfilled ();
	});

	afterEach (() => {
		sandbox.restore ();
	});

	after (() => {
		mocks.disable ();
	});

	describe ('item', () => {
		describe ('retrieve', () => {
			it ('should retrieve a <%= entity.collectionName %>', done => {
				server.inject ({ method: 'GET', url: '/<%= entity.collectionSlug %>/id', credentials: creds.user }).then (response => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should fail if no <%= entity.collectionName %>', done => {
				sandbox.stub (<%= entity.collectionCamel %>, 'findOne', () => Promise.resolve (null));

				server.inject ({ method: 'GET', url: '/<%= entity.collectionSlug %>/id', credentials: creds.user }).then (response => {
					try {
						expect (response.statusCode).to.equal (404);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should fail on error', done => {
				sandbox.stub (<%= entity.collectionCamel %>, 'findOne', () => Promise.reject ('err'));

				server.inject ({ method: 'GET', url: '/<%= entity.collectionSlug %>/id', credentials: creds.user }).then (response => {
					try {
						expect (response.statusCode).to.equal (500);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});
		});

		describe ('update', () => {
			it ('should update a <%= entity.collectionName %>', done => {
				server.inject ({
					method: 'POST',
					url: '/<%= entity.collectionSlug %>/id',
					credentials: creds.user,
					payload
				}).then (response => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should fail update a <%= entity.collectionName %> if update fails', done => {
				sandbox.stub (<%= entity.collectionCamel %>, 'updateOne', () => Promise.reject ('err'));

				server.inject ({
					method: 'POST',
					url: '/<%= entity.collectionSlug %>/id',
					credentials: creds.user,
					payload
				}).then (response => {
					try {
						expect (response.statusCode).to.equal (500);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});
		});

		describe ('delete', () => {
			it ('should delete a <%= entity.collectionName %>', done => {
				server.inject ({
					method: 'DELETE',
					url: '/<%= entity.collectionSlug %>/id',
					credentials: creds.user
				}).then (response => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should fail <%= entity.collectionName %> if delete fails', done => {
				sandbox.stub (<%= entity.collectionCamel %>, 'deleteOne', () => Promise.reject ('err'));

				server.inject ({
					method: 'DELETE',
					url: '/<%= entity.collectionSlug %>/id',
					credentials: creds.user
				}).then (response => {
					try {
						expect (response.statusCode).to.equal (500);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});
		});
	});

	describe ('collection', () => {
		it ('should list <%= entity.collectionName %>', done => {
			sinon.stub (server.methods, 'search').returns (Promise.resolve ({
				count: 1,
				values: [{
					_id: 'test'
				}]
			}));
			server.inject ({ method: 'GET', url: '/<%= entity.collectionSlug %>/', credentials: creds.user }).then (response => {
				try {
					expect (response.statusCode).to.equal (200);
					done ();
				} catch (err) {
					done (err);
				}
			});
		});

		it ('should error on list failure', done => {
			sinon.stub (server.methods, 'search').returns (Promise.reject ('err'));
			server.inject ({ method: 'GET', url: '/<%= entity.collectionSlug %>/', credentials: creds.user }).then (response => {
				try {
					expect (response.statusCode).to.equal (500);
					done ();
				} catch (err) {
					done (err);
				}
			});
		});
	});

	describe ('collection', () => {
		it ('should create a <%= entity.collectionName %>', done => {
			server.inject ({
				method: 'POST',
				url: '/<%= entity.collectionSlug %>/',
				payload,
				credentials: creds.user
			}).then (response => {
				try {
					expect (response.statusCode).to.equal (200);
					done ();
				} catch (err) {
					done (err);
				}
			});
		});

		it ('should error on list failure', done => {
			sandbox.stub (<%= entity.collectionCamel %>, 'insertOne', () => Promise.reject ('err'));

			server.inject ({
				method: 'POST',
				url: '/<%= entity.collectionSlug %>/',
				payload,
				credentials: creds.user
			}).then (response => {
				try {
					expect (response.statusCode).to.equal (500);
					done ();
				} catch (err) {
					done (err);
				}
			});
		});
	});
});
