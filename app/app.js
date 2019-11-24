(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('server', {
                url: '/server',
                templateUrl: 'server/index.html',
                controller: 'Server.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'server' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            })
            .state('users', {
                url: '/users',
                templateUrl: 'users/index.html',
                controller: 'Users.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'users' }
            });
            .state('command', {
                url: '/command',
                templateUrl: 'command/index.html',
                controller: 'Command.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'command' }
            });
    }

    function run($http, $rootScope, $window) {
        // get JWT token from server
        $.get('/app/token', function (token) {
            // add JWT token as default auth header
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            // update active tab on state change
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                $rootScope.activeTab = toState.data.activeTab;
            });
        });
    }

    $(function () {
        angular.bootstrap(document, ['app']);
    });
})();