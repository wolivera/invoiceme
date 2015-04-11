'use strict';
 
angular.module('myApp.profile', ['ngRoute'])

// Declared route 
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider.when('/profile/view', {
        templateUrl: 'profile/view.html',
        controller: 'ProfileCtrl'
    })
    .when('/profile/edit', {
        templateUrl: 'profile/edit.html',
        controller: 'ProfileCtrl'
    })
    .otherwise('/profile/view', {
        templateUrl: 'profile/view.html',
        controller: 'ProfileCtrl'
    });
}])

.controller('ProfileCtrl', ['$scope', '$location', '$rootScope', '$cookieStore', function($scope, $location, $rootScope, $cookieStore) {

    
}]);