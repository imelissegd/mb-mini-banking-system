angular.module('bankingApp')
  .controller('LoginController', ['$scope', '$location', 'AuthService', 'ToastService',
    function ($scope, $location, AuthService, ToastService) {

      $scope.credentials = { username: '', password: '' };
      $scope.loading      = false;

      $scope.login = function () {
        if (!$scope.credentials.username || !$scope.credentials.password) {
          ToastService.show('Please enter your username and password.', 'warning');
          return;
        }

        $scope.loading = true;

        AuthService.login($scope.credentials)
          .then(function () {
            var role = AuthService.getRole();
            if (role === 'ADMIN') {
              $location.path('/admin');
            } else {
              $location.path('/dashboard');
            }
          })
          .catch(function (err) {
            var message = (err && err.data && err.data.message)
              ? err.data.message
              : 'Login failed. Please check your credentials.';
            ToastService.show(message, 'error');
          })
          .finally(function () {
            $scope.loading = false;
          });
      };

    }
  ]);