angular.module('bankingApp')
  .controller('AdminDashboardController', ['AdminService', 'ToastService',
    function (AdminService, ToastService) {

      var vm = this;

      vm.loading = true;
      vm.summary = null;  // { totalCustomers, totalTransactions, totalBalance }

      // ─── Init ───────────────────────────────────────────────────────────
      AdminService.getDashboardSummary()
        .then(function (response) {
          vm.summary = response.data;
        })
        .catch(function (error) {
          ToastService.show('Failed to load dashboard summary.', 'error');
          console.error('AdminDashboard: summary load failed', error);
        })
        .finally(function () {
          vm.loading = false;
        });

    }
  ]);