/**
 * The main application generator
 * @namespace app
 */
'use strict';

const generator = require ('yeoman-generator'),
	path = require ('path'),
	process = require ('process'),
	to = require ('to-case'),
	gitConfig = require ('git-config'),
	githubUrlFromGit = require ('github-url-from-git'),
	db = require ('./db'),
	validators = require ('../util/validators'),
	selfsigned = require ('selfsigned');

require ('harmony-reflect');

module.exports = generator.Base.extend ({
	/**
	 * Main application generator
	 * @class AppGenerator
	 * @memberOf app
	 */
	constructor: function constructor () {
		Reflect.apply (generator.Base, this, arguments);

		/**
		 * Module base name
		 * @member {String} app.AppGenerator~appname
		 * @private
		 */
		this.appname = path.basename (process.cwd ());
		this.config.set ('appname', this.appname);
	},

	/**
	 * Returns the previously configured value or a default
	 * @function app.AppGenerator~_def
	 * @private
	 * @param {String} key - configuration key
	 * @param {String} def - default value
	 * @returns {String} the configured or default value
	 */
	_def (key, def) {
		return this.config.get (key) || def;
	},

	/**
	 * Intiializes items that cannot be initialized in the constructor
	 * @function app.AppGenerator~init
	 */
	init () {
		/**
		 * App TLS key
		 * @member {String} app.AppGenerator~tlsKey
		 * @private
		 */
		this.tlsKey = this.config.get ('tlsKey');
		/**
		 * App TLS Cetificate Signing Request
		 * @member {String} app.AppGenerator~tlsCsr
		 * @private
		 */
		this.tlsCsr = this.config.get ('tlsCsr');
		/**
		 * App TLS Cetificate
		 * @member {String} app.AppGenerator~tlsCert
		 * @private
		 */
		this.tlsCert = this.config.get ('tlsCert');

		/**
		 * Class to apply to login panel
		 * @member {String} app.AppGenerator~loginPanelClass
		 * @private
		 */
		this.loginPanelClass = 'col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3';
		/**
		 * Class to apply to login form
		 * @member {String} app.AppGenerator~loginFormClass
		 * @private
		 */
		this.loginFormClass = 'col-md-12';
		/**
		 * Array of selected social logins
		 * @member {Array} app.AppGenerator~socialLogins
		 * @private
		 */
		this.socialLogins = [];
	},

	/**
	 * Collects git configuration
	 * @function app.AppGenerator~git
	 */
	git () {
		const done = this.async ();

		gitConfig ((err, config) => {
			if (!err) {
				/**
				 * Local users git configuration
				 * @member {Object} app.AppGenerator~gitConfig
				 * @private
				 */
				this.gitConfig = config;
			}
			done ();
		});
	},

	/**
	 * Initial set of user prompts
	 * @function app.AppGenerator~askFor
	 */
	askFor () {
		const done = this.async (),
			prompts = [
				{ name: 'cfgName', message: 'Name', default: this._def ('cfgName', this.appname), validate: validators.name },
				{ name: 'cfgDbUrl', message: 'Database Connection Url', default: this._def ('cfgDbUrl', `mongodb://localhost:27017/${ this.appname }`), validate: validators.dbUrl },
				{ name: 'cfgDescription', message: 'Description', default: this._def ('cfgDescription', 'scaffold-js generated application') },
				{ name: 'cfgContribName', message: 'Author Name', default: this._def ('cfgContribName', this.gitConfig && this.gitConfig.user && this.gitConfig.user.name) },
				{ name: 'cfgContribEmail', message: 'Author Email', default: this._def ('cfgContribEmail', this.gitConfig && this.gitConfig.user && this.gitConfig.user.email) },
				{ name: 'cfgContribUrl', message: 'Author Url', default: this._def ('cfgContribUrl', '') },
				{ name: 'cfgRepository', message: 'Repository Url', default: this._def ('cfgRepository', '') }
			];

		this.prompt (prompts, answers => {
			this.config.set (answers);
			done ();
		});
	},

	/**
	 * Checks to see if repository is a GitHub repository and if so adds some default values before continuing to prompt
	 * @function app.AppGenerator~github
	 */
	github () {
		const done = this.async (),
			homepage = githubUrlFromGit (this.config.get ('cfgRepository'));

		var prompts = [
			{ name: 'cfgLicense', message: 'License', default: this._def ('cfgLicense', 'MIT'), type: 'list', choices: [ 'Apache-2.0', 'MIT' ] }
		];

		/**
		 * Indicates if the repository is a GitHub repository
		 * @member {Boolean} app.AppGenerator~gitConfig
		 * @private
		 */
		this.isGithub = Boolean (homepage);

		if (this.isGithub) {
			prompts = prompts.concat ([
				{ name: 'cfgHomepage', message: 'Project Homepage Url', default: this._def ('cfgHomepage', homepage) },
				{ name: 'cfgBugs', message: 'Issue Tracker Url', default: this._def ('cfgBugs', `${ homepage }/issues`) }
			]);
		} else {
			prompts = prompts.concat ([
				{ name: 'cfgHomepage', message: 'Project Homepage Url', default: this._def ('cfgHomepage', '') },
				{ name: 'cfgBugs', message: 'Issue Tracker Url', default: this._def ('cfgBugs', '') }
			]);
		}

		/*
		prompts = prompts.concat ([
			{ name: 'cfgFramework', message: 'Client Framework', default: this._def ('framework', 'AngularJS/Bootstrap'), type: 'list', choices: [ 'AngularJS/Bootstrap', 'Ember/Something' ]}
		]);
		*/
		this.config.set ('cfgFramework', 'AngularJS/Bootstrap');

		this.prompt (prompts, answers => {
			this.config.set (answers);
			done ();
		});
	},

	framework () {
		const done = this.async (),
			prompts = [{
				name: 'cfgTheme',
				message: 'Theme',
				default: this._def ('cfgTheme', 'Bootstrap'), type: 'list',
				choices: [
					'Bootstrap',
					'Cerulean',
					'Cosmo',
					'Cyborg',
					'Darkly',
					'Flatly',
					'Journal',
					'Lumen',
					'Paper',
					'Readable',
					'Sandstone',
					'Simplex',
					'Slate',
					'Spacelab',
					'Superhero',
					'United',
					'Yeti'
				]
			}];

		this.prompt (prompts, answers => {
			this.config.set (answers);
			done ();
		});
	},

	/**
	 * Prompts for social login support
	 * @function app.AppGenerator~social
	 */
	social () {
		const done = this.async (),
			caps = {
				github: 'GitHub',
				twitter: 'Twitter',
				facebook: 'Facebook',
				google: 'Google',
				linkedin: 'Linkedin'
			},
			icons = {
				github: 'GitHub-Mark-32px.png',
				twitter: 'Twitter-Logo-32px.png',
				facebook: 'FB-f-Logo__blue_29.png',
				google: 'Google-Logo-32px.png',
				linkedin: 'In-2C-34px-R.png'
			};
		var prompts = [
			{ name: 'cfgSocial', message: 'Social Logins', default: this._def ('cfgSocial'), type: 'checkbox', choices: [
				{ name: caps.github, value: 'github' },
				{ name: caps.twitter, value: 'twitter' },
				{ name: caps.facebook, value: 'facebook' },
				{ name: caps.google, value: 'google' },
				{ name: caps.linkedin, value: 'linkedin' }
			] }
		];

		this.prompt (prompts, answers => {
			this.config.set (answers);

			if (answers.cfgSocial.length) {
				this.loginPanelClass = 'col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2';
				this.loginFormClass = 'col-md-8';

				answers.cfgSocial.forEach (option => {
					var cap = caps [option];

					this.socialLogins.push ({
						name: option,
						cap,
						upper: option.toUpperCase (),
						icon: icons [option]
					});
				});

				done ();
			} else {
				done ();
			}
		});
	},

	/**
	 * Generates snakeoil certificates
	 * @function app.AppGenerator~certs
	 */
	certs () {
		if (!(this.tlsKey && this.tlsCsr && this.tlsCert)) {
			const keys = selfsigned.generate ([
				{
					name: 'commonName',
					value: `${ this.appSlug }.com`
				}
			], {
				days: 35600
			});

			this.tlsKey = keys.private;
			this.tlsCsr = keys.public;
			this.tlsCert = keys.cert;
			this.config.set ('tlsKey', this.tlsKey);
			this.config.set ('tlsCsr', this.tlsCsr);
			this.config.set ('tlsCert', this.tlsCert);
		}
	},

	/**
	 * Generates the application based on prompt values
	 * @function app.AppGenerator~app
	 */
	app () {
		const template = [ '.travis.yml', '.eslintignore', '.eslintrc.yml', 'gulpfile.js', '.bowerrc', 'README.md', 'package.json', 'server.js' ],
			directory = [ 'config', 'src', 'test', 'tls' ];

		Object.assign (this, this.config.getAll ());
		/**
		 * camelCase app name
		 * @member {String} app.AppGenerator~appCamel
		 * @private
		 */
		this.appCamel = to.camel (this.config.get ('cfgName'));
		/**
		 * slug-case app name
		 * @member {String} app.AppGenerator~appSlug
		 * @private
		 */
		this.appSlug = to.slug (this.config.get ('cfgName'));
		/**
		 * lowercase theme
		 * @member {String} app.AppGenerator~themeLower
		 * @private
		 */
		this.themeLower = to.lower (this.config.get ('cfgTheme'));

		directory.forEach (i => {
			this.directory (i);
		});
		template.forEach (i => {
			this.template (i);
		});
		this.template ('_gitignore', '.gitignore');

		switch (this.cfgLicense) {
			case 'Apache-2.0':
				this.copy ('LICENSE.Apache-2.0');
				break;
			default:
			case 'MIT':
				this.copy ('LICENSE.MIT');
				break;
		}

		this.directory ('angular', '.');
	},

	/**
	 * Installs npm and bower dependencies
	 * @function app.AppGenerator~installDeps
	 */
	installDeps () {
		this.installDependencies ({
			bower: true,
			npm: true
		});
	},

	/**
	 * Installs the database and seeds it with data
	 * @function app.AppGenerator~installDatabase
	 */
	installDatabase () {
		const done = this.async ();

		db.seed (this).then (done).catch (err => {
			this.log (err);
			done (err);
		});
	}
});
