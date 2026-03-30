angular.module('bankingApp')
  .controller('DepositWithdrawController', ['$scope', '$location', 'TransactionService', 'AccountService', 'ToastService',
    function ($scope, $location, TransactionService, AccountService, ToastService) {

      // ─── State ────────────────────────────────────────────────────────
      // Read ?mode=withdraw from the URL so dashboard quick-action links
      // land on the correct tab automatically.
      var initialMode = ($location.search().mode === 'withdraw') ? 'WITHDRAW' : 'DEPOSIT';

      $scope.mode            = initialMode;
      $scope.accounts        = [];
      $scope.loadingAccounts = true;
      $scope.submitting      = false;
      $scope.selectedAccount = null;

      // ─── Form model ───────────────────────────────────────────────────
      $scope.form = {
        accountId: null,
        amount:    null
      };

      // ─── Mode toggle ──────────────────────────────────────────────────
      $scope.setMode = function (mode) {
        $scope.mode = mode;
        $scope.resetForm();
      };

      $scope.isDeposit  = function () { return $scope.mode === 'DEPOSIT';  };
      $scope.isWithdraw = function () { return $scope.mode === 'WITHDRAW'; };

      // ─── Load active accounts ─────────────────────────────────────────
      AccountService.getMyAccounts()
        .then(function (data) {
          $scope.accounts = (data || []).filter(function (a) {
            return a.status === 'ACTIVE';
          });
          if ($scope.accounts.length === 1) {
            $scope.form.accountId = $scope.accounts[0].id;
            $scope.onAccountChange();
          }
        })
        .catch(function () {
          ToastService.show('Failed to load your accounts.', 'error');
        })
        .finally(function () {
          $scope.loadingAccounts = false;
        });

      // ─── Track selected account object ────────────────────────────────
      $scope.onAccountChange = function () {
        $scope.selectedAccount = $scope.accounts.find(function (a) {
          return a.id === $scope.form.accountId;
        }) || null;
      };

      // ─── Submit ───────────────────────────────────────────────────────
      $scope.submit = function () {
        if (!$scope.form.accountId || !$scope.form.amount) {
          ToastService.show('Please fill in all required fields.', 'error');
          return;
        }
        if ($scope.form.amount <= 0) {
          ToastService.show('Amount must be greater than zero.', 'error');
          return;
        }
        if ($scope.isWithdraw() && $scope.selectedAccount &&
            $scope.form.amount > $scope.selectedAccount.balance) {
          ToastService.show('Insufficient funds for this withdrawal.', 'error');
          return;
        }

        $scope.submitting = true;

        var payload = {
          accountId: $scope.form.accountId,
          amount:    $scope.form.amount
        };

        var action = $scope.isDeposit()
          ? TransactionService.deposit(payload)
          : TransactionService.withdraw(payload);

        action
          .then(function (res) {
            var msg = res.message ||
              ($scope.isDeposit() ? 'Deposit successful.' : 'Withdrawal successful.');
            ToastService.show(msg, 'success');
            $scope.resetForm();
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message
              : ($scope.isDeposit()
                  ? 'Deposit failed. Please try again.'
                  : 'Withdrawal failed. Please try again.');

            if (err && err.status === 400 &&
                msg.toLowerCase().includes('insufficient')) {
              msg = 'Insufficient funds. Please check your balance and try again.';
            }

            ToastService.show(msg, 'error');
          })
          .finally(function () {
            $scope.submitting = false;
          });
      };

      // ─── Reset ───────────────────────────────────────────────────────
      $scope.resetForm = function () {
        $scope.form          = { accountId: null, amount: null };
        $scope.selectedAccount = null;
      };

    }
  ]);