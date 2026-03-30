angular.module('bankingApp')
  .controller('TransactionListController', ['$scope', '$location', 'AdminService', 'ToastService',
    function ($scope, $location, AdminService, ToastService) {

      $scope.loading      = true;
      $scope.transactions = [];
      $scope.typeFilter   = '';   // '' = All

      // ─── Client-side type filter predicate ────────────────────────────
      $scope.filterByType = function (tx) {
        if (!$scope.typeFilter) return true;
        return tx.type === $scope.typeFilter;
      };

      // ─── Row tint class ───────────────────────────────────────────────
      $scope.txRowClass = function (type) {
        switch (type) {
          case 'DEPOSIT':    return 'tx-row--credit';
          case 'WITHDRAWAL': return 'tx-row--debit';
          case 'TRANSFER':   return 'tx-row--transfer';
          default:           return '';
        }
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

      // ─── Navigate to transaction detail ───────────────────────────────
      $scope.viewTransaction = function (transactionId) {
        $location.path('/admin/transactions/' + transactionId);
      };

      // ─── Load all transactions on init ────────────────────────────────
      AdminService.getAllTransactions()
        .then(function (data) {
          $scope.transactions = data;
        })
        .catch(function () {
          ToastService.show('Failed to load transactions.', 'error');
        })
        .finally(function () {
          $scope.loading = false;
        });

    }
  ]);