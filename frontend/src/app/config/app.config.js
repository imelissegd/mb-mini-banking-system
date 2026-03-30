angular.module('bankingApp')
  .constant('APP_CONFIG', {
    apiBaseUrl: 'http://localhost:8080/api',
    roles: {
      ADMIN:    'ADMIN',
      CUSTOMER: 'CUSTOMER'
    }
  });