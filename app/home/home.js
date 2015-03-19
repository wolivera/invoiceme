'use strict';
 
angular.module('myApp.home', ['ngRoute'])

// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl'
    });
}])

.controller('HomeCtrl', ['$scope', function($scope) { 
	
}])

