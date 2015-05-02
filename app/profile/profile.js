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

.controller('ProfileCtrl', ['$scope', '$location', '$rootScope', '$cookieStore', '$timeout', function($scope, $location, $rootScope, $cookieStore, $timeout) {

    var firebaseRef = new Firebase("https://myinvoice.firebaseio.com");
    var postsRef = firebaseRef.child("posts");

    $scope.selected = 1;
    $scope.user = {};
    $scope.user.email = $rootScope.loggedUser.password.email;
    $scope.user.invoicesCount = '-';

    postsRef.orderByChild("username").equalTo($scope.user.email).on("value", function(snapshot){
        $timeout(function(){
            if(snapshot.val()){
                var queryItems = snapshot.val();
                $scope.user.invoicesCount = Object.keys(queryItems).length;
            }
        });
    }, 
    function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    $scope.changeTab = function(event, item){
        event.preventDefault();
        console.log(item)
    }

    $scope.ChangePassword = function(){
        if($scope.user.new_password != $scope.user.new_password_confirm){
            return alert("Passwords doesn't match")
        }

        firebaseRef.changePassword({
          email: $scope.user.email,
          oldPassword: $scope.user.old_password,
          newPassword: $scope.user.new_password
        }, 
        function(error) {
            if (error) {
                console.log("Login Failed!", error);
                return alert(error.message)
            } else {
                alert("Password successfully updated");
                $location.path('/invoice/list').replace();
                $scope.$apply();
            }
        });
    }
    
}]);