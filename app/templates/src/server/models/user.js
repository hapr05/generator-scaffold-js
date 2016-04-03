(function () {
	'use strict';

	const joi = require ('joi');

	module.exports = {
		retrieve: joi.object ({
			username: joi.string ().required ().description ('Username or Email Address')
		}).required (),

		search: joi.object ({
			//TODO other fields
			email: joi.string ().email ().optional ().description ('Email Address')
		}).optional (),

		create: joi.object ({
			username: joi.string ().required ().description ('Username'),
			password: joi.string ().regex (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$/, 'strong').min (8).required ().description ('Password'),
			fullName: joi.string ().required ().description ('Full Name'),
			nickname: joi.string ().required ().description ('Nickname'),
			email: joi.string ().email ().required ().description ('Email Address'),
			lang: joi.string ().optional ().description ('IETF language tag')
		}).required ().meta ({ className: 'CreateUser' }),

		authenticate: joi.object ({
			username: joi.string ().required ().description ('Username'),
			password: joi.string ().required ().description ('Password')
		}).required ().meta ({ className: 'AuthenticateUser' }),

		forgot: joi.object ({
			email: joi.string ().email ().optional ().description ('Email Address'),
			token: joi.string ().optional ().description ('Token'),
			password: joi.string ().regex (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$/, 'strong').min (8).optional ().description ('Password')
		}).required (),
	};
} ());
