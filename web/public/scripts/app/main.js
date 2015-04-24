/**
 * Created by trump.wang on 2015/4/24.
 */
(function () {
    var app = angular.module('noteApp',[
        'ngRoute'
        , 'noteControllers'
    ]);

    app.config(['$routeProvider', function($routeProvider) {
    	$routeProvider.when('/list', {

    	})
    	.when('/edit/:id', {

    	})
    	.when('/:id', {
    		controller: 'home'
    	});

    }]);

    var controllers = angular.module('noteControllers');
    
    controllers.controller('home', ['$scope', '$http',
	function ($scope, $http) {

	}])
	.controller('edit', ['$scope', '$http',
	function ($scope, $http) {

	}])
	.controller('view', ['$scope', '$http',
	function ($scope, $http) {

	}])
	.controller('register', ['$scope', '$http',
	function ($scope, $http) {

	}])
	.controller('login', ['$scope', '$http',
	function ($scope, $http) {

	}]);

})();