angular.module('bankingApp')
  .controller('CustomerListController', ['AdminService', 'ToastService',
    function (AdminService, ToastService) {

      var vm = this;

      vm.loading   = true;
      vm.customers = [];
      vm.search    = '';

      AdminService.getAllCustomers()
        .then(function (response) {
          vm.customers = response.data;
        })
        .catch(function (error) {
          ToastService.show('Failed to load customers.', 'error');
          console.error('CustomerList: load failed', error);
        })
        .finally(function () {
          vm.loading = false;
        });

    }
  ]);