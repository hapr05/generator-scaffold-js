(function (require, module) {
	'use strict';

	const generator = require ('yeoman-generator'),
		path = require ('path'),
		process = require ('process'),
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

		init () {
			this.pkg = this.fs.readJSON (path.join (__dirname, '../package.json'));
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
					{ name: 'name', message: 'Name', default: this._def ('name', this.appname), validate: validators.required },
					{ name: 'description', message: 'Description', default: this._def ('description', 'oldschool generated application') },
					{ name: 'cName', message: 'Author name', default: this._def ('cName', this.gitConfig && this.gitConfig.user && this.gitConfig.user.name) },
					{ name: 'cEmail', message: 'Author email', default: this._def ('cEmail', this.gitConfig && this.gitConfig.user && this.gitConfig.user.email) },
					{ name: 'cUrl', message: 'Author url', default: this._def ('cUrl', '') },
					{ name: 'repository', message: 'Repository url', default: this._def ('repository', '') }
				];

			this.prompt (prompts, (answers) => {
				this.config.set (answers);
				done();
			});
		},

		github () {
			const done = this.async (),
				homepage = githubUrlFromGit (this.config.get ('repository'));

			var prompts = [
				{ name: 'license', message: 'License', default: this._def ('license', 'MIT'), type: 'list', choices: [
					'Apache-2.0', 'MIT'
				]}
			];

			this.isGithub = Boolean (homepage);
			if (this.isGithub) {
				prompts = prompts.concat ([
					{ name: 'homepage', message: 'Project homepage url', default: this._def ('homepage', homepage) },
					{ name: 'bugs', message: 'Issue tracker url', default: this._def ('bugs', homepage + '/issues') }
				]);
			} else {
				prompts = prompts.concat ([
					{ name: 'homepage', message: 'Project homepage url', default: this._def ('homepage', '') },
					{ name: 'bugs', message: 'Issue tracker url', default: this._def ('bugs', '') }
				]);
			}

			this.prompt (prompts, (answers) => {
				this.config.set (answers);
				done ();
			});
		},

		app () {
			const config = this.config.getAll (),
				copy = [ '.gitignore', '.travis.yml', '.jshintrc', 'gulpfile.js' ],
				template = [ 'README.md', 'package.json', 'src/web/index.html' ],
				directory = [ 'config', 'src' ];

			
			directory.forEach ((item) => {
				this.directory (item, item);
			});
			copy.forEach ((item) => {
				this.copy (item, item);
			});
			
			template.forEach ((item) => {
				this.template (item, item, config);
			});
			
			switch (config.license) {
				case 'Apache-2.0':
					this.copy ('LICENSE.Apache-2.0', 'LICENSE.Apache-2.0');
					break;
				case 'MIT':
					this.copy ('LICENSE.MIT', 'LICENSE.MIT');
					break;
			}
		},

		installDeps () {
			this.installDependencies ({
				bower: false,
				npm: true
			});
		}
	});
} (require, module));
