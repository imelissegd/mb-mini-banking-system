angular.module('bankingApp')
  .controller('TransferController', ['$scope', 'TransactionService', 'AccountService', 'ToastService', '$location',
    function ($scope, TransactionService, AccountService, ToastService, $location) {

      // ─── State ────────────────────────────────────────────────────────
      $scope.accounts      = [];
      $scope.loadingAccounts = true;
      $scope.submitting    = false;
      $scope.showConfirm   = false;

      // ─── Form model ───────────────────────────────────────────────────
      $scope.form = {
        fromAccountId:   null,
        toAccountNumber: '',
        amount:          null,
        description:     ''
      };

      // ─── Derived: selected source account object ───────────────────────
      $scope.selectedAccount = null;

      $scope.onFromAccountChange = function () {
        $scope.selectedAccount = $scope.accounts.find(function (a) {
          return a.id === $scope.form.fromAccountId;
        }) || null;
      };

      // ─── Load active accounts for dropdown ────────────────────────────
      AccountService.getMyAccounts()
        .then(function (data) {
          $scope.accounts = (data || []).filter(function (a) {
            return a.status === 'ACTIVE';
          });
          if ($scope.accounts.length === 1) {
            // Auto-select if only one account
            $scope.form.fromAccountId = $scope.accounts[0].id;
            $scope.onFromAccountChange();
          }
        })
        .catch(function () {
          ToastService.show('Failed to load your accounts.', 'error');
        })
        .finally(function () {
          $scope.loadingAccounts = false;
        });

      // ─── Step 1 → Show confirm summary ───────────────────────────────
      $scope.reviewTransfer = function () {
        if (!$scope.form.fromAccountId || !$scope.form.toAccountNumber || !$scope.form.amount) {
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

      // ─── Go back to edit form ─────────────────────────────────────────
      $scope.cancelConfirm = function () {
        $scope.showConfirm = false;
      };

      // ─── Step 2 → Submit transfer ─────────────────────────────────────
      $scope.confirmTransfer = function () {
        $scope.submitting = true;

        var payload = {
          fromAccountId:   $scope.form.fromAccountId,
          toAccountNumber: $scope.form.toAccountNumber.trim(),
          amount:          $scope.form.amount,
          description:     $scope.form.description.trim() || 'Transfer'
        };

        TransactionService.transfer(payload)
          .then(function (res) {
            ToastService.show(res.message || 'Transfer successful.', 'success');
            $location.path('/dashboard');
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message
              : 'Transfer failed. Please try again.';

            // Explicit 400 insufficient funds handling
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

      // ─── Reset form ───────────────────────────────────────────────────
      $scope.resetForm = function () {
        $scope.form = {
          fromAccountId:   null,
          toAccountNumber: '',
          amount:          null,
          description:     ''
        };
        $scope.selectedAccount = null;
        $scope.showConfirm     = false;
      };

    }
  ]);