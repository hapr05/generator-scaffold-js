(function app () {
	'use strict';

	angular.module ('<%= appSlug %>', [
		'ngAria',
		'ngCookies',
		'ngSanitize',
		'ngResource',
		'ngMessages',
		'LocalStorageModule',
		'pascalprecht.translate',
		'ui.router',
		'ui.select',
		'ui.bootstrap',
		'ui.bootstrap.datetimepicker',
		'angular-jwt',
		'swaggerUi'
	]).config (function configUrlRouter ($urlRouterProvider) {
		$urlRouterProvider.otherwise ('/');
	}).config (function configTranslate ($translateProvider) {
		$translateProvider.useLocalStorage ();
		$translateProvider.useStaticFilesLoader ({
			prefix: 'assets/locale/locale-',
			suffix: '.json'
		}).preferredLanguage ('en').useSanitizeValueStrategy (null); // TODO:  This should be sanitize but it has issues: https://github.com/angular-translate/angular-translate/issues/1101
	}).config (function configLocalStorage (localStorageServiceProvider) {
		localStorageServiceProvider.setPrefix ('<%= appSlug %>');
	}).config (function configHttp ($httpProvider, $resourceProvider, jwtInterceptorProvider) {
		$httpProvider.defaults.xsrfCookieName = 'crumb';
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRF-Token';

		jwtInterceptorProvider.tokenGetter = function tokenGetter (config, authFactory) {
			if (-1 !== [ 'html' ].indexOf (config.url.substr (config.url.length - 4))) {
				return null;
			} else {
				return authFactory.token;
			}
		};

		$httpProvider.interceptors.push ('jwtInterceptor');
		$resourceProvider.defaults.stripTrailingSlashes = false;
	}).run (function run ($rootScope, $state, authFactory) {
		$rootScope.$on ('$stateChangeStart', function stateChangeStart (e, to) {
			if (to.data && angular.isFunction (to.data.allowed) && !to.data.allowed (authFactory)) {
				e.preventDefault ();
				$state.go ('home');
			}
		});

		$rootScope.$on ('$stateChangeSuccess', function stateChangeSuccess (toState, toParams, fromState, fromParams) {
			if (-1 === [ 'login', 'reigster' ].indexOf (fromState.name)) {
				$rootScope.previousStateName = fromState.name;
				$rootScope.previousStateParams = fromParams;
			}
		});

		$rootScope.back = function back () {
			if (!$rootScope.previousStateName || null === $state.get ($rootScope.previousStateName)) {
				$state.go ('home');
			} else {
				$state.go ($rootScope.previousStateName, $rootScope.previousStateParams);
			}
		};
	});
} ());
