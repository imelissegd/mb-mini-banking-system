angular.module('bankingApp')
  .controller('OpenAccountController', ['$scope', '$location', 'AccountService', 'ToastService',
    function ($scope, $location, AccountService, ToastService) {

      $scope.selectedType = '';
      $scope.busy         = false;

      // ─── Navigation ───────────────────────────────────────────────────
      $scope.cancel = function () {
        $location.path('/dashboard');
      };

      // ─── Submit ───────────────────────────────────────────────────────
      $scope.submit = function () {
        if (!$scope.selectedType) {
          ToastService.show('Please select an account type.', 'error');
          return;
        }

        $scope.busy = true;

        AccountService.openAccount($scope.selectedType)
          .then(function (account) {
            ToastService.show(
              'Account opened! Your new account number is ' + account.accountNumber + '.',
              'success'
            );
            $location.path('/dashboard');
          })
          .catch(function () {
            ToastService.show('Failed to open account. Please try again.', 'error');
          })
          .finally(function () {
            $scope.busy = false;
          });
      };

    }
  ]);