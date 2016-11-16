angular.module('app.controllers', [])

.factory('API', ['Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
         RestangularConfigurer.setBaseUrl('');
    });
 }])
  
.controller('appCtrl', function($scope, Restangular, $state, $stateParams, NgMap) {
   $scope.areas = [
		{id: 01, pos:[6.519342, 3.372343], name:'yaba', address: 'Yaba college of technology'},
        {id: 02, pos:[6.505866, 3.367138], name:'yaba', address: 'Yaba college of technology'},
        {id: 03, pos:[6.530316, 3.378114], name:'yaba', address: 'Yaba college of technology'},
        {id: 04, pos:[6.520614, 3.352457], name:'yaba', address: 'Yaba college of technology'},
        {id: 05, pos:[6.522490, 3.382734], name:'yaba', address: 'Yaba college of technology'},
	];
    $scope.yellowareas = [
        {id: 01, pos:[6.522490, 3.382734], name:'yaba', address: 'Yaba college of technology'},
        {id: 02, pos:[6.522570, 3.373219], name:'yaba', address: 'Yaba college of technology'},
        {id: 03, pos:[6.508156, 3.380825], name:'yaba', address: 'Yaba college of technology'},
        {id: 04, pos:[6.508698, 3.384125], name:'yaba', address: 'Yaba college of technology'},
        {id: 05, pos:[6.519765, 3.354342], name:'yaba', address: 'Yaba college of technology'}
    ];
	
    $scope.seeDetails = function(evt, obj, type) {
        $scope.details = true;
        $scope.selectedPoint = obj;
    }

    NgMap.getMap().then(function(map) {
    	
    });
})

