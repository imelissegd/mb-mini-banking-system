angular.module('bankingApp')
  .controller('AdminDashboardController', ['$scope', 'AdminService', 'ToastService',
    function ($scope, AdminService, ToastService) {

      $scope.loading = true;
      $scope.summary = null;

      AdminService.getDashboardSummary()
        .then(function (data) {
          $scope.summary = data || {
            totalCustomers:    '—',
            totalAccounts:     '—',
            totalBalance:      0
          };
        })
        .catch(function () {
          ToastService.show('Failed to load dashboard summary.', 'error');
          $scope.summary = {
            totalCustomers:    '—',
            totalAccounts:     '—',
            totalBalance:      0
          };
        })
        .finally(function () {
          $scope.loading = false;
        });

    }
  ]);