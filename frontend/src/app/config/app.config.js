/**
 * app.config.js — Application-wide constants
 *
 * Usage in any service/controller:
 *   angular.module('bankingApp').controller('MyCtrl', function(APP_CONFIG) {
 *     var url = APP_CONFIG.apiBaseUrl + '/auth/login';
 *   });
 */
angular.module('bankingApp')
  .constant('APP_CONFIG', {
    apiBaseUrl: 'http://localhost:8080/api',

    /**
     * localStorage key used to store the JWT token.
     * Referenced by AuthService and the interceptor — never hard-coded elsewhere.
     */
    tokenKey: 'banking_jwt_token',

    /**
     * Default role values — must match what the backend puts in the JWT claims.
     */
    roles: {
      ADMIN: 'ADMIN',
      CUSTOMER: 'CUSTOMER'
    }
  });