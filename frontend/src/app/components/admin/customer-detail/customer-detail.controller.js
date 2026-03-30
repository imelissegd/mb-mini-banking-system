angular.module('bankingApp')
  .controller('CustomerDetailController', ['$scope', '$routeParams', '$location', 'AdminService', 'ToastService',
    function ($scope, $routeParams, $location, AdminService, ToastService) {

      var customerId = $routeParams.id;

      $scope.loading         = true;
      $scope.customer        = null;

      // ─── UI toggle flags ───────────────────────────────────────────────
      $scope.showEdit        = false;
      $scope.showOpenAccount = false;

      // ─── Busy flags (prevent double-submit) ───────────────────────────
      $scope.statusBusy      = false;
      $scope.editBusy        = false;
      $scope.openAccountBusy = false;

      // ─── Edit form model ──────────────────────────────────────────────
      $scope.editForm        = {};

      // ─── New account type model ───────────────────────────────────────
      $scope.newAccountType  = '';

      // ─── Navigation ───────────────────────────────────────────────────
      $scope.goBack = function () {
        $location.path('/admin/customers');
      };

      // ─── Toggle edit panel ────────────────────────────────────────────
      $scope.toggleEdit = function () {
        $scope.showEdit = !$scope.showEdit;
        if ($scope.showEdit) {
          // Pre-populate form from loaded customer
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
      $scope.toggleStatus = function () {
        var nextState = !$scope.customer.isActive;
        var label     = nextState ? 'activate' : 'deactivate';

        if (!window.confirm('Are you sure you want to ' + label + ' this customer?')) {
          return;
        }

        $scope.statusBusy = true;

        AdminService.setCustomerStatus(customerId, nextState)
          .then(function () {
            $scope.customer.isActive = nextState;
            ToastService.show('Customer ' + (nextState ? 'activated' : 'deactivated') + '.', 'success');
          })
          .catch(function () {
            ToastService.show('Failed to update status.', 'error');
          })
          .finally(function () {
            $scope.statusBusy = false;
          });
      };

      // ─── Submit edit form ─────────────────────────────────────────────
      $scope.submitEdit = function () {
        if (!$scope.editForm.firstName || !$scope.editForm.lastName || !$scope.editForm.email) {
          ToastService.show('First name, last name, and email are required.', 'error');
          return;
        }

        $scope.editBusy = true;

        AdminService.updateCustomer(customerId, $scope.editForm)
          .then(function (updated) {
            // Patch the in-memory customer so the read-only view reflects changes
            $scope.customer.firstName  = updated.firstName  || $scope.editForm.firstName;
            $scope.customer.middleName = updated.middleName !== undefined ? updated.middleName : $scope.editForm.middleName;
            $scope.customer.lastName   = updated.lastName   || $scope.editForm.lastName;
            $scope.customer.suffix     = updated.suffix     !== undefined ? updated.suffix     : $scope.editForm.suffix;
            $scope.customer.email      = updated.email      || $scope.editForm.email;
            $scope.showEdit = false;
            ToastService.show('Customer updated successfully.', 'success');
          })
          .catch(function () {
            ToastService.show('Failed to update customer.', 'error');
          })
          .finally(function () {
            $scope.editBusy = false;
          });
      };

      // ─── Open account for customer ────────────────────────────────────
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
            ToastService.show('Account opened successfully.', 'success');
          })
          .catch(function () {
            ToastService.show('Failed to open account.', 'error');
          })
          .finally(function () {
            $scope.openAccountBusy = false;
          });
      };

    }
  ]);