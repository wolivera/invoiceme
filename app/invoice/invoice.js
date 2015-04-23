'use strict';
 
angular.module('myApp.invoice', ['ngRoute'])

// Declared route 
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider.when('/invoice/list', {
        templateUrl: 'invoice/list.html',
        controller: 'InvoiceCtrl'
    })
    .when('/invoice/new', {
        templateUrl: 'invoice/new.html',
        controller: 'InvoiceCtrl'
    })
    .when('/invoice/edit/:id', {
        templateUrl: 'invoice/edit.html',
        controller: 'InvoiceCtrl'
    })
    .otherwise('/feed', {
        templateUrl: 'feed/feed.html',
        controller: 'FeedCtrl'
    });
}])

// RegisterCtrl controller
.controller('InvoiceCtrl', ['$scope', '$rootScope', '$location', '$timeout', '$routeParams', function($scope, $rootScope, $location, $timeout, $routeParams) {

	var firebaseRef = new Firebase("https://myinvoice.firebaseio.com");
	var postsRef = firebaseRef.child("posts");
	var username = $rootScope.loggedUser.password.email;

	$scope.invoice = {};
	$scope.editableInvoice = {};
	$scope.invoice.username = username;
	$scope.invoicesList = [];
	$scope.invoice.items = [
	{
		'description': 'Example item',
		'qty': 10,
		'cost': 50
	},
	{
		'description': 'Example item 2',
		'qty': 5,
		'cost': 15
	}]
	$scope.selectedItemList = -1;

	
	postsRef.on("value", function(snapshot) {
		$timeout(function(){
			$scope.invoicesList = snapshot.val();
			//if edit mode then search for invoice to edit
			if($routeParams.id){
				if($scope.invoicesList[$routeParams.id]){ // if route is not correct then redirect to list
					$scope.editableInvoice = $scope.invoicesList[$routeParams.id]
				} else {
					$location.path('/invoice/list').replace();
				}
			}
		});
	}, 
	function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});

    $scope.removeLogo = function(element) {
        var elem = angular.element("#remove_logo");
        if(elem.text() == "Show"){
          elem.text("Remove");
          $scope.logoRemoved = false;
        }
        else{
          elem.text("Show");
          $scope.logoRemoved = true;
        }

    }

    $scope.editLogo = function(){
    	$("#my_company_logo").trigger("click");
    }

    $scope.showLogo = function() {
        $scope.logoRemoved = false;
    }

	$scope.addItem = function() {
        $scope.invoice.items.push({qty:0, cost:0, description:""});    
    }
	
	$scope.removeItem = function(item) {
        $scope.invoice.items.splice($scope.invoice.items.indexOf(item), 1);    
    }

	$scope.CreateInvoice = function(e){ 
	    e.preventDefault();

	    postsRef.push($scope.invoice);
	    $location.path('/invoice/list').replace();
		$scope.$apply();
	}

	$scope.EditInvoice = function(e){
		e.preventDefault();

		var itemRef = postsRef.child($routeParams.id);
		itemRef.update($scope.editableInvoice);
		$location.path('/invoice/list').replace();
	}

	$scope.DeleteInvoice = function(e, key){
		e.preventDefault();

		var itemRef = postsRef.child(key);
		itemRef.remove();
		$location.path('/invoice/list').replace();
	}

}])

.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}])

.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                        $('#company_logo').attr('src', loadEvent.target.result);
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);
