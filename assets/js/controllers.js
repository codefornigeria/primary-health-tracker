angular.module('app.controllers', [])

.controller('appCtrl', function($scope, Restangular, $state, $stateParams, NgMap, $http) {
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
    $scope.blues = [
        {id: 01, pos:[6.522390, 3.386834], name:'yaba', address: 'Yaba college of technology'},
        {id: 02, pos:[6.527570, 3.372319], name:'yaba', address: 'Yaba college of technology'},
        {id: 03, pos:[6.589656, 3.380457], name:'yaba', address: 'Yaba college of technology'},
        {id: 04, pos:[6.503498, 3.344121], name:'yaba', address: 'Yaba college of technology'},
        {id: 05, pos:[6.515768, 3.354148], name:'yaba', address: 'Yaba college of technology'}
    ];
    $scope.magentas = [
        {id: 01, pos:[6.535490, 3.562734], name:'yaba', address: 'Yaba college of technology'},
        {id: 02, pos:[6.578570, 3.323419], name:'yaba', address: 'Yaba college of technology'},
        {id: 03, pos:[6.501256, 3.308825], name:'yaba', address: 'Yaba college of technology'},
        {id: 04, pos:[6.580698, 3.345125], name:'yaba', address: 'Yaba college of technology'},
        {id: 05, pos:[6.571765, 3.353642], name:'yaba', address: 'Yaba college of technology'}
    ];
	
    $scope.seeDetails = function(evt, obj, type) {
        $scope.details = true;
        $scope.selectedPoint = obj;
    }

    NgMap.getMap().then(function(map) {
    	
    });

    $scope.search = function() {
        var address = $scope.location;
        var inputMin = 1;
            
        if ($scope.location && $scope.location.length >= inputMin) {
            $http({
                method: 'GET',
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
                                     address + '&key=AIzaSyCq_hPKdxEybYoangnVh1Fs_ARyjnmdSqs' + '&sensor=false&components=country:NG',

                transformRequest: function(data, headersGetter) {
                    var headers = headersGetter();

                    delete headers['Authorization'];

                    return headers;
                }
            }).then(function(results){
                $scope.searching = true;
                $scope.results = results.data.results;
                console.log($scope.results);
            })
        } else {
            $scope.searching = false;
          }        
        }

    $scope.addLocation = function(result) {
        $scope.location = result.formatted_address;
        $scope.location.latitude = result.geometry.location.lat;
        $scope.location.longitude = result.geometry.location.lng;
        $scope.searching = false;
        $scope.showDetail();
    }

    $scope.showDetail = function() {
        $scope.load = true;
        Restangular.all('hospital/search').post($scope.location).then(function(response) {
            $scope.healthCenters = response;
            console.log($scope.healthCenters);
        }), function(error){
            $scope.error = error;
            console.log(error)
        };
    }
})

