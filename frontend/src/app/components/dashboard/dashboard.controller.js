angular.module('bankingApp')
  .controller('DashboardController', ['$scope', '$q', 'AccountService', 'TransactionService', 'AuthService', 'ToastService',
    function ($scope, $q, AccountService, TransactionService, AuthService, ToastService) {

      // ─── User info ────────────────────────────────────────────────────
      $scope.displayName  = AuthService.getDisplayName() || 'there';
      $scope.accounts     = [];
      $scope.totalBalance = 0;
      $scope.recentTx     = [];
      $scope.loading      = true;
      $scope.txLoading    = true;

      // ─── Load accounts ────────────────────────────────────────────────
      AccountService.getMyAccounts()
        .then(function (data) {
          $scope.accounts = data || [];
          $scope.totalBalance = $scope.accounts.reduce(function (sum, acc) {
            return sum + (acc.balance || 0);
          }, 0);
        })
        .catch(function (err) {
          var message = (err && err.data && err.data.message)
            ? err.data.message
            : 'Failed to load accounts. Please try again.';
          ToastService.show(message, 'error');
        })
        .finally(function () {
          $scope.loading = false;
        });

      // ─── Load recent transactions (last 5) ────────────────────────────
      TransactionService.getMyTransactions()
        .then(function (data) {
          // Show only the 5 most recent
          $scope.recentTx = (data || []).slice(0, 5);
        })
        .catch(function () {
          // Non-critical — silently fail, history page will show full list
          $scope.recentTx = [];
        })
        .finally(function () {
          $scope.txLoading = false;
        });

      // ─── Helpers ──────────────────────────────────────────────────────
      // Returns CSS modifier class for a transaction type
      $scope.txTypeClass = function (type) {
        if (type === 'DEPOSIT')    return 'tx--credit';
        if (type === 'WITHDRAWAL') return 'tx--debit';
        return 'tx--transfer';
      };

      // Returns a sign prefix for amount display
      $scope.txSign = function (type) {
        if (type === 'DEPOSIT')    return '+';
        if (type === 'WITHDRAWAL') return '-';
        return '⇄';
      };

    }
  ]);