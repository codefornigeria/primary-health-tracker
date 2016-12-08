angular.module('app.controllers', [])

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
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}])

.controller('appCtrl', function($scope, Restangular, $state, $stateParams, NgMap, $http, Upload, $timeout) {
    // $scope.location = position;

    Restangular.all('tracker').getList().then(function(response){
        $scope.tracks = response;
        console.log(response.plain());
    })

    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: 'https://sahara-health-api.herokuapp.com/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $scope.image = response.data.response.data.fileUrl;
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }   
    }

    $scope.rating = 0;
    $scope.ratings = [{
        current: 1,
        max: 5
    }];

    $scope.getSelectedRating = function (rating) {
        $scope.track.rating = rating;
    }

    

    $scope.addTrack = function() {
        $scope.track.image = $scope.image;
        Restangular.all('tracker').post($scope.track).then(function(response) {
            $state.reload();
        }), function(error){
            $scope.error = error;
            console.log(error)
        };
    }

   $scope.areas = [
		{id: 01, pos:[6.519342, 3.372343], name:'Ikorodu health center', address: 'ikorodu, lagos', rating: '5', type: 'clinic'},
        {id: 02, pos:[6.505866, 3.367138], name:'Ikeja general hospital', address: 'ikeja, lagos', rating: '4', type: 'hospital'},
        {id: 03, pos:[6.530316, 3.378114], name:'Military hospital', address: 'yaba, lagos', rating: '3', type: 'genaral'},
        {id: 04, pos:[6.520614, 3.352457], name:'Eko hospital', address: 'ikeja, lagos', rating: '2', type: 'maternity'},
        {id: 05, pos:[6.522490, 3.382734], name:'Oak hospital', address: 'ikorodu, lagos', rating: '1', type: 'hospital'},
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

    // NgMap.getMap().then(function(map) {
    	
    // });

    $scope.search = function() {
        var address = $scope.track.name;
        var inputMin = 1;
            
        if ($scope.track.name && $scope.track.name.length >= inputMin) {
            Restangular.one('hospital/lga').get({name: $scope.track.name}).then(function(results){
                $scope.searching = true;
                $scope.results = results;
            })
        } else {
            $scope.searching = false;
          }        
        }

    $scope.addLocation = function(result) {
        $scope.track.name = result.lga;
        $scope.track.lga = result.lga;
        // $scope.location.latitude = result.geometry.location.lat;
        // $scope.location.longitude = result.geometry.location.lng;
        $scope.searching = false;
        $scope.showDetail();
    }

    $scope.showDetail = function() {
        $scope.load = true;
        Restangular.all('hospital/searchlga').post($scope.track).then(function(response) {
            $scope.healthCenters = response;
            console.log(response.plain());
        }), function(error){
            $scope.error = error;
            console.log(error)
        };
    }

    $scope.addService = function(newService) {
        $scope.service = $scope.newService;
    }

    $scope.cleanliness = false;
    $scope.power = false;
    $scope.response = false;
    $scope.blood = false;
    $scope.clean = function() {
        $scope.cleanliness = !$scope.cleanliness;
    }  
    $scope.powerSupply = function() {
        $scope.power = !$scope.power;
    }  
    $scope.ambulance = function() {
        $scope.response = !$scope.response;
    }  
    $scope.bloodBank = function() {
        $scope.blood = !$scope.blood;
    }  
})

