/**
 * app.js — Root AngularJS module + interceptor registration
 */
angular.module('bankingApp', ['ngRoute'])

  .config(['$httpProvider', function ($httpProvider) {
    /**
     * Register AuthInterceptor so it runs on every $http call.
     * AuthInterceptor is defined in authInterceptor.js.
     */
    $httpProvider.interceptors.push('AuthInterceptor');
  }]);