angular.module('bankingApp')
  .constant('APP_CONFIG', {
    apiBaseUrl: 'http://localhost:8080/api',
    tokenKey:   'banking_jwt_token',
    roles: {
      ADMIN:    'ADMIN',
      CUSTOMER: 'CUSTOMER'
    }
  });