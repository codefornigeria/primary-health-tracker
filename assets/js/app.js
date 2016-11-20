
angular.module('app', [
    'ui.router',
    'ngAnimate',
    'restangular',
    'ui.bootstrap',
    'app.controllers',
    'app.directives',
    'ngMap',
    ])

.config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider',
  function($stateProvider, $urlRouterProvider, RestangularProvider) {
  RestangularProvider.setBaseUrl('https://sahara-health-api.herokuapp.com/');

  RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
      if (data.response && data.response.data) {
          var returnedData = data.response.data;
          return returnedData;
      } else {
          return data;
      };
  });
      
      $stateProvider
      .state('home', {
        url: '',
        templateUrl: 'modules/map.html',
        controller: 'appCtrl'
    })
      
      $urlRouterProvider.otherwise('/home')  
  }])