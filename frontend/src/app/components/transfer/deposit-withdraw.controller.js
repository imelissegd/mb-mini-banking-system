angular.module('bankingApp')
  .controller('DepositWithdrawController', ['$scope', '$location', 'TransactionService', 'AccountService', 'ToastService',
    function ($scope, $location, TransactionService, AccountService, ToastService) {

      var initialMode = ($location.search().mode === 'withdraw') ? 'WITHDRAW' : 'DEPOSIT';

      $scope.mode            = initialMode;
      $scope.accounts        = [];
      $scope.loadingAccounts = true;
      $scope.submitting      = false;
      $scope.selectedAccount = null;

      // ─── Form model ───────────────────────────────────────────────────
      // C-05: accountId (integer) → accountNumber (string)
      $scope.form = {
        accountNumber: null,
        amount:        null
      };

      $scope.setMode = function (mode) {
        $scope.mode = mode;
        $scope.resetForm();
      };

      $scope.isDeposit  = function () { return $scope.mode === 'DEPOSIT';  };
      $scope.isWithdraw = function () { return $scope.mode === 'WITHDRAW'; };

      // ─── Load accounts ────────────────────────────────────────────────
      AccountService.getMyAccounts()
        .then(function (data) {
          // C-05: BE returns status 'OPEN', not 'ACTIVE'
          $scope.accounts = (data || []).filter(function (a) {
            return a.status === 'OPEN';
          });
          if ($scope.accounts.length === 1) {
            $scope.form.accountNumber = $scope.accounts[0].accountNumber;
            $scope.onAccountChange();
          }
        })
        .catch(function () {
          ToastService.show('Failed to load your accounts.', 'error');
        })
        .finally(function () {
          $scope.loadingAccounts = false;
        });

      $scope.onAccountChange = function () {
        $scope.selectedAccount = $scope.accounts.find(function (a) {
          return a.accountNumber === $scope.form.accountNumber;
        }) || null;
      };

      // ─── Submit ───────────────────────────────────────────────────────
      $scope.submit = function () {
        if (!$scope.form.accountNumber || !$scope.form.amount) {
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

        // C-05: payload fields renamed to match BE TransferRequest DTO
        var action = $scope.isDeposit()
          ? TransactionService.deposit({
              toAccountNumber: $scope.form.accountNumber,
              amount:          $scope.form.amount
            })
          : TransactionService.withdraw({
              fromAccountNumber: $scope.form.accountNumber,
              amount:            $scope.form.amount
            });

        action
          .then(function (res) {
            // service resolves res.data (ApiResponse), so .message is available
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

      $scope.resetForm = function () {
        $scope.form          = { accountNumber: null, amount: null };
        $scope.selectedAccount = null;
      };

    }
  ]);