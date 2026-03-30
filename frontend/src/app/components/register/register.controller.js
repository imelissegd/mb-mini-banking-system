angular.module('bankingApp')
  .controller('RegisterController', ['$scope', '$location', 'AuthService', 'ToastService',
    function ($scope, $location, AuthService, ToastService) {

      $scope.form             = {};
      $scope.loading          = false;
      $scope.passwordMismatch = false;

      $scope.register = function () {

        // ─── Client-side validation ────────────────────────────────────
        if ($scope.form.password !== $scope.form.confirmPassword) {
          $scope.passwordMismatch = true;
          ToastService.show('Passwords do not match.', 'warning');
          return;
        }
        $scope.passwordMismatch = false;

        $scope.loading = true;

        // ⚠ Field names must match RegisterRequest exactly.
        // contactNumber is required by the BE — missing it → 400 MissingFieldsException.
        var data = {
          firstName:     $scope.form.firstName,
          middleName:    $scope.form.middleName    || '',
          lastName:      $scope.form.lastName,
          suffix:        $scope.form.suffix        || '',
          username:      $scope.form.username,
          email:         $scope.form.email,
          password:      $scope.form.password,
          contactNumber: $scope.form.contactNumber        // ← required, not phone / phoneNumber
        };

        AuthService.register(data)
          .then(function (res) {
            var message = (res && res.data && res.data.message)
              ? res.data.message
              : 'Registration successful. You may now log in.';
            ToastService.show(message, 'success');
            $location.path('/login');
          })
          .catch(function (err) {
            var message = (err && err.data && err.data.message)
              ? err.data.message
              : 'Registration failed. Please try again.';
            ToastService.show(message, 'error');
          })
          .finally(function () {
            $scope.loading = false;
          });
      };

    }
  ]);