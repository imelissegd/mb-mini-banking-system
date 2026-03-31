angular.module('bankingApp')
  .controller('DashboardController', ['$scope', '$q', 'AccountService', 'TransactionService', 'AuthService', 'ToastService',
    function ($scope, $q, AccountService, TransactionService, AuthService, ToastService) {

      $scope.displayName  = AuthService.getDisplayName() || 'there';
      $scope.accounts     = [];
      $scope.totalBalance = 0;
      $scope.recentTx     = [];
      $scope.loading      = true;
      $scope.txLoading    = true;

      // ── Single entry point: confirm cookie → then load accounts ─────────
      // loadCurrentUser() fires GET /auth/me exactly once.
      // getMyAccounts() is chained inside .then() so it only fires after
      // the cookie is confirmed valid — no parallel orphan calls.
      AuthService.loadCurrentUser()
        .then(function () {
          $scope.displayName = AuthService.getDisplayName() || 'there';
          return AccountService.getMyAccounts();
        })
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

      // ── Transactions: parallel is fine, no cookie timing dependency ──────
      TransactionService.getMyTransactions()
        .then(function (data) {
          $scope.recentTx = (data || []).slice(0, 5);
        })
        .catch(function () {
          $scope.recentTx = [];
        })
        .finally(function () {
          $scope.txLoading = false;
        });

      $scope.txTypeClass = function (type) {
        if (type === 'DEPOSIT')    return 'tx--credit';
        if (type === 'WITHDRAWAL') return 'tx--debit';
        return 'tx--transfer';
      };

      $scope.txSign = function (type) {
        if (type === 'DEPOSIT')    return '+';
        if (type === 'WITHDRAWAL') return '-';
        return '⇄';
      };

    }
  ]);