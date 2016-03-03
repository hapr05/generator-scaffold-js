(function (require, module) {
	'use strict';

	const generator = require ('yeoman-generator'),
		path = require ('path'),
		process = require ('process'),
		camel = require ('to-camel-case'),
		gitConfig = require ('git-config'),
		githubUrlFromGit = require ('github-url-from-git'),
		validators = require ('../util/validators.js');

	module.exports = generator.Base.extend ({
		constructor: function () {
			generator.Base.apply (this, arguments);

			this.appname = path.basename (process.cwd ());
			this.config.set ('appname', this.appname);
		},

		_def (a, b) {
			return this.config.get (a) || b;
		},

		_angular () {
			this.directory ('angular', 'src/web');
			this.template ('bower.angular.json', 'bower.json');
		},

		init () {
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
					{ name: 'cfgName', message: 'Name', default: this._def ('name', this.appname), validate: validators.required },
					{ name: 'cfgDescription', message: 'Description', default: this._def ('description', 'oldschool generated application') },
					{ name: 'cfgContribName', message: 'Author name', default: this._def ('cName', this.gitConfig && this.gitConfig.user && this.gitConfig.user.name) },
					{ name: 'cfgContribEmail', message: 'Author email', default: this._def ('cEmail', this.gitConfig && this.gitConfig.user && this.gitConfig.user.email) },
					{ name: 'cfgContribUrl', message: 'Author url', default: this._def ('cUrl', '') },
					{ name: 'cfgRepository', message: 'Repository url', default: this._def ('repository', '') }
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
				{ name: 'cfgLicense', message: 'License', default: this._def ('license', 'MIT'), type: 'list', choices: [ 'Apache-2.0', 'MIT' ]}
			];

			this.isGithub = Boolean (homepage);
			if (this.isGithub) {
				prompts = prompts.concat ([
					{ name: 'cfgHomepage', message: 'Project homepage url', default: this._def ('homepage', homepage) },
					{ name: 'cfgBugs', message: 'Issue tracker url', default: this._def ('bugs', homepage + '/issues') }
				]);
			} else {
				prompts = prompts.concat ([
					{ name: 'cfgHomepage', message: 'Project homepage url', default: this._def ('homepage', '') },
					{ name: 'cfgBugs', message: 'Issue tracker url', default: this._def ('bugs', '') }
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

		app () {
			const template = [ '.gitignore', '.travis.yml', '.jshintrc', 'gulpfile.js', '.bowerrc', 'README.md', 'package.json', 'server.js' ],
				directory = [ 'config', 'src', 'test' ];

			Object.assign (this, this.config.getAll ());
			this.appCamel = camel (this.config.get ('cfgName'));

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
		}
	});
} (require, module));
