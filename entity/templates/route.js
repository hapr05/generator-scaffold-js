'use strict';

const joi = require ('joi'),
	boom = require ('boom'),
	entityModel = require ('../models/<%= entity.collectionName %>'),
	replyEntity = (mongo, collection, id, reply, notFound) => {
		collection.findOne ({
			_id: new mongo.ObjectID (id)
		}).then (entity => {
			if (entity) {
				reply (entity).code (200);
			} else {
				reply (notFound);
			}
		}).catch (() => {
			reply (boom.badImplementation ());
		});
	};

module.exports = [{
	method: 'GET',
	path: '/<%= entity.collectionName %>/{_id}',
	config: {
		description: 'Retrieve single <%= entity.collectionName %>',
		notes: 'Returns a <%= entity.collectionName %> by id.',
		tags: [ 'api', '<%= entity.collectionName %>' ],
		validate: {
			params: entityModel.retrieve
		},
		plugins: {
			'hapi-swaggered': {
				responses: {
					200: {
						description: 'Success',
						schema: entityModel.<%= entity.collectionName %>
					},
					400: { description: 'Bad Request' },
					403: { description: 'Forbidden' },
					404: { description: 'Not Found' },
					500: { description: 'Internal Server Error' }
				}
			}
		},
		handler (request, reply) {
			const mongo = request.server.plugins ['hapi-mongodb'],
				collection = mongo.db.collection ('<%= entity.collectionName %>');

			replyEntity (mongo, collection, request.params._id, reply, boom.notFound ());
		}
	}
}, {
	method: 'GET',
	path: '/<%= entity.collectionName %>/',
	config: {
		description: 'Search <%= entity.collectionName %>',
		notes: 'Searches for <%= entity.collectionName %> by fields.',
		tags: [ 'api', '<%= entity.collectionName %>' ],
		validate: {
			query: entityModel.search
		},
		plugins: {
			'hapi-swaggered': {
				responses: {
					200: {
						description: 'Success',
						schema: joi.array ().items (entityModel.<%= entity.collectionName %>).meta ({ className: '<%= entity.collectionName %>List' })
					},
					400: { description: 'Bad Request' },
					404: { description: 'Not Found' },
					500: { description: 'Internal Server Error' }
				}
			}
		},
		handler (request, reply) {
			const collection = request.server.plugins ['hapi-mongodb'].db.collection ('<%= entity.collectionName %>');

			request.server.methods.search (collection, request.query, [<% entity.fields.forEach ((field, index) => { %> '<%= field.name %>'<% if (index !== (entity.fields.length - 1)) { %>,<% }}); %> ]).then (result => {
				reply (result.values).code (200).header ('X-Total-Count', result.count);
			}).catch (() => {
				reply (boom.badImplementation ());
			});
		}
	}
}, {
	method: 'POST',
	path: '/<%= entity.collectionName %>/',
	config: {
		auth: false,
		description: 'Create <%= entity.collectionName %>',
		notes: 'Creates a new <%= entity.collectionName %>.',
		tags: [ 'api', '<%= entity.collectionName %>' ],
		validate: {
			payload: entityModel.<%= entity.collectionName %>
		},
		plugins: {
			'hapi-swaggered': {
				responses: {
					200: {
						description: 'Success',
						schema: entityModel.<%= entity.collectionName %>
					},
					400: { description: 'Bad Request' },
					500: { description: 'Internal Server Error' }
				}
			}
		},
		handler (request, reply) {
			const mongo = request.server.plugins ['hapi-mongodb'],
				collection = mongo.db.collection ('<%= entity.collectionName %>');

			collection.insertOne (Object.assign ({
				created: new Date (),
				modified: new Date ()
			}, request.server.methods.filter (request.payload, [<% entity.fields.forEach ((field, index) => { %> '<%= field.name %>'<% if (index !== (entity.fields.length - 1)) { %>,<% }}); %> ]))).then (res => {
				replyEntity (mongo, collection, res.insertedId, reply, boom.badImplementation ());
			}).catch (() => {
				reply (boom.badImplementation ());
			});
		}
	}
}, {
	method: 'POST',
	path: '/<%= entity.collectionName %>/{_id}',
	config: {
		description: 'Update <%= entity.collectionName %>',
		notes: 'Updates an existing <%= entity.collectionName %>',
		tags: [ 'api', '<%= entity.collectionName %>' ],
		validate: {
			params: entityModel.retrieve,
			payload: entityModel.update
		},
		plugins: {
			'hapi-swaggered': {
				responses: {
					200: {
						description: 'Success',
						schema: entityModel.<%= entity.collectionName %>
					},
					400: { description: 'Bad Request' },
					403: { description: 'Forbidden' },
					404: { description: 'Not Found' },
					500: { description: 'Internal Server Error' }
				}
			}
		},
		handler (request, reply) {
			const mongo = request.server.plugins ['hapi-mongodb'],
				collection = mongo.db.collection ('<%= entity.collectionName %>'),
				keys = [<% entity.fields.forEach ((field, index) => { %> '<%= field.name %>'<% if (index !== (entity.fields.length - 1)) { %>,<% }}); %> ],
				update = request.server.methods.filter (request.payload, keys);

			update.modified = new Date ();
			collection.updateOne ({
				_id: new mongo.ObjectID (request.params._id)
			}, { $set: update }).then (() => {
				replyEntity (mongo, collection, request.params._id, reply, boom.badImplementation ());
			}).catch (() => {
				reply (boom.badImplementation ());
			});
		}
	}
}, {
	method: 'DELETE',
	path: '/<%= entity.collectionName %>/{_id}',
	config: {
		description: 'Delete <%= entity.collectionName %>',
		notes: 'Deletes an existing <%= entity.collectionName %>',
		tags: [ 'api', '<%= entity.collectionName %>' ],
		validate: {
			params: entityModel.retrieve
		},
		plugins: {
			'hapi-swaggered': {
				responses: {
					200: { description: 'Success' },
					403: { description: 'Forbidden' },
					404: { description: 'Not Found' },
					500: { description: 'Internal Server Error' }
				}
			}
		},
		handler (request, reply) {
			const mongo = request.server.plugins ['hapi-mongodb'],
				collection = mongo.db.collection ('<%= entity.collectionName %>');

			collection.deleteOne ({
				_id: new mongo.ObjectID (request.params._id)
			}).then (() => {
				reply ().code (200);
			}).catch (() => {
				reply (boom.badImplementation ());
			});
		}
	}
}];
