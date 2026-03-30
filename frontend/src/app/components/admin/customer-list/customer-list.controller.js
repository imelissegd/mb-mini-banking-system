angular.module('bankingApp')
  .controller('CustomerListController', ['$scope', '$location', 'AdminService', 'ToastService',
    function ($scope, $location, AdminService, ToastService) {

      $scope.loading     = true;
      $scope.customers   = [];
      $scope.searchQuery = '';

      // ─── Client-side filter function ──────────────────────────────────
      // Used by ng-repeat's filter: expression.
      // Matches against full name (first + last) or email.
      $scope.filterCustomer = function (customer) {
        var q = ($scope.searchQuery || '').toLowerCase().trim();
        if (!q) return true;
        var fullName = (customer.firstName + ' ' + customer.lastName).toLowerCase();
        var email    = (customer.email || '').toLowerCase();
        return fullName.indexOf(q) !== -1 || email.indexOf(q) !== -1;
      };

      // ─── Navigate to customer detail ──────────────────────────────────
      $scope.viewCustomer = function (customerId) {
        $location.path('/admin/customers/' + customerId);
      };

      $scope.goToCreate = function () {
        $location.path('/admin/customers/new');
      };

      // ─── Load all customers on init ───────────────────────────────────
      AdminService.getAllCustomers()
        .then(function (data) {
          $scope.customers = data;
        })
        .catch(function () {
          ToastService.show('Failed to load customers.', 'error');
        })
        .finally(function () {
          $scope.loading = false;
        });



    }
  ]);