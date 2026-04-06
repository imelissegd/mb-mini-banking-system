angular.module('bankingApp')
  .controller('CreateUserController', ['$scope', '$location', 'AdminService', 'ToastService',
    function ($scope, $location, AdminService, ToastService) {

      $scope.busy = false;

      // ─── Form model ───────────────────────────────────────────────────
      $scope.form = {
        firstName:     '',
        middleName:    '',
        lastName:      '',
        suffix:        '',
        username:      '',
        email:         '',
        password:      '',
        contactNumber: '',
        role:          'CUSTOMER'
      };

      // ─── Navigation ───────────────────────────────────────────────────
      $scope.cancel = function () {
        $location.path('/admin/users');
      };

      // ─── Submit ───────────────────────────────────────────────────────
      $scope.submit = function () {
        if (!$scope.form.firstName || !$scope.form.lastName ||
            !$scope.form.username  || !$scope.form.email    ||
            !$scope.form.password  || !$scope.form.contactNumber) {
          ToastService.show('Please fill in all required fields.', 'error');
          return;
        }

        $scope.busy = true;

        AdminService.createUser($scope.form)
          .then(function (created) {
            ToastService.show(
              'User created successfully (ID: ' + created.id + ').',
              'success'
            );
            $location.path('/admin/users');
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message
              : 'Failed to create user.';
            ToastService.show(msg, 'error');
          })
          .finally(function () {
            $scope.busy = false;
          });
      };

    }
  ]);