'use strict';

const joi = require ('joi');

module.exports = {
	<%= entity.collectionName %>: joi.object ({<% entity.fields.forEach ((field, index) => { %>
		<%= field.name %>: joi<% if ('Boolean' === field.type) { %>.boolean ()<% } else if ('Date' === field.type) { %>.date ()<% if ('' !== field.min) { %>.min ('<%= field.min %>')<% } %><% if ('' !== field.max) { %>.min ('<%= field.max %>')<% } %><% if ('Yes (JavaScript)' === field.timestamp) { %>.timestamp ('javascript')<% } %><% if ('Yes (Unix)' === field.timestamp) { %>.timestamp ('unix')<% } %><% if (field.format) { %>.format ('<%= field.format %>')<% } %><% } else if ('Number' === field.type) { %>.number ()<% if ('' !== field.min) { %>.min (<%= field.min %>)<% } %><% if ('' !== field.max) { %>.min (<%= field.max %>)<% } %><% if (field.integer) { %>.integer ()<% } %><% } else if ('String' === field.type) { %>.string ()<% if ('' !== field.min) { %>.min (<%= field.min %>)<% } %><% if ('' !== field.max) { %>.min (<%= field.max %>)<% } %> <% } %><% if (field.required) { %>.required ()<% } %>.description ('<%= field.name %>')<% if (index !== (entity.fields.length - 1)) { %>,<% } %><% }); %>
	}).required ().meta ({ className: '<%= entity.collectionName %>' }),

	update: joi.object ({<% entity.fields.forEach ((field, index) => { %>
		<%= field.name %>: joi<% if ('Boolean' === field.type) { %>.boolean ()<% } else if ('Date' === field.type) { %>.date ()<% if ('' !== field.min) { %>.min ('<%= field.min %>')<% } %><% if ('' !== field.max) { %>.min ('<%= field.max %>')<% } %><% if ('Yes (JavaScript)' === field.timestamp) { %>.timestamp ('javascript')<% } %><% if ('Yes (Unix)' === field.timestamp) { %>.timestamp ('unix')<% } %><% if (field.format) { %>.format ('<%= field.format %>')<% } %><% } else if ('Number' === field.type) { %>.number ()<% if ('' !== field.min) { %>.min (<%= field.min %>)<% } %><% if ('' !== field.max) { %>.min (<%= field.max %>)<% } %><% if (field.integer) { %>.integer ()<% } %><% } else if ('String' === field.type) { %>.string ()<% if ('' !== field.min) { %>.min (<%= field.min %>)<% } %><% if ('' !== field.max) { %>.min (<%= field.max %>)<% } %> <% } %>.description ('<%= field.name %>')<% if (index !== (entity.fields.length - 1)) { %>,<% } %><% }); %>
	}).required ().meta ({ className: 'Update<%= entity.collectionName %>' }),

	retrieve: joi.object ({
		_id: joi.string ().token ().required ()
	}).required (),

	search: joi.object ({
		sortBy: joi.string ().valid ([ 'event', 'timestamp', 'host' ]).optional ().description ('Sort Column'),
		sortDir: joi.string ().valid ([ 'asc', 'desc' ]).optional ().description ('Sort Direction'),
		start: joi.number ().integer ().optional ().description ('Start Record Index'),
		limit: joi.number ().integer ().optional ().description ('Maxmimum Number of Records to Return')<% entity.fields.forEach (field => { %>,
		<%= field.name %>: joi<% if ('Boolean' === field.type) { %>.boolean ()<% } else if ('Date' === field.type) { %>.date ()<% if ('' !== field.min) { %>.min ('<%= field.min %>')<% } %><% if ('' !== field.max) { %>.min ('<%= field.max %>')<% } %><% if ('Yes (JavaScript)' === field.timestamp) { %>.timestamp ('javascript')<% } %><% if ('Yes (Unix)' === field.timestamp) { %>.timestamp ('unix')<% } %><% if ('' !== field.format) { %>.format('<%= field.format %>')<% } %><% } else if ('Number' === field.type) { %>.number ()<% if ('' !== field.min) { %>.min (<%= field.min %>)<% } %><% if ('' !== field.max) { %>.min (<%= field.max %>)<% } %><% if (field.integer) { %>.integer ()<% } %><% } else if ('String' === field.type) { %>.string ()<% if ('' !== field.min) { %>.min (<%= field.min %>)<% } %><% if ('' !== field.max) { %>.min (<%= field.max %>)<% } %> <% } %>.description ('<%= field.name %>')<% }); %>
	}).required ().meta ({ className: 'Search<%= entity.collectoinName %>' })
};
