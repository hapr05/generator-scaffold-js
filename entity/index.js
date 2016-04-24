'use strict';

const generator = require ('yeoman-generator'),
	camel = require ('to-camel-case'),
	slug = require ('to-slug-case'),
	validators = require ('../util/validators'),
	editors = require ('../util/editors');

var index;

require ('harmony-reflect');

module.exports = generator.Base.extend ({
	constructor: function constructor () {
		Reflect.apply (generator.Base, this, arguments);
		this.entity = {
			collectionName: '',
			fields: []
		};
	},

	init () {
		this.appCamel = camel (this.config.get ('cfgName'));
		this.appSlug = slug (this.config.get ('cfgName'));
		this.moment = require ('moment');
	},

	_isNotBoolean (answers) {
		return 'Boolean' !== answers [`type${ index }`];
	},

	_isDate (answers) {
		return 'Date' === answers [`type${ index }`];
	},

	_isNumber (answers) {
		return 'Number' === answers [`type${ index }`] && !answers [`integer${ index }`];
	},

	_isInteger (answers) {
		return 'Number' === answers [`type${ index }`] && answers [`integer${ index }`];
	},

	_isString (answers) {
		return 'String' === answers [`type${ index }`];
	},

	_promptField (done) {
		var prompt = [
				{ name: `name${ index }`, message: 'Field Name (leave empty if done)', validate: validators.fieldName }
			],
			field = {};

		this.prompt (prompt, answers => {
			if (answers [`name${ index }`]) {
				field.name = answers [`name${ index }`];
				prompt = [
					{ name: `type${ index }`, message: 'Field Type', type: 'list', choices: [ 'Boolean', 'Date', 'Number', 'String' ] },
					{ name: `required${ index }`, message: 'Required', type: 'confirm', when: this._isNotBoolean },
					{ name: `min${ index }`, message: 'Minimum Date (MM-DD-YYYY) (leave empty for no minimum)', validate: validators.date, when: this._isDate },
					{ name: `max${ index }`, message: 'Maximum Date (MM-DD-YYYY) (leave empty for no maximum)', validate: validators.date, when: this._isDate },
					{ name: `integer${ index }`, message: 'Integer', type: 'confirm', when: this._isNumber },
					{ name: `min${ index }`, message: 'Minimum Value (leave empty for no minimum)', validate: validators.integer, when: this._isInteger },
					{ name: `max${ index }`, message: 'Maximum Value (leave empty for no maximum)', validate: validators.integer, when: this._isInteger },
					{ name: `min${ index }`, message: 'Minimum Value (leave empty for no minimum)', validate: validators.number, when: this._isNumber },
					{ name: `max${ index }`, message: 'Maximum Value (leave empty for no maximum)', validate: validators.number, when: this._isNumber },
					{ name: `min${ index }`, message: 'Minimum Length (leave empty for no minimum)', validate: validators.integer, when: this._isString },
					{ name: `max${ index }`, message: 'Maximum Length (leave empty for no maximum)', validate: validators.integer, when: this._isString }
				];

				this.prompt (prompt, fieldAnswers => {
					field.type = fieldAnswers [`type${ index }`];
					field.required = fieldAnswers [`required${ index }`];
					field.min = fieldAnswers [`min${ index }`];
					field.max = fieldAnswers [`max${ index }`];
					field.integer = fieldAnswers [`integer${ index }`];
					this.entity.fields.push (field);
					index++;
					this._promptField (done);
				});
			} else {
				done ();
			}
		});
	},

	_dateStrings (json, field) {
		if (field.min) {
			json.msg.validate [field.name].min = `${ field.name } is outside of the allowed range.`;
		}
		if (field.max) {
			json.msg.validate [field.name].max = `${ field.name } is outside of the allowed range.`;
		}
		json.msg.validate [field.name].date = 'Invalid date.';
	},

	_numberStrings (json, field) {
		if (field.min) {
			json.msg.validate [field.name].min = `${ field.name } must be greater than or equal to ${ field.min }.`;
		}
		if (field.max) {
			json.msg.validate [field.name].max = `${ field.name } must be less than or equal to ${ field.max }.`;
		}
		if (field.integer) {
			json.msg.validate [field.name].pattern = `${ field.name } must be an integer.`;
		}
	},

	_stringStrings (json, field) {
		if (field.min) {
			json.msg.validate [field.name].minlength = `${ field.name } must be greater than or equal to ${ field.min } characters.`;
		}
		if (field.max) {
			json.msg.validate [field.name].maxlength = `${ field.name } must be less than or equal to ${ field.min } characters.`;
		}
	},

	_angular () {
		var json = {
				nav: this.entity.collectionName,
				title: this.entity.collectionName,
				titleNew: `New ${ this.entity.collectionName }`,
				titleEdit: `Edit ${ this.entity.collectionName }`,
				field: {},
				msg: {
					error: {
						createFailed: 'Create Failed!',
						updateFailed: 'Update Failed!',
						updateSuccess: 'Update Succeded!'
					},
					validate: {
					}
				},
				header: {},
				btn: {
					create: 'Create',
					search: 'Search',
					cancel: 'Cancel',
					save: 'Save',
					back: 'Back',
					update: 'Update',
					delete: 'Delete'
				}
			},
			data = {};

		this.entity.fields.forEach (field => {
			json.field [field.name] = field.name;
			json.header [field.name] = field.name;
			json.msg.validate [field.name] = {};
			switch (field.type) {
				case 'Date':
					this._dateStrings (json, field);
					break;
				case 'Number':
					this._numberStrings (json, field);
					break;
				default:
				case 'String':
					this._stringStrings (json, field);
					break;
			}

			if (field.required) {
				json.msg.validate [field.name].required = `${ field.name } is required.`;
			}
		});

		editors.appendHtml (this, 'src/web/index.html', '<!-- build:js app/app.min.js -->', '<!-- /build -->', `<script src="app/components/${ this.entity.collectionName }/${ this.entity.collectionName }.component.js"></script>`);
		editors.appendHtml (this,
			'src/web/app/components/topnav/topnav.view.html',
			'<!-- entity -->',
			'<!-- /entity -->',
			`<li><a ${ this.appSlug }-authenticated ui-sref="${ this.entity.collectionName }" translate="${ this.entity.collectionName }.nav">${ this.entity.collectionName }</a></li>`
		);
		data [this.entity.collectionName] = json;
		editors.appendJSON (this, 'src/web/assets/locale/locale-en.json', data);
		this.template ('component.js', `src/web/app/components/${ this.entity.collectionName }/${ this.entity.collectionName }.component.js`);
		this.template ('view.html', `src/web/app/components/${ this.entity.collectionName }/${ this.entity.collectionName }.view.html`);
		this.template ('test.angular.js', `test/unit/web/app/components/${ this.entity.collectionName }/${ this.entity.collectionName }.component.js`);
	},

	askFor () {
		const done = this.async (),
			prompts = [
				{ name: 'collectionName', message: 'Collection Name', validate: validators.collectionName }
			];

		index = 0;
		this.prompt (prompts, answers => {
			this.entity.collectionName = answers.collectionName;
			this._promptField (done);
		});
	},

	app () {
		this.template ('model.js', `src/server/models/${ this.entity.collectionName }.js`);
		this.template ('route.js', `src/server/routes/${ this.entity.collectionName }.js`);
		this.template ('test.js', `test/unit/server/routes/${ this.entity.collectionName }.js`);
		this._angular ();
	}
});
