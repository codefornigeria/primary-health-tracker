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
	
    $scope.seeDetails = function(evt, obj, type) {
        $scope.point = obj;
        console.log($scope.point.rating);
        $scope.openTrack = true;
        // Restangular.one('track-hospitals', hospital).get().then(function(results){
        //     $scope.results = results;
        //     console.log(results.plain());
        // })
    }

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

    $scope.ratingFilter = function() {
        $scope.namefilter = false;
        $scope.ratingfilter = !$scope.ratingfilter;
        $scope.filter = 'rating';
    } 
    $scope.nameFilter = function() {
        $scope.ratingfilter = false;
        $scope.namefilter = !$scope.namefilter;
        $scope.filter = 'name';
    } 
})

