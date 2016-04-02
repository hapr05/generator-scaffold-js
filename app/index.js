(function () {
	'use strict';

	const generator = require ('yeoman-generator'),
		path = require ('path'),
		process = require ('process'),
		uuid = require ('node-uuid'),
		camel = require ('to-camel-case'),
		slug = require ('to-slug-case'),
		gitConfig = require ('git-config'),
		githubUrlFromGit = require ('github-url-from-git'),
		db = require ('./db'),
		validators = require ('../util/validators'),
		selfsigned = require ('selfsigned');

	module.exports = generator.Base.extend ({
		constructor: function () {
			generator.Base.apply (this, arguments);

			this.appname = path.basename (process.cwd ());
			this.config.set ('appname', this.appname);

			this.jwtKey = this._def ('jwtkey', uuid.v4 ());
			this.config.set ('appname', this.appname);
		},

		_def (a, b) {
			return this.config.get (a) || b;
		},

		_angular () {
			this.directory ('angular', 'src/web');
			this.directory ('test.angular.web', 'test/unit/web');
			this.template ('bower.angular.json', 'bower.json');
			this.template ('karma.angular.js', 'karma.conf.js');
		},

		init () {
			this.loginPanelClass = 'col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3';
			this.loginFormClass = 'col-md-12';
			this.socialLogins = [];
		},

		git: function () {
			const done = this.async ();

			gitConfig ((err, config) => {
				this.gitConfig = config;
				done ();
			});
		},

		askFor () {
			const done = this.async (),
				prompts = [
					{ name: 'cfgName', message: 'Name', default: this._def ('cfgName', this.appname), validate: validators.name },
					{ name: 'cfgDbUrl', message: 'Database Connection Url', default: this._def ('cfgDbUrl', `mongodb://localhost:27017/${ this.appname}`), validate: validators.dbUrl },
					{ name: 'cfgDescription', message: 'Description', default: this._def ('cfgDescription', 'oldschool generated application') },
					{ name: 'cfgContribName', message: 'Author name', default: this._def ('cfgContribName', this.gitConfig && this.gitConfig.user && this.gitConfig.user.name) },
					{ name: 'cfgContribEmail', message: 'Author email', default: this._def ('cfgContribEmail', this.gitConfig && this.gitConfig.user && this.gitConfig.user.email) },
					{ name: 'cfgContribUrl', message: 'Author url', default: this._def ('cfgContribUrl', '') },
					{ name: 'cfgRepository', message: 'Repository url', default: this._def ('cfgRepository', '') }
				];

			this.prompt (prompts, (answers) => {
				this.config.set (answers);
				done();
			});
		},

		github () {
			const done = this.async (),
				homepage = githubUrlFromGit (this.config.get ('cfgRepository'));

			var prompts = [
				{ name: 'cfgLicense', message: 'License', default: this._def ('cfgLicense', 'MIT'), type: 'list', choices: [ 'Apache-2.0', 'MIT' ]}
			];

			this.isGithub = Boolean (homepage);
			if (this.isGithub) {
				prompts = prompts.concat ([
					{ name: 'cfgHomepage', message: 'Project homepage url', default: this._def ('cfgHomepage', homepage) },
					{ name: 'cfgBugs', message: 'Issue tracker url', default: this._def ('cfgBugs', `${homepage}/issues`) }
				]);
			} else {
				prompts = prompts.concat ([
					{ name: 'cfgHomepage', message: 'Project homepage url', default: this._def ('cfgHomepage', '') },
					{ name: 'cfgBugs', message: 'Issue tracker url', default: this._def ('cfgBugs', '') }
				]);
			}

			/* 
			 * For future support of multiple front end frameworks
			 *
			 * prompts = prompts.concat ([
			 *	{ name: 'cfgFramework', message: 'Front end framework', default: this._def ('framework', 'AngularJS'), type: 'list', choices: [ 'AngularJS', 'Other Framework' ]}
			 * ]);
			 */

			this.prompt (prompts, (answers) => {
				answers.cfgFramework = 'AngularJS';
				this.config.set (answers);
				done ();
			});
		},

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
				{ name: 'cfgSocial', message: 'Social logins', default: this._def ('cfgSocial'), type: 'checkbox', choices: [{
					name: caps.github, value: 'github'
				}, {
					name: caps.twitter, value: 'twitter'
				}, {
					name: caps.facebook, value: 'facebook'
				}, {
					name: caps.google, value: 'google'
				}, {
					name: caps.linkedin, value: 'linkedin'
				}] }
			], dprompts = [];

			this.prompt (prompts, (answers) => {
				this.config.set (answers);

				if (answers.cfgSocial.length) {
					this.loginPanelClass = 'col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2';
					this.loginFormClass = 'col-md-8';

					answers.cfgSocial.forEach ((option) => {
						var cap = caps [option];

						dprompts.push ({
							name: `cfg${cap}Password`,
							message: `${cap} password`,
							default: this._def (`cfg${cap}Password`),
							validate: validators.socialPassword
						});
						dprompts.push ({
							name: `cfg${cap}ClientId`,
							message: `${cap} client id`,
							default: this._def (`cfg${cap}ClientId`),
							validate: validators.socialClientId
						});
						dprompts.push ({
							name: `cfg${cap}ClientSecret`,
							message: `${cap} client secret`,
							default: this._def (`cfg${cap}ClientSecret`),
							validate: validators.socialClientSecret
						});
					});

					this.prompt (dprompts, (details) => {
						this.config.set (details);

						answers.cfgSocial.forEach ((option) => {
							var cap = caps [option];
								this.socialLogins.push ({
									name: option,
									cap: cap,
									password: details [`cfg${cap}Password` ],
									clientId: details [`cfg${cap}ClientId` ],
									clientSecret: details [`cfg${cap}ClientSecret` ],
									icon: icons [option]
								});
						});
	
						done ();
					});
				} else {
					done ();
				}
			});
		},

		certs () {
			const done = this.async ();

			var keys = selfsigned.generate ([{
				name: 'commonName',
				value: `${this.appSlug}.com`
			}], {
				days: 35600
			});

			this.tlsKey = keys.private;
			this.tlsCsr = keys.public;
			this.tlsCert = keys.cert;
			done ();
		},

		app () {
			const template = [ '.gitignore', '.travis.yml', '.jshintrc', 'gulpfile.js', '.bowerrc', 'README.md', 'package.json', 'server.js' ],
				directory = [ 'config', 'src', 'test', 'tls' ];

			Object.assign (this, this.config.getAll ());
			this.appCamel = camel (this.config.get ('cfgName'));
			this.appSlug = slug (this.config.get ('cfgName'));

			directory.forEach ((i) => {
				this.directory (i);
			});
			template.forEach ((i) => {
				this.template (i);
			});
			
			switch (this.cfgLicense) {
				case 'Apache-2.0':
					this.copy ('LICENSE.Apache-2.0');
					break;
				case 'MIT':
					this.copy ('LICENSE.MIT');
					break;
			}

			switch (this.cfgFramework) {
				case 'AngularJS':
					this._angular ();
					break;
			}
		},

		installDeps () {
			this.installDependencies ({
				bower: true,
				npm: true
			});
		},

		installDatabase () {
			const done = this.async ();

			db.seed (this).then (done).catch ((err) => {
				this.log (err);
				done (err);
			});
		}
	});
} ());
