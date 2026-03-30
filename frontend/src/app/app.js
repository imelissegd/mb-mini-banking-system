angular.module('bankingApp', ['ngRoute'])
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }]);