'use strict';

const joi = require ('joi');

module.exports = {
	retrieve: joi.object ({
		id: joi.string ().token ().description ('User Id')
	}).required (),

	query: joi.object ({
		sortBy: joi.string ().valid ([ 'id', 'username', 'fullName', 'nickname', 'email', 'created', 'modified', 'active' ]).optional ().description ('Sort Column'),
		sortDir: joi.string ().valid ([ 'asc', 'desc' ]).optional ().description ('Sort Direction'),
		start: joi.number ().integer ().optional ().description ('Start Record Index'),
		limit: joi.number ().integer ().optional ().description ('Maxmimum Number of Records to Return'),
		username: joi.string ().optional ().description ('Username'),
		email: joi.string ().email ().optional ().description ('Email Address')
	}).optional (),

	create: joi.object ({
		username: joi.string ().required ().description ('Username'),
		password: joi.string ().regex (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$/, 'strong').min (8).required ().description ('Password'),
		fullName: joi.string ().required ().description ('Full Name'),
		nickname: joi.string ().required ().description ('Nickname'),
		email: joi.string ().email ().required ().description ('Email Address')
	}).required ().meta ({ className: 'CreateUser' }),

	update: joi.object ({
		id: joi.string ().token ().description ('User Id'),
		password: joi.string ().regex (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$/, 'strong').min (8).optional ().description ('Password'),
		fullName: joi.string ().optional ().description ('Full Name'),
		nickname: joi.string ().optional ().description ('Nickname'),
		email: joi.string ().email ().optional ().description ('Email Address'),
		active: joi.boolean ().optional ().description ('Active Flag'),
		scope: joi.array ().items (joi.string ()).optional ().description ('User Roles')
	}).required ().meta ({ className: 'UpdateUser' }),

	authenticate: joi.object ({
		username: joi.string ().required ().description ('Username'),
		password: joi.string ().required ().description ('Password'),
		rememberMe: joi.boolean ().optional ().description ('Remember Me')
	}).required ().meta ({ className: 'AuthenticateUser' }),

	forgot: joi.object ({
		email: joi.string ().email ().optional ().description ('Email Address'),
		token: joi.string ().optional ().description ('Token'),
		password: joi.string ().regex (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$/, 'strong').min (8).optional ().description ('Password')
	}).required (),

	account: joi.object ({
		id: joi.string ().token ().required ().description ('Id'),
		username: joi.string ().required ().description ('Username'),
		fullName: joi.string ().required ().description ('Full Name'),
		nickname: joi.string ().required ().description ('Nickname'),
		email: joi.string ().email ().required ().description ('Email Address'),
		created: joi.date ().timestamp ().required ().description ('Created Date'),
		modified: joi.date ().timestamp ().required ().description ('Modified Date'),
		active: joi.boolean ().required ().description ('Account Active')
	}).required ().meta ({ className: 'Account' })
};
