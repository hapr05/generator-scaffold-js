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
					{ name: 'name', message: 'Name', default: this.appname, validate: validators.required },
					{ name: 'description', message: 'Description', default: 'oldschool generated application'  },
					{ name: 'cName', message: 'Author name', default: this.gitConfig && this.gitConfig.user && this.gitConfig.user.name },
					{ name: 'cEmail', message: 'Author email', default: this.gitConfig && this.gitConfig.user && this.gitConfig.user.email },
					{ name: 'cUrl', message: 'Author url' },
					{ name: 'repository', message: 'Repository url' }
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
				{ name: 'license', message: 'License', default: 'MIT', type: 'list', choices: [
					'Apache-2.0', 'MIT'
				]}
			];

			this.isGithub = Boolean (homepage);
			if (this.isGithub) {
				prompts = prompts.concat ([
					{ name: 'homepage', message: 'Project homepage url', default: homepage },
					{ name: 'bugs', message: 'Issue tracker url', default: homepage + '/issues' }
				]);
			} else {
				prompts = prompts.concat ([
					{ name: 'homepage', message: 'Project homepage url' },
					{ name: 'bugs', message: 'Issue tracker url' }
				]);
			}

			this.prompt (prompts, (answers) => {
				this.config.set (answers);
				done ();
			});
		},

		app () {
			const config = this.config.getAll ();

			this.copy ('-gitignore', '.gitignore');
			this.template ('-package.json', 'package.json', config);
			this.copy ('-.travis.yml', '.travis.yml');
			this.copy ('-.jshintrc', '.jshintrc');
			switch (config.license) {
				case 'Apache-2.0':
					this.copy ('-LICENSE.Apache-2.0', 'LICENSE.Apache-2.0');
					break;
				case 'MIT':
					this.copy ('-LICENSE.MIT', 'LICENSE.MIT');
					break;
			}
			this.template ('-README.md', 'README.md', config);
			this.copy ('-gulpfile.js', 'gulpfile.js');
		},

		installDeps () {
			this.installDependencies ({
				bower: false,
				npm: true
			});
		}
	});
} (require, module));
