'use strict';
// https://api.github.com/repos/hasadna/Open-Knesset/tags
// https://api.github.com/repos/hasadna/Open-Knesset/branches
// https://api.github.com/repos/hasadna/Open-Knesset/languages
// https://api.github.com/repos/hasadna/Open-Knesset/contributors
// https://api.github.com/repos/hasadna/Open-Knesset/commits

var App = angular.module('App', [
    'ngResource', 'ngRoute', 'ngSanitize', 'ui.utils', 'App.filters',
    'HebUtill', 'commentsHandler', 'arrayUtill', 'checkboxesFilter'
]);


/***
 * 
 * @param {ngRoute.$routeProvider} $routeProvider
 */
App.config(function($routeProvider) {

    $routeProvider.when('/:eKnight*', {
        controller: 'eKnightCtrl',
        templateUrl: 'templates/list.html'
    });
    $routeProvider.when('/', {
        controller: 'indexCtrl',
        templateUrl: 'templates/index.html'
    });
//    $routeProvider.otherwise({
//        redirectTo: '/'
//    });
});