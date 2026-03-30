angular.module('bankingApp')
  .controller('RegisterController', ['$scope', '$location', 'AuthService', 'ToastService',
    function ($scope, $location, AuthService, ToastService) {

      $scope.form      = {};
      $scope.loading   = false;
      $scope.submitted = false;   // flips to true on first submit attempt
                                  // — shows inline errors AND grays out the button

      $scope.register = function () {

        // ─── First submit attempt ─────────────────────────────────────
        // Toast fires once here to tell the user something is wrong.
        // After this, $scope.submitted = true grays out the button so
        // the user can't keep clicking — they must fix the fields first.
        if (!$scope.submitted) {
          $scope.submitted = true;

          if ($scope.form.password !== $scope.form.confirmPassword) {
            ToastService.show('Passwords do not match.', 'warning');
            return;
          }

          if ($scope.registerForm.$invalid) {
            ToastService.show('Please fix the errors before submitting.', 'warning');
            return;
          }
        }

        // ─── Guard for subsequent calls (e.g. form re-enables) ────────
        if ($scope.form.password !== $scope.form.confirmPassword) {
          ToastService.show('Passwords do not match.', 'warning');
          return;
        }

        if ($scope.registerForm.$invalid) {
          return;  // button is grayed out at this point — this is a safety net only
        }

        $scope.loading = true;

        // ⚠ Field names must match RegisterRequest exactly.
        var data = {
          firstName:     $scope.form.firstName,
          middleName:    $scope.form.middleName    || '',
          lastName:      $scope.form.lastName,
          suffix:        $scope.form.suffix        || '',
          username:      $scope.form.username,
          email:         $scope.form.email,
          password:      $scope.form.password,
          contactNumber: $scope.form.contactNumber  // required — not phone / phoneNumber
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