angular.module('bankingApp')
  .controller('AdminDashboardController', ['$scope', 'AdminService', 'ToastService',
    function ($scope, AdminService, ToastService) {

      $scope.loading = true;
      $scope.summary = null;

      // ─── Load summary on init ──────────────────────────────────────────
      AdminService.getDashboardSummary()
        .then(function (data) {
          $scope.summary = data;
        })
        .catch(function () {
          ToastService.show('Failed to load dashboard summary.', 'error');
        })
        .finally(function () {
          $scope.loading = false;
        });

    }
  ]);