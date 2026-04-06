angular.module('bankingApp')
  .controller('UserDetailController', ['$scope', '$routeParams', '$location', 'AdminService', 'ToastService',
    function ($scope, $routeParams, $location, AdminService, ToastService) {

      var userId = $routeParams.id;

      $scope.loading         = true;
      $scope.user            = null;
      $scope.showEdit        = false;
      $scope.showOpenAccount = false;
      $scope.statusBusy      = false;
      $scope.editBusy        = false;
      $scope.openAccountBusy = false;
      $scope.editForm        = {};

      // ── FIX: use object so ng-if child scope doesn't shadow the binding ──
      $scope.openAccountForm = { accountType: '' };

      // ─── Navigation ───────────────────────────────────────────────────
      $scope.goBack = function () {
        $location.path('/admin/users');
      };

      // ─── Toggle edit panel ────────────────────────────────────────────
      $scope.toggleEdit = function () {
        $scope.showEdit = !$scope.showEdit;
        if ($scope.showEdit) {
          $scope.editForm = {
            firstName:  $scope.user.firstName,
            middleName: $scope.user.middleName || '',
            lastName:   $scope.user.lastName,
            suffix:     $scope.user.suffix || '',
            email:      $scope.user.email
          };
        }
      };

      // ─── Toggle open-account inline form ──────────────────────────────
      $scope.toggleOpenAccount = function () {
        $scope.showOpenAccount = !$scope.showOpenAccount;
        $scope.openAccountForm.accountType = ''; // reset using dot notation
      };

      // ─── Load user ────────────────────────────────────────────────────
      function loadUser() {
        $scope.loading = true;
        AdminService.getUser(userId)
          .then(function (data) {
            $scope.user = data;
          })
          .catch(function () {
            ToastService.show('Failed to load user.', 'error');
          })
          .finally(function () {
            $scope.loading = false;
          });
      }

      loadUser();

      // ─── Toggle active / inactive ──────────────────────────────────────
      $scope.toggleStatus = function () {
        if (!$scope.user) return;
        $scope.statusBusy = true;

        AdminService.toggleUserActive($scope.user.id)
          .then(function (updated) {
            $scope.user.active = updated.active;
            ToastService.show(
              'User ' + $scope.user.username + ' has been ' +
              (updated.active ? 'activated' : 'deactivated') + '.',
              'success'
            );
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message : 'Failed to update user status.';
            ToastService.show(msg, 'error');
          })
          .finally(function () { $scope.statusBusy = false; });
      };

      // ─── Submit edit form ─────────────────────────────────────────────
      $scope.submitEdit = function () {
        if (!$scope.editForm.firstName || !$scope.editForm.lastName || !$scope.editForm.email) {
          ToastService.show('First name, last name, and email are required.', 'error');
          return;
        }
        $scope.editBusy = true;

        AdminService.updateUser(userId, $scope.editForm)
          .then(function (updated) {
            $scope.user.firstName  = updated.firstName  || $scope.editForm.firstName;
            $scope.user.middleName = updated.middleName !== undefined ? updated.middleName : $scope.editForm.middleName;
            $scope.user.lastName   = updated.lastName   || $scope.editForm.lastName;
            $scope.user.suffix     = updated.suffix     !== undefined ? updated.suffix     : $scope.editForm.suffix;
            $scope.user.email      = updated.email      || $scope.editForm.email;
            $scope.showEdit = false;
            ToastService.show('User updated successfully.', 'success');
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message : 'Failed to update user.';
            ToastService.show(msg, 'error');
          })
          .finally(function () { $scope.editBusy = false; });
      };

      // ─── Open account for user ────────────────────────────────────────
      $scope.submitOpenAccount = function () {
        if (!$scope.openAccountForm.accountType) {
          ToastService.show('Please select an account type.', 'error');
          return;
        }

        $scope.openAccountBusy = true;

        AdminService.openAccountForUser($scope.user.id, $scope.openAccountForm.accountType)
          .then(function (account) {
            $scope.user.accounts.push(account);
            $scope.openAccountForm.accountType = '';
            $scope.showOpenAccount = false;
            ToastService.show(
              'Account opened successfully. Number: ' + account.accountNumber,
              'success'
            );
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message : 'Failed to open account.';
            ToastService.show(msg, 'error');
          })
          .finally(function () { $scope.openAccountBusy = false; });
      };

    }
  ]);