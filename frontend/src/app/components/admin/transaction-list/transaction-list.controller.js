angular.module('bankingApp')
  .controller('TransactionListController', ['$scope', '$location', 'AdminService', 'ToastService',
    function ($scope, $location, AdminService, ToastService) {

      $scope.loading      = true;
      $scope.transactions = [];

      // ─── Pagination state ─────────────────────────────────────────────
      $scope.page          = 0;
      $scope.size          = 10;
      $scope.totalPages    = 0;
      $scope.totalElements = 0;

      // ─── Filter state ─────────────────────────────────────────────────
      $scope.filters = {
        username:      '',
        accountNumber: '',
        type:          '',
        startDate:     '',
        endDate:       ''
      };
      $scope.sortBy  = 'timestamp';
      $scope.sortDir = 'desc';

      // ─── Pagination helpers ───────────────────────────────────────────
      $scope.pages = function () {
        var arr = [];
        for (var i = 0; i < $scope.totalPages; i++) arr.push(i);
        return arr;
      };

      $scope.goToPage = function (p) {
        if (p < 0 || p >= $scope.totalPages) return;
        $scope.page = p;
        load();
      };

      $scope.applyFilters = function () {
        $scope.page = 0;
        load();
      };

      $scope.clearFilters = function () {
        $scope.filters = { username: '', accountNumber: '', type: '', startDate: '', endDate: '' };
        $scope.page = 0;
        load();
      };

      // ─── Style helpers ────────────────────────────────────────────────
      $scope.txRowClass = function (type) {
        switch (type) {
          case 'DEPOSIT':    return 'tx-row--credit';
          case 'WITHDRAWAL': return 'tx-row--debit';
          case 'TRANSFER':   return 'tx-row--transfer';
          default:           return '';
        }
      };

      $scope.txBadgeClass = function (type) {
        switch (type) {
          case 'DEPOSIT':    return 'tx-type-badge--credit';
          case 'WITHDRAWAL': return 'tx-type-badge--debit';
          case 'TRANSFER':   return 'tx-type-badge--transfer';
          default:           return '';
        }
      };

      $scope.txAmountClass = function (type) {
        switch (type) {
          case 'DEPOSIT':    return 'tx-amount--credit';
          case 'WITHDRAWAL': return 'tx-amount--debit';
          case 'TRANSFER':   return 'tx-amount--transfer';
          default:           return '';
        }
      };

      $scope.formatDate = function (timestamp) {
        if (!timestamp) return '—';
        var d = new Date(timestamp);
        return d.toLocaleDateString('en-PH', {
          year: 'numeric', month: 'short', day: 'numeric'
        }) + ' ' + d.toLocaleTimeString('en-PH', {
          hour: '2-digit', minute: '2-digit'
        });
      };

      $scope.viewTransaction = function (id) {
        $location.path('/admin/transactions/' + id);
      };

      // ─── Load ─────────────────────────────────────────────────────────
      function load() {
        $scope.loading = true;

        var params = {
          page:    $scope.page,
          size:    $scope.size,
          sortBy:  $scope.sortBy,
          sortDir: $scope.sortDir
        };

        if ($scope.filters.username)      params.username      = $scope.filters.username;
        if ($scope.filters.accountNumber) params.accountNumber = $scope.filters.accountNumber;
        if ($scope.filters.type)          params.type          = $scope.filters.type;
        if ($scope.filters.startDate)     params.startDate     = $scope.filters.startDate;
        if ($scope.filters.endDate) {
          // ng-model on <input type="date"> in AngularJS gives a Date object, not a string.
          // Use getFullYear/getMonth/getDate (local time) to avoid UTC offset shifting.
          var end = new Date($scope.filters.endDate);
          end.setDate(end.getDate() + 1);
          params.endDate = end.getFullYear() + '-' +
            String(end.getMonth() + 1).padStart(2, '0') + '-' +
            String(end.getDate()).padStart(2, '0');
        }

        AdminService.getAllTransactions(params)
          .then(function (page) {
            $scope.transactions  = page.content || [];
            $scope.totalPages    = page.totalPages || 0;
            $scope.totalElements = page.totalElements || 0;
          })
          .catch(function () {
            ToastService.show('Failed to load transactions.', 'error');
          })
          .finally(function () {
            $scope.loading = false;
          });
      }

      load();
    }
  ]);