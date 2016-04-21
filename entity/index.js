'use strict';

const generator = require ('yeoman-generator'),
//	camel = require ('to-camel-case'),
//	slug = require ('to-slug-case'),
	validators = require ('../util/validators');

require ('harmony-reflect');

module.exports = generator.Base.extend ({
	constructor: function constructor () {
		Reflect.apply (generator.Base, this, arguments);
		this.entity = {
			collectionName: '',
			fields: []
		};

		this.moment = require ('moment');
	},

	_isDate (answers) {
		return 'Date' === answers.type;
	},

	_isDateNotTimestamp (answers) {
		return 'Date' === answers.type && 'No' === answers.timestamp;
	},

	_isNumber (answers) {
		return 'Number' === answers.type && !answers.integer;
	},

	_isInteger (answers) {
		return 'Number' === answers.type && answers.integer;
	},

	_isString (answers) {
		return 'String' === answers.type;
	},

	_promptField (done, index) {
		var prompt = [
				{ name: `name${ index }`, message: 'Field Name (leave empty if done)', validate: validators.fieldName }
			],
			field = {},
			next = index + 1;

		this.prompt (prompt, answers => {
			if (answers [`name${ index }`]) {
				field.name = answers [`name${ index }`];
				prompt = [
					{ name: 'type', message: 'Field Type', type: 'list', choices: [ 'Boolean', 'Date', 'Number', 'String' ] },
					{ name: 'required', message: 'Required', type: 'confirm' },
					{ name: 'min', message: 'Minimum Date (MM-DD-YYYY) (leave empty for no minimum)', validate: validators.date, when: this._isDate },
					{ name: 'max', message: 'Maximum Date (MM-DD-YYYY) (leave empty for no maximum)', validate: validators.date, when: this._isDate },
					{ name: 'timestamp', message: 'Is the date a timestamp?', type: 'list', choices: [ 'No', 'Yes (JavaScript)', 'Yes (Unix)' ], when: this._isDate },
					{ name: 'format', message: 'Date Format (leave empty for no format)', validate: validators.dateFormat, when: this._isDateNotTimestamp },
					{ name: 'integer', message: 'Integer', type: 'confirm', when: this._isNumber },
					{ name: 'min', message: 'Minimum Value (leave empty for no minimum)', validate: validators.integer, when: this._isInteger },
					{ name: 'max', message: 'Maximum Value (leave empty for no maximum)', validate: validators.integer, when: this._isInteger },
					{ name: 'min', message: 'Minimum Value (leave empty for no minimum)', validate: validators.number, when: this._isNumber },
					{ name: 'max', message: 'Maximum Value (leave empty for no maximum)', validate: validators.number, when: this._isNumber },
					{ name: 'min', message: 'Minimum Length (leave empty for no minimum)', validate: validators.integer, when: this._isString },
					{ name: 'max', message: 'Maximum Length (leave empty for no maximum)', validate: validators.integer, when: this._isString }
				];

				this.prompt (prompt, fieldAnswers => {
					Object.assign (field, fieldAnswers);
					this.entity.fields.push (field);
					this._promptField (done, next);
				});
			} else {
				done ();
			}
		});
	},

	_angular () {
		this.directory ('angular', 'src/web/app/components');
		this.directory ('test.angular.web', 'test/unit/web/app/components');
	},

	askFor () {
		const done = this.async (),
			prompts = [
				{ name: 'collectionName', message: 'Collection Name', validate: validators.collectionName }
			];

		this.prompt (prompts, answers => {
			this.entity.collectionName = answers.collectionName;
			this._promptField (done, 0);
		});
	},

	app () {
		this.template ('model.js', `src/server/models/${ this.entity.collectionName }.js`);
		this.template ('route.js', `src/server/routes/${ this.entity.collectionName }.js`);
		this.template ('test.js', `test/unit/server/routes/${ this.entity.collectionName }.js`);
		this._angular ();
	}
});
