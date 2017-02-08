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

    $scope.detectmob = function() {
        if(window.innerWidth <= 768) {
            $scope.mapHide = true;
        } else {
            $scope.mapHide = false;
        }
    }
    $scope.detectmob();

    $scope.showMap = function() {
        console.log('true');
        $scope.mapHide = !$scope.mapHide;
    }

    if (localStorage.getItem('disclaimer') != 'shown') {
        console.log('saved');
        $scope.disclaimer = true;
        localStorage.setItem('disclaimer','shown')
    }

    $scope.closeDisclaimer = function() {
        $scope.disclaimer = false;
    }

    Restangular.all('tracker').getList().then(function(response){
        $scope.tracks = response;
    });

    //Services
    Restangular.all('service').getList().then(function(response){
        $scope.services = response;
    });

    $scope.addNewService = function() {
        $scope.services.push ({name: $scope.track.newService});
        Restangular.all('service').post({name: $scope.track.newService}).then(function(response) {
            $scope.track.service = $scope.track.newService;
            $scope.track.newService = '';
        }), function(error){
            $scope.error = error;
            console.log(error)
        };
    }

    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: 'http://45.79.167.131:1337/upload',
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
          $scope.map.showInfoWindow('details', this);
         Restangular.one('track-hospitals', obj.hospital.id).get().then(function(results){
             $scope.results = results;
         })
    }

    $scope.open = function() {
        if(window.innerWidth <= 768) {
            $scope.mapHide = true;
        } else {
            $scope.mapHide = false;
        }
        $scope.openTrack = true;
        Restangular.one('track-hospitals', $scope.point.hospital.id).get().then(function(response) {
            $scope.selectedTracks = response;
        }), function(error){
            $scope.error = error;
            console.log(error)
        };
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

    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchTrack   = '';     // set the default search/filter term

    $scope.getIcon = function (track) {
            // console.log(track);
        var iconsTable = {
            1: "./assets/img/marker.png",
            2: "./assets/img/marker.png",
            3: "./assets/img/yellow.png",
            4: "./assets/img/green.png",
            5: "./assets/img/green.png",
        }

        var iconUrl = iconsTable[Math.floor(track.rating)]
        if (iconUrl)
            return iconUrl;
        return "http://maps.google.com/mapfiles/ms/icons/blue.png";
    };
})
