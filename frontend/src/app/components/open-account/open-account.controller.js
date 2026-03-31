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
          .then(function () {
            // BE returns RequestResponse — account is not created yet,
            // it is pending admin approval. Cannot show an account number.
            ToastService.show(
              'Your request to open a ' + $scope.selectedType.toLowerCase() +
              ' account has been submitted and is pending admin approval.',
              'success'
            );
            $location.path('/dashboard');
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message
              : 'Failed to submit account request. Please try again.';
            ToastService.show(msg, 'error');
          })
          .finally(function () {
            $scope.busy = false;
          });
      };

    }
  ]);