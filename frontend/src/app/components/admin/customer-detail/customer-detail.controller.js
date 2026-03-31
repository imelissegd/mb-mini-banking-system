angular.module('bankingApp')
  .controller('CustomerDetailController', ['$scope', '$routeParams', '$location', 'AdminService', 'ToastService',
    function ($scope, $routeParams, $location, AdminService, ToastService) {

      var customerId = $routeParams.id;

      $scope.loading         = true;
      $scope.customer        = null;

      $scope.showEdit        = false;
      $scope.showOpenAccount = false;

      $scope.statusBusy      = false;
      $scope.editBusy        = false;
      $scope.openAccountBusy = false;

      $scope.editForm        = {};
      $scope.newAccountType  = '';

      // ─── Navigation ───────────────────────────────────────────────────
      $scope.goBack = function () {
        $location.path('/admin/customers');
      };

      // ─── Toggle edit panel ────────────────────────────────────────────
      $scope.toggleEdit = function () {
        $scope.showEdit = !$scope.showEdit;
        if ($scope.showEdit) {
          $scope.editForm = {
            firstName:  $scope.customer.firstName,
            middleName: $scope.customer.middleName || '',
            lastName:   $scope.customer.lastName,
            suffix:     $scope.customer.suffix || '',
            email:      $scope.customer.email
          };
        }
      };

      // ─── Toggle open-account inline form ──────────────────────────────
      $scope.toggleOpenAccount = function () {
        $scope.showOpenAccount = !$scope.showOpenAccount;
        $scope.newAccountType  = '';
      };

      // ─── Load customer ────────────────────────────────────────────────
      // getCustomer() now fetches accounts separately and attaches them.
      function loadCustomer() {
        $scope.loading = true;
        AdminService.getCustomer(customerId)
          .then(function (data) {
            $scope.customer = data;
          })
          .catch(function () {
            ToastService.show('Failed to load customer.', 'error');
          })
          .finally(function () {
            $scope.loading = false;
          });
      }

      loadCustomer();

      // ─── Toggle active / inactive status ──────────────────────────────
      // A-04: BE endpoint is /admin/users/:id/toggle-active — it toggles
      // blindly. We confirm with the user then call setCustomerStatus().
      // The service ignores the isActive param and just hits the toggle.
      // We update the local state optimistically on success.
      $scope.toggleStatus = function () {
        var nextState = !$scope.customer.isActive;
        var label     = nextState ? 'activate' : 'deactivate';

        if (!window.confirm('Are you sure you want to ' + label + ' this customer?')) {
          return;
        }

        $scope.statusBusy = true;

        AdminService.setCustomerStatus(customerId, nextState)
          .then(function (updated) {
            // Use the value returned by BE to stay in sync
            $scope.customer.isActive = updated.isActive !== undefined
              ? updated.isActive
              : nextState;
            ToastService.show(
              'Customer ' + ($scope.customer.isActive ? 'activated' : 'deactivated') + '.',
              'success'
            );
          })
          .catch(function () {
            ToastService.show('Failed to update status.', 'error');
          })
          .finally(function () {
            $scope.statusBusy = false;
          });
      };

      // ─── Submit edit form ─────────────────────────────────────────────
      // A-03: Direct admin edit endpoint missing from BE.
      // updateCustomer() rejects with a descriptive message —
      // the catch block surfaces it via toast.
      $scope.submitEdit = function () {
        if (!$scope.editForm.firstName || !$scope.editForm.lastName || !$scope.editForm.email) {
          ToastService.show('First name, last name, and email are required.', 'error');
          return;
        }

        $scope.editBusy = true;

        AdminService.updateCustomer(customerId, $scope.editForm)
          .then(function (updated) {
            $scope.customer.firstName  = updated.firstName  || $scope.editForm.firstName;
            $scope.customer.middleName = updated.middleName !== undefined ? updated.middleName : $scope.editForm.middleName;
            $scope.customer.lastName   = updated.lastName   || $scope.editForm.lastName;
            $scope.customer.suffix     = updated.suffix     !== undefined ? updated.suffix     : $scope.editForm.suffix;
            $scope.customer.email      = updated.email      || $scope.editForm.email;
            $scope.showEdit = false;
            ToastService.show('Customer updated successfully.', 'success');
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message
              : 'Failed to update customer.';
            ToastService.show(msg, 'error');
          })
          .finally(function () {
            $scope.editBusy = false;
          });
      };

      // ─── Open account for customer ────────────────────────────────────
      // A-02: openAccountForCustomer now posts to /admin/accounts with
      // { userId, accountType }. Returns BankAccountResponse.
      // BE returns status 'OPEN' — badge in HTML now checks 'OPEN'. ✅
      $scope.submitOpenAccount = function () {
        if (!$scope.newAccountType) {
          ToastService.show('Please select an account type.', 'error');
          return;
        }

        $scope.openAccountBusy = true;

        AdminService.openAccountForCustomer(customerId, $scope.newAccountType)
          .then(function (newAccount) {
            $scope.customer.accounts.push(newAccount);
            $scope.showOpenAccount = false;
            $scope.newAccountType  = '';
            ToastService.show(
              'Account opened. Number: ' + newAccount.accountNumber,
              'success'
            );
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message
              : 'Failed to open account.';
            ToastService.show(msg, 'error');
          })
          .finally(function () {
            $scope.openAccountBusy = false;
          });
      };

    }
  ]);