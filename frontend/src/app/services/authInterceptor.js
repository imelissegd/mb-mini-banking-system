/**
 * authInterceptor.js
 *
 * Intercepts every $http request. If a JWT exists in localStorage,
 * it is attached as Authorization: Bearer <token>.
 *
 * Also intercepts responses:
 *   - 401: token is invalid/expired → clear storage and redirect to login
 *   - 403: access denied → redirect to appropriate page
 */
angular.module('bankingApp')
  .factory('AuthInterceptor', ['$q', '$injector', 'APP_CONFIG',
    function ($q, $injector, APP_CONFIG) {

      return {

        /**
         * request — fires before every outgoing HTTP call
         */
        request: function (config) {
          var token = localStorage.getItem(APP_CONFIG.tokenKey);

          if (token) {
            // Attach JWT to Authorization header
            config.headers = config.headers || {};
            config.headers['Authorization'] = 'Bearer ' + token;
          }

          return config;
        },

        /**
         * responseError — fires when the server returns a non-2xx status
         */
        responseError: function (rejection) {
          // Use $injector to get $location lazily — avoids circular dependency
          var $location = $injector.get('$location');

          if (rejection.status === 401) {
            // Token missing, expired, or rejected by backend
            localStorage.removeItem(APP_CONFIG.tokenKey);
            $location.path('/login');
          } else if (rejection.status === 403) {
            // Authenticated but not authorized — go to dashboard
            $location.path('/dashboard');
          }

          return $q.reject(rejection);
        }

      };
    }
  ]);