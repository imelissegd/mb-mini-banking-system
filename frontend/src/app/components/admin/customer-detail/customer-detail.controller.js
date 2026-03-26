angular.module('bankingApp')
  .controller('CustomerDetailController',
    ['$routeParams', 'AdminService', 'ToastService',
    function ($routeParams, AdminService, ToastService) {

      var vm = this;

      vm.loading    = true;
      vm.customer   = null;
      vm.editMode   = false;
      vm.editData   = {};

      var customerId = $routeParams.id;

      // ─── Load Customer ──────────────────────────────────────────────────
      function loadCustomer () {
        AdminService.getCustomer(customerId)
          .then(function (response) {
            vm.customer = response.data;
            // Pre-populate edit form
            vm.editData = {
              firstName: vm.customer.firstName,
              lastName:  vm.customer.lastName,
              email:     vm.customer.email
            };
          })
          .catch(function () {
            ToastService.show('Failed to load customer.', 'error');
          })
          .finally(function () {
            vm.loading = false;
          });
      }

      loadCustomer();

      // ─── Edit ───────────────────────────────────────────────────────────
      vm.toggleEdit = function () {
        vm.editMode = !vm.editMode;
      };

      vm.saveEdit = function () {
        AdminService.updateCustomer(customerId, vm.editData)
          .then(function () {
            ToastService.show('Customer updated successfully.', 'success');
            vm.editMode = false;
            loadCustomer();
          })
          .catch(function () {
            ToastService.show('Update failed.', 'error');
          });
      };

      // ─── Toggle Status ──────────────────────────────────────────────────
      vm.toggleStatus = function () {
        var newStatus = !vm.customer.isActive;
        AdminService.setCustomerStatus(customerId, newStatus)
          .then(function () {
            var msg = newStatus ? 'Customer activated.' : 'Customer deactivated.';
            ToastService.show(msg, 'success');
            loadCustomer();
          })
          .catch(function () {
            ToastService.show('Status update failed.', 'error');
          });
      };

      // ─── Provision Account ──────────────────────────────────────────────
      vm.provisionAccount = function () {
        AdminService.provisionAccount(customerId)
          .then(function () {
            ToastService.show('Bank account provisioned.', 'success');
            loadCustomer();
          })
          .catch(function () {
            ToastService.show('Provision failed.', 'error');
          });
      };

    }
  ]);