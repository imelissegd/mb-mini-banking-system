angular.module('bankingApp')
  .controller('TransactionDetailController', ['$scope', '$routeParams', '$location', 'AdminService', 'ToastService',
    function ($scope, $routeParams, $location, AdminService, ToastService) {

      var transactionId = $routeParams.id;

      $scope.loading     = true;
      $scope.transaction = null;
      $scope.error       = false;

      // ─── Navigation ───────────────────────────────────────────────────
      $scope.goBack = function () {
        $location.path('/admin/transactions');
      };

      // ─── Type badge class ─────────────────────────────────────────────
      $scope.txBadgeClass = function (type) {
        switch (type) {
          case 'DEPOSIT':    return 'tx-type-badge--credit';
          case 'WITHDRAWAL': return 'tx-type-badge--debit';
          case 'TRANSFER':   return 'tx-type-badge--transfer';
          default:           return '';
        }
      };

      // ─── Amount color class ───────────────────────────────────────────
      $scope.txAmountClass = function (type) {
        switch (type) {
          case 'DEPOSIT':    return 'tx-amount--credit';
          case 'WITHDRAWAL': return 'tx-amount--debit';
          case 'TRANSFER':   return 'tx-amount--transfer';
          default:           return '';
        }
      };

      // ─── Format ISO timestamp ──────────────────────────────────────────
      $scope.formatDate = function (timestamp) {
        if (!timestamp) return '—';
        var d = new Date(timestamp);
        return d.toLocaleDateString('en-PH', {
          year:  'numeric',
          month: 'short',
          day:   'numeric'
        }) + ' ' + d.toLocaleTimeString('en-PH', {
          hour:   '2-digit',
          minute: '2-digit'
        });
      };

      // ─── Load transaction on init ──────────────────────────────────────
      AdminService.getTransaction(transactionId)
        .then(function (data) {
          $scope.transaction = data;
        })
        .catch(function () {
          $scope.error = true;
          ToastService.show('Failed to load transaction.', 'error');
        })
        .finally(function () {
          $scope.loading = false;
        });

    }
  ]);