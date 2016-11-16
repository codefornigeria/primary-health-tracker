angular.module('app.controllers', [])

.factory('API', ['Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
         RestangularConfigurer.setBaseUrl('');
    });
 }])
  
.controller('appCtrl', function($scope, Restangular, $state, $stateParams, NgMap) {
   $scope.areas = [
		{id: 01, pos:[6.519342, 3.372343], name:'yaba', address: 'Yaba college of technology'},
	];
	
    $scope.seeDetails = function(evt, obj, type) {
        $scope.details = true;
        $scope.selectedPoint = obj;
    }

    NgMap.getMap().then(function(map) {
    	
    });
})

