angular.module('bankingApp')
  .controller('TransferController', ['$scope', 'TransactionService', 'AccountService', 'ToastService', '$location',
    function ($scope, TransactionService, AccountService, ToastService, $location) {

      $scope.accounts        = [];
      $scope.loadingAccounts = true;
      $scope.submitting      = false;
      $scope.showConfirm     = false;

      // ─── Form model ───────────────────────────────────────────────────
      // C-04: fromAccountId (integer) → fromAccountNumber (string)
      $scope.form = {
        fromAccountNumber: null,
        toAccountNumber:   '',
        amount:            null,
        description:       ''
      };

      $scope.selectedAccount = null;

      $scope.onFromAccountChange = function () {
        $scope.selectedAccount = $scope.accounts.find(function (a) {
          // C-04: match on accountNumber, not id
          return a.accountNumber === $scope.form.fromAccountNumber;
        }) || null;
      };

      // ─── Load active accounts ─────────────────────────────────────────
      AccountService.getMyAccounts()
        .then(function (data) {
          // C-04: BE returns status 'OPEN', not 'ACTIVE'
          $scope.accounts = (data || []).filter(function (a) {
            return a.status === 'OPEN';
          });
          if ($scope.accounts.length === 1) {
            $scope.form.fromAccountNumber = $scope.accounts[0].accountNumber;
            $scope.onFromAccountChange();
          }
        })
        .catch(function () {
          ToastService.show('Failed to load your accounts.', 'error');
        })
        .finally(function () {
          $scope.loadingAccounts = false;
        });

      // ─── Step 1 → Review ──────────────────────────────────────────────
      $scope.reviewTransfer = function () {
        if (!$scope.form.fromAccountNumber || !$scope.form.toAccountNumber || !$scope.form.amount) {
          ToastService.show('Please fill in all required fields.', 'error');
          return;
        }
        if ($scope.form.amount <= 0) {
          ToastService.show('Amount must be greater than zero.', 'error');
          return;
        }
        if ($scope.selectedAccount && $scope.form.amount > $scope.selectedAccount.balance) {
          ToastService.show('Amount exceeds your available balance.', 'error');
          return;
        }
        $scope.showConfirm = true;
      };

      $scope.cancelConfirm = function () {
        $scope.showConfirm = false;
      };

      // ─── Step 2 → Confirm ─────────────────────────────────────────────
      $scope.confirmTransfer = function () {
        $scope.submitting = true;

        var payload = {
          // C-04: was fromAccountId (integer) — now fromAccountNumber (string)
          fromAccountNumber: $scope.form.fromAccountNumber,
          toAccountNumber:   $scope.form.toAccountNumber.trim(),
          amount:            $scope.form.amount,
          description:       $scope.form.description.trim() || 'Transfer'
        };

        TransactionService.transfer(payload)
          .then(function (res) {
            // service resolves res.data (ApiResponse), so .message is available
            ToastService.show(res.message || 'Transfer successful.', 'success');
            $location.path('/dashboard');
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message
              : 'Transfer failed. Please try again.';

            if (err && err.status === 400 && msg.toLowerCase().includes('insufficient')) {
              msg = 'Insufficient funds. Please check your balance and try again.';
            }

            ToastService.show(msg, 'error');
            $scope.showConfirm = false;
          })
          .finally(function () {
            $scope.submitting = false;
          });
      };

      $scope.resetForm = function () {
        $scope.form = {
          fromAccountNumber: null,
          toAccountNumber:   '',
          amount:            null,
          description:       ''
        };
        $scope.selectedAccount = null;
        $scope.showConfirm     = false;
      };

    }
  ]);