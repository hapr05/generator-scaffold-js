/**
 * The REST entity generator
 * @namespace entity
 */
'use strict';

const generator = require ('yeoman-generator'),
	to = require ('to-case'),
	validators = require ('../util/validators'),
	editors = require ('../util/editors');

var index;

require ('harmony-reflect');

module.exports = generator.Base.extend ({
	/**
	 * Generator for adding custom entities
	 * @class EntityGenerator
	 * @memberOf entity
	 */
	constructor: function constructor () {
		Reflect.apply (generator.Base, this, arguments);
		/**
		 * Entity definition
		 * @member {Object} entity.EntityGenerator~entity
		 * @private
		 */
		this.entity = {
			collectionName: '',
			fields: []
		};
	},

	/**
	 * Intiializes items that cannot be initialized in the constructor
	 * @function entity.EntitypGenerator~init
	 */
	init () {
		/**
		 * camelCase app name
		 * @member {String} entity.EntityGenerator~appCamel
		 * @private
		 */
		this.appCamel = to.camel (this.config.get ('cfgName'));
		/**
		 * slug-case app name
		 * @member {String} entity.EntityGenerator~appSlug
		 * @private
		 */
		this.appSlug = to.slug (this.config.get ('cfgName'));
		/**
		 * moment instance
		 * @member {Object} entity.EntityGenerator~moment
		 * @private
		 */
		this.moment = require ('moment');
	},

	/**
	 * Returns true if the currenly prompted field is not a Boolean
	 * @function entity.EntityGenerator~_isNotBoolean
	 * @private
	 * @param {Object} answers - current prompt answers
	 * @returns {Boolean} true if field is not a Boolean
	 */
	_isNotBoolean (answers) {
		return 'Boolean' !== answers [`type${ index }`];
	},

	/**
	 * Returns true if the currenly prompted field is a Date
	 * @function entity.EntityGenerator~_isDate
	 * @private
	 * @param {Object} answers - current prompt answers
	 * @returns {Boolean} true if field is a Date
	 */
	_isDate (answers) {
		return 'Date' === answers [`type${ index }`];
	},

	/**
	 * Returns true if the currenly prompted field is a Number (and not an Integer)
	 * @function entity.EntityGenerator~_isNumber
	 * @private
	 * @param {Object} answers - current prompt answers
	 * @returns {Boolean} true if field is a Number
	 */
	_isNumber (answers) {
		return 'Number' === answers [`type${ index }`] && !answers [`integer${ index }`];
	},

	/**
	 * Returns true if the currenly prompted field is an Integer
	 * @function entity.EntityGenerator~_isInteger
	 * @private
	 * @param {Object} answers - current prompt answers
	 * @returns {Boolean} true if field is an Integer
	 */
	_isInteger (answers) {
		return 'Number' === answers [`type${ index }`] && answers [`integer${ index }`];
	},

	/**
	 * Returns true if the currenly prompted field is an String
	 * @function entity.EntityGenerator~_isInteger
	 * @private
	 * @param {Object} answers - current prompt answers
	 * @returns {Boolean} true if field is an String
	 */
	_isString (answers) {
		return 'String' === answers [`type${ index }`];
	},

	/**
	 * Prompts user for a field
	 * @function entity.EntityGenerator~_promptField
	 * @private
	 * @param {Function} done - async done callback
	 */
	_promptField (done) {
		var prompt = [
				{ name: `name${ index }`, message: 'Field Name (leave empty if done)', validate: validators.fieldName }
			],
			field = {};

		this.prompt (prompt, answers => {
			if (answers [`name${ index }`]) {
				field.name = answers [`name${ index }`];
				field.slug = to.slug (answers [`name${ index }`]);
				field.camel = to.camel (answers [`name${ index }`]);
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

	/**
	 * Generates locale strings for a Date
	 * @function entity.EntityGenerator~_dateStrings
	 * @private
	 * @param {Object} json - object to store strings in
	 * @param {Object} field - field to generate strings for
	 */
	_dateStrings (json, field) {
		if (field.min) {
			json.msg.validate [field.camel].min = `${ field.name } is outside of the allowed range.`;
		}
		if (field.max) {
			json.msg.validate [field.camel].max = `${ field.name } is outside of the allowed range.`;
		}
		json.msg.validate [field.camel].date = 'Invalid date.';
	},

	/**
	 * Generates locale strings for a Number
	 * @function entity.EntityGenerator~_numberStrings
	 * @private
	 * @param {Object} json - object to store strings in
	 * @param {Object} field - field to generate strings for
	 */
	_numberStrings (json, field) {
		if (field.min) {
			json.msg.validate [field.camel].min = `${ field.name } must be greater than or equal to ${ field.min }.`;
		}
		if (field.max) {
			json.msg.validate [field.camel].max = `${ field.name } must be less than or equal to ${ field.max }.`;
		}
		if (field.integer) {
			json.msg.validate [field.camel].pattern = `${ field.name } must be an integer.`;
		}
	},

	/**
	 * Generates locale strings for a String
	 * @function entity.EntityGenerator~_stringStrings
	 * @private
	 * @param {Object} json - object to store strings in
	 * @param {Object} field - field to generate strings for
	 */
	_stringStrings (json, field) {
		if (field.min) {
			json.msg.validate [field.camel].minlength = `${ field.name } must be greater than or equal to ${ field.min } characters.`;
		}
		if (field.max) {
			json.msg.validate [field.camel].maxlength = `${ field.name } must be less than or equal to ${ field.min } characters.`;
		}
	},

	/**
	 * Generates entity files for AngularJS
	 * @function entity.EntityGenerator~_angular
	 * @private
	 */
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
			json.field [field.camel] = field.name;
			json.header [field.camel] = field.name;
			json.msg.validate [field.camel] = {};
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
				json.msg.validate [field.camel].required = `${ field.name } is required.`;
			}
		});

		editors.appendHtml (this, 'src/web/index.html', '<!-- build:js app/app.min.js -->', '<!-- /build -->', `<script src="app/components/${ this.entity.collectionSlug }/${ this.entity.collectionSlug }.component.js"></script>`);
		editors.appendHtml (this,
			'src/web/app/components/topnav/topnav.view.html',
			'<!-- entity -->',
			'<!-- /entity -->',
			`<li><a ${ this.appSlug }-authenticated ui-sref="${ this.entity.collectionSlug }" translate="${ this.entity.collectionSlug }.nav">${ this.entity.collectionName }</a></li>`
		);
		data [this.entity.collectionCamel] = json;
		editors.appendJSON (this, 'src/web/assets/locale/locale-en.json', data);
		this.template ('component.js', `src/web/app/components/${ this.entity.collectionSlug }/${ this.entity.collectionSlug }.component.js`);
		this.template ('view.html', `src/web/app/components/${ this.entity.collectionSlug }/${ this.entity.collectionSlug }.view.html`);
		this.template ('test.angular.js', `test/unit/web/app/components/${ this.entity.collectionSlug }/${ this.entity.collectionSlug }.component.js`);
	},

	/**
	 * Initial set of user prompts
	 * @function entity.EntityGenerator~askFor
	 */
	askFor () {
		const done = this.async (),
			prompts = [
				{ name: 'collectionName', message: 'Collection Name', validate: validators.collectionName }
			];

		index = 0;
		this.prompt (prompts, answers => {
			this.entity.collectionName = answers.collectionName;
			this.entity.collectionSlug = to.slug (answers.collectionName);
			this.entity.collectionPascal = to.pascal (answers.collectionName);
			this.entity.collectionCamel = to.camel (answers.collectionName);
			this._promptField (done);
		});
	},

	/**
	 * Generates the entity based on prompt values
	 * @function entity.EntityGenerator~app
	 */
	app () {
		this.template ('model.js', `src/server/models/${ this.entity.collectionSlug }.js`);
		this.template ('route.js', `src/server/routes/${ this.entity.collectionSlug }.js`);
		this.template ('test.js', `test/unit/server/routes/${ this.entity.collectionSlug }.js`);
		this._angular ();
	}
});
