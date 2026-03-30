angular.module('bankingApp')
  .controller('CreateCustomerController', ['$scope', '$location', 'AdminService', 'ToastService',
    function ($scope, $location, AdminService, ToastService) {

      $scope.busy = false;

      // ─── Form model ───────────────────────────────────────────────────
      $scope.form = {
        firstName:  '',
        middleName: '',
        lastName:   '',
        suffix:     '',
        username:   '',
        email:      '',
        password:   ''
      };

      // ─── Navigation ───────────────────────────────────────────────────
      $scope.cancel = function () {
        $location.path('/admin/customers');
      };

      // ─── Submit ───────────────────────────────────────────────────────
      $scope.submit = function () {
        // Basic required-field guard
        if (!$scope.form.firstName || !$scope.form.lastName ||
            !$scope.form.username  || !$scope.form.email    ||
            !$scope.form.password) {
          ToastService.show('Please fill in all required fields.', 'error');
          return;
        }

        $scope.busy = true;

        AdminService.createCustomer($scope.form)
          .then(function (created) {
            ToastService.show(
              'Customer created successfully (ID: ' + created.id + ').',
              'success'
            );
            $location.path('/admin/customers');
          })
          .catch(function (err) {
            // Surface server message if available, otherwise generic fallback
            var msg = (err && err.data && err.data.message)
              ? err.data.message
              : 'Failed to create customer.';
            ToastService.show(msg, 'error');
          })
          .finally(function () {
            $scope.busy = false;
          });
      };

    }
  ]);