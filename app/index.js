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
		validators = require ('../util/validators');

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
			this.loginSocialClass = 'hidden';
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
					{ name: 'cfgName', message: 'Name', default: this._def ('cfgName', this.appname), validate: validators.required },
					{ name: 'cfgDbUrl', message: 'Database Connection Url', default: this._def ('cfgDbUrl', `mongodb://localhost:27017/${ this.appname}`), validate: validators.required },
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
					{ name: 'cfgBugs', message: 'Issue tracker url', default: this._def ('cfgBugs', homepage + '/issues') }
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
					github: 'GitHub'
				};
			var prompts = [
				{ name: 'cfgSocial', message: 'Social logins', default: this._def ('cfgSocial', undefined), type: 'checkbox', choices: [{
					name: 'GitHub',
					value: 'github'
				}] }
			];

			this.prompt (prompts, (answers) => {
				this.config.set (answers);

				this.socialLogin = this.socialButtons = this.socialRoutes = this.socialTests = '';

				if (answers.cfgSocial.length) {
					this.loginPanelClass = 'col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2';
					this.loginFormClass = 'col-md-8';
					this.loginSocialClass = 'col-md-4';

					answers.cfgSocial.forEach ((option) => {
						var cap = caps [option],
							prompts = [
								//TODO 32 character minimum
								{ name: 'cfg' + cap + 'Password', message: cap + ' password', default: this._def ('cfg' + cap + 'Password') },
								{ name: 'cfg' + cap + 'ClientId', message: cap + ' client id', default: this._def ('cfg' + cap + 'ClientId') },
								{ name: 'cfg' + cap + 'ClientSecret', message: cap + ' client secret', default: this._def ('cfg' + cap + 'ClientSecret') }
							];

						this.prompt (prompts, (details) => {
							var password = details ['cfg' + cap + 'Password' ],
								clientId = details ['cfg' + cap + 'ClientId' ],
								clientSecret = details ['cfg' + cap + 'ClientSecret' ];

							this.config.set (details);

							this.socialLogin = this.socialLogin + `server.auth.strategy (\'${ option }', 'bell', {
								provider: '${ option }',
								password: '${ password }',
								clientId: '${ clientId }',
								clientSecret: '${ clientSecret }',
								isSecure: false // TODO Terrible idea but required if not using HTTPS especially if developing locally
							});`;

							this.socialButtons = this.socialButtons + 
								`<a href="/authenticate/github"><img src="assets/img/GitHub-Mark-32px.png" alt="{{ 'login.btn.loginWithGithub' | translate }}" /></a>`;

							this.socialRoutes = this.socialRoutes + `, {
		method: 'GET',
		path: '/authenticate/${ option }',
		config: {
			auth: '${ option }',
			description: 'Authenticate a vi ${ cap }',
			tags: [ 'authenticate' ],
			handler: (request, reply) => {
				const users = request.server.plugins ['hapi-mongodb' ].db.collection ('users');

				users.findOne ({
					username: request.auth.credentials.profile.username,
					provider: '${ option }',
					active: true
				}).then ((user) => {
					if (!user) {
						user = {
							username: request.auth.credentials.profile.username,
							provider: '${ option }',
							fullName: request.auth.credentials.profile.displayName,
							nickname: request.auth.credentials.profile.displayName.split (" ").shift (),
							email: request.auth.credentials.profile.email,
							lang: 'en',
							active: true,
							created: new Date (),
							scope: [ 'ROLE_USER' ]
						};
						users._id = users.insertOne (user).insertedId;
					}

					reply.view ('jwt', {
						token: jwt.sign ({
							iss: '${ this.appSlug }',
							exp: parseInt (new Date ().getTime () / 1000, 10) + config.get ('web.tokenExpire'),
							iat: parseInt (new Date ().getTime () / 1000, 10),
							sub: 'auth',
							host: request.info.host,
							user: user._id,
							scope: user.scope
						}, config.get ('web.jwtKey'))
					});
				}).catch (() => {
					reply ().code (401);
				});
			}
		}
	}`;
							this.socialTests = this.socialTests + `
		describe ('${ option }', () => {
			it ('should authenticate ${ option } user', (done) => {
				sandbox.stub (users, 'findOne', () => {
					return Promise.resolve (null);
				});

				server.views ({
					engines: {
						html: require ('handlebars')
					},
					relativeTo: __dirname,
					path: '../../../../src/server/views'
				});
				server.auth.strategy ('github', 'succeed'); 
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'GET', url: '/authenticate/${ option }' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (e) {
						done (e);
					}
				}).catch ((e) => {
					done (e);
				});
			});

			it ('should reauthenticate ${ option } user', (done) => {
				server.views ({
					engines: {
						html: require ('handlebars')
					},
					relativeTo: __dirname,
					path: '../../../../src/server/views'
				});
				server.auth.strategy ('github', 'succeed'); 
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'GET', url: '/authenticate/${ option }' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (e) {
						done (e);
					}
				}).catch ((e) => {
					done (e);
				});
			});

			it ('should fail to authenticate ${ option } user', (done) => {
				server.auth.strategy ('github', 'failed');
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'GET', url: '/authenticate/${ option }' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (401);
						done ();
					} catch (e) {
						done (e);
					}
				}).catch ((e) => {
					done (e);
				});
			});

			it ('should handle view failure', (done) => {
				server.auth.strategy ('github', 'succeed'); 
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'GET', url: '/authenticate/${ option }' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (401);
						done ();
					} catch (e) {
						done (e);
					}
				}).catch ((e) => {
					done (e);
				});
			});
		});`;
						});
					});
				}
				done ();
			});
		},

		app () {
			const template = [ '.gitignore', '.travis.yml', '.jshintrc', 'gulpfile.js', '.bowerrc', 'README.md', 'package.json', 'server.js' ],
				directory = [ 'config', 'src', 'test' ];

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
