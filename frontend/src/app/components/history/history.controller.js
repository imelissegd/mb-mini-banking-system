angular.module('bankingApp')
  .controller('HistoryController', ['$scope', 'TransactionService', 'ToastService',
    function ($scope, TransactionService, ToastService) {

      $scope.loading      = true;
      $scope.transactions = [];

      // ─── Row tint class by type ────────────────────────────────────────
      $scope.txRowClass = function (type) {
        switch (type) {
          case 'DEPOSIT':    return 'tx-row--credit';
          case 'WITHDRAWAL': return 'tx-row--debit';
          case 'TRANSFER':   return 'tx-row--transfer';
          default:           return '';
        }
      };

      // ─── Type badge class ──────────────────────────────────────────────
      $scope.txBadgeClass = function (type) {
        switch (type) {
          case 'DEPOSIT':    return 'tx-type-badge--credit';
          case 'WITHDRAWAL': return 'tx-type-badge--debit';
          case 'TRANSFER':   return 'tx-type-badge--transfer';
          default:           return '';
        }
      };

      // ─── Amount color class ────────────────────────────────────────────
      $scope.txAmountClass = function (type) {
        switch (type) {
          case 'DEPOSIT':    return 'tx-amount--credit';
          case 'WITHDRAWAL': return 'tx-amount--debit';
          case 'TRANSFER':   return 'tx-amount--transfer';
          default:           return '';
        }
      };

      // ─── Format ISO timestamp to readable string ───────────────────────
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

      // ─── Load transactions on init ─────────────────────────────────────
      TransactionService.getMyTransactions()
        .then(function (data) {
          $scope.transactions = data;
        })
        .catch(function () {
          ToastService.show('Failed to load transaction history.', 'error');
        })
        .finally(function () {
          $scope.loading = false;
        });

    }
  ]);