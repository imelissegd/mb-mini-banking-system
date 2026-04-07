angular.module('bankingApp')
  .controller('HistoryController', ['$scope', '$http', 'APP_CONFIG', 'ToastService',
    function ($scope, $http, APP_CONFIG, ToastService) {

      var BASE = APP_CONFIG.apiBaseUrl;

      $scope.loading      = true;
      $scope.transactions = [];

      // ─── Pagination state ─────────────────────────────────────────────
      $scope.page          = 0;
      $scope.size          = 10;
      $scope.totalPages    = 0;
      $scope.totalElements = 0;

      // ─── Filter state ─────────────────────────────────────────────────
      $scope.filters = {
        accountNumber: '',
        type:          '',
        startDate:     '',
        endDate:       ''
      };
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
        $scope.filters = { accountNumber: '', type: '', startDate: '', endDate: '' };
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

      function toDateString(val) {
          if (!val) return '';
          if (val instanceof Date) return val.toLocaleDateString('en-CA'); 
          return val; 
      }

      // ─── Load ─────────────────────────────────────────────────────────
      function load() {
        $scope.loading = true;

        var params = {
          page:    $scope.page,
          size:    $scope.size,
          sortBy:  'timestamp',
          sortDir: $scope.sortDir
        };

        if ($scope.filters.accountNumber) params.accountNumber = $scope.filters.accountNumber;
        if ($scope.filters.type)          params.type          = $scope.filters.type;
        if ($scope.filters.startDate)     params.startDate     = toDateString($scope.filters.startDate);
        if ($scope.filters.endDate)       params.endDate       = toDateString($scope.filters.endDate);

        $http.get(BASE + '/transactions', { params: params })
          .then(function (res) {
            var page = res.data.data;
            $scope.transactions  = page.content || [];
            $scope.totalPages    = page.totalPages || 0;
            $scope.totalElements = page.totalElements || 0;
          })
          .catch(function () {
            ToastService.show('Failed to load transaction history.', 'error');
          })
          .finally(function () {
            $scope.loading = false;
          });
      }

      load();
    }
  ]);