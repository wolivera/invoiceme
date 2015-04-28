'use strict';
 
angular.module('myApp.register', ['ngRoute', 'ngCookies'])

// Declared route 
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider.when('/login', {
        templateUrl: 'register/login.html',
        controller: 'RegisterCtrl'
    })
    .when('/signup', {
	    templateUrl: 'register/signup.html',
	    controller: 'RegisterCtrl'
	});
}])


// RegisterCtrl controller
.controller('RegisterCtrl', ['$scope', '$location', '$rootScope', '$cookieStore', function($scope, $location, $rootScope, $cookieStore) {

	var firebaseRef = new Firebase("https://myinvoice.firebaseio.com");
	  
	$scope.user = {};
	$scope.SignIn = function(e){ 
	    e.preventDefault();
	    var username = $scope.user.email;
	    var password = $scope.user.password;

	    firebaseRef.authWithPassword({
		  	email    : username,
		  	password : password
		}, 
		function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		    return alert(error.message)
		  } else {
		    console.log("Authenticated successfully with payload:", authData);

		    var username = authData.password.email;
		    $rootScope.loggedUser = authData; // save logged user into rootscope
		    $cookieStore.put('loggedUser', authData); // save session in cookies for page refresh
		    $location.path('/invoice/list').replace();
		    $scope.$apply();
		  }
		});
	}

	$scope.SignUp = function(e){ 
	    e.preventDefault();

	    var username = $scope.user.email,
	    	password = $scope.user.password,
	    	passwordConfirm = $scope.user.password_confirm;

	    if(!username)
	    	return alert("Email required")
	    if(password !== passwordConfirm)
	    	return alert("Passwords doesn't match")

	    firebaseRef.createUser({
		  	email    : username,
		  	password : password
		}, 
		function(error) {
		  	if (error === null) {
		    	console.log("User created successfully");
		    	var authData = {
		    		password: {
			    		email: username
			    	}
		    	}
		    	$rootScope.loggedUser = authData; // save logged user into rootscope
			    $cookieStore.put('loggedUser', authData); // save session in cookies for page refresh
			    $location.path('/invoice/list').replace();
			    $scope.$apply();
			} else {
			    console.log("Error creating user:", error);
			    return alert(error.message)
			}
		});
	}

	$scope.Logout = function(e){ 
	    e.preventDefault();
	    $rootScope.loggedUser = null;
	    $cookieStore.remove('loggedUser'); // save session in cookies for page refresh
	    $location.path('/home');
	}
}]);