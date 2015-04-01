'use strict';

// Declare app level module which depends on views, and components

angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.register',
  'myApp.invoice',
])
.config(['$routeProvider', function($routeProvider) {
     // Routes will be here     
     
    $routeProvider.otherwise({ // Set defualt view of our app to home
        redirectTo: '/home'
    });
}])


.run( function($cookieStore, $rootScope, $location) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {

      var loggedUser = $cookieStore.get('loggedUser');
      if(!loggedUser){ // no logged user, we should be going to #login

          if (next.templateUrl != "register/login.html" && next.templateUrl != "register/signup.html" && next.templateUrl != "home/home.html") {
            // not going to #login, we should redirect now
            $location.path( "/login" );
          }
      } else if (!$rootScope.loggedUser){ // if page is refreshed we lost the reference in the root scope of the logged user
          $rootScope.loggedUser = loggedUser;
      }
      $rootScope.currentPath = $location.path();
    });
 })

.controller('AppCtrl', ['$scope', '$location', '$cookieStore', function($scope, $location, $cookieStore){

    $scope.showFooter = function(){
        return $location.path() == '/home'
    }

    $scope.isLoggedUser = function(){
        return $cookieStore.get('loggedUser') != null
    }    
    
}]);