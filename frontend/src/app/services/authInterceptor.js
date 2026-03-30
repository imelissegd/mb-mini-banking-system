angular.module('bankingApp')
  .factory('AuthInterceptor', ['$q', '$injector', 'APP_CONFIG',
    function ($q, $injector, APP_CONFIG) {
      return {

        request: function (config) {
          var token = localStorage.getItem(APP_CONFIG.tokenKey);
          if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = 'Bearer ' + token;
          }
          return config;
        },

        responseError: function (rejection) {
          var $location = $injector.get('$location');
          if (rejection.status === 401) {
            localStorage.removeItem(APP_CONFIG.tokenKey);
            $location.path('/login');
          } else if (rejection.status === 403) {
            $location.path('/dashboard');
          }
          return $q.reject(rejection);
        }

      };
    }
  ]);