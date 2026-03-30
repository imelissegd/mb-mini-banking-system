angular.module('bankingApp')
  .controller('DashboardController', ['$scope', '$q', 'AccountService', 'TransactionService', 'AuthService', 'ToastService',
    function ($scope, $q, AccountService, TransactionService, AuthService, ToastService) {

      // ─── User info ────────────────────────────────────────────────────
      // Read from currentUser directly — by the time the dashboard loads,
      // the route guard has already called loadCurrentUser() and currentUser
      // is populated. Watching the service property keeps it reactive if
      // currentUser is ever updated mid-session.
      $scope.displayName  = AuthService.getDisplayName() || 'there';
      $scope.accounts     = [];
      $scope.totalBalance = 0;
      $scope.recentTx     = [];
      $scope.loading      = true;
      $scope.txLoading    = true;

      // ─── Ensure currentUser is hydrated before reading display name ───
      // The route guard calls loadCurrentUser() but its promise resolves
      // before the controller runs. If currentUser is already set (normal
      // login flow), this resolves instantly. If for any reason it isn't
      // (e.g. hard refresh before guard wires up), this recovers it.
      AuthService.loadCurrentUser()
        .then(function () {
          $scope.displayName = AuthService.getDisplayName() || 'there';
        })
        .catch(function () {
          // 401 — interceptor will redirect to /login, nothing to do here
        });

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
          $scope.recentTx = (data || []).slice(0, 5);
        })
        .catch(function () {
          $scope.recentTx = [];
        })
        .finally(function () {
          $scope.txLoading = false;
        });

      // ─── Helpers ──────────────────────────────────────────────────────
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