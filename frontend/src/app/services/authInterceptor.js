angular.module('bankingApp')
  .factory('AuthInterceptor', ['$q', '$injector', 'APP_CONFIG',
    function ($q, $injector, APP_CONFIG) {
      return {

        request: function (config) {
          config.withCredentials = true; 
          return config;
        },

        responseError: function (rejection) {
          var $location = $injector.get('$location');
          if (rejection.status === 401) {
            $location.path('/login');
          } else if (rejection.status === 403) {
            $location.path('/dashboard');
          }
          return $q.reject(rejection);
        }

      };
    }
  ]);