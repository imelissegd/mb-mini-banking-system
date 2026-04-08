angular.module('bankingApp')
  .controller('AccountListController', ['$scope', '$location', 'AdminService', 'ToastService',
    function ($scope, $location, AdminService, ToastService) {

      $scope.loading  = true;
      $scope.accounts = [];
      $scope.busy     = {};   // tracks per-row status change: { [id]: true/false }

      // ─── Pagination state ─────────────────────────────────────────────
      $scope.page          = 0;
      $scope.size          = 10;
      $scope.totalPages    = 0;
      $scope.totalElements = 0;
      $scope.pageSizeOptions = [10, 25, 50];

      // ─── Filter state ─────────────────────────────────────────────────
      $scope.filters = {
        username:      '',
        accountNumber: '',
        accountType:   '',
        status:        ''
      };
      $scope.sortBy  = 'createdAt';
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

      $scope.changeSize = function () {
        $scope.page = 0;
        load();
      };

      $scope.clearFilters = function () {
        $scope.filters = { username: '', accountNumber: '', accountType: '', status: '' };
        $scope.page = 0;
        load();
      };

      // ─── Status badge ─────────────────────────────────────────────────
      $scope.statusBadgeClass = function (status) {
        switch (status) {
          case 'OPEN':   return 'badge--active';
          case 'FROZEN': return 'badge--frozen';
          case 'CLOSED': return 'badge--inactive';
          default:       return '';
        }
      };

      $scope.formatDate = function (ts) {
        if (!ts) return '—';
        var d = new Date(ts);
        return d.toLocaleDateString('en-PH', {
          year: 'numeric', month: 'short', day: 'numeric'
        });
      };

      // ─── Change account status ────────────────────────────────────────
      $scope.changeStatus = function (account, newStatus) {
        $scope.busy[account.id] = true;
        AdminService.changeAccountStatus(account.accountNumber, newStatus)
          .then(function (updated) {
            account.status = updated.status;
            ToastService.show(
              'Account ' + account.accountNumber + ' status changed to ' + updated.status + '.',
              'success'
            );
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message : 'Failed to change account status.';
            ToastService.show(msg, 'error');
          })
          .finally(function () {
            $scope.busy[account.id] = false;
          });
      };

      // ─── Toggle freeze / unfreeze ─────────────────────────────────────
      // FROZEN → OPEN, anything else → FROZEN
      $scope.toggleFreeze = function (account) {
        var next = account.status === 'FROZEN' ? 'OPEN' : 'FROZEN';
        $scope.changeStatus(account, next);
      };

      // ─── Toggle open / close ──────────────────────────────────────────
      // CLOSED → OPEN, anything else → CLOSED
      $scope.toggleClose = function (account) {
        var next = account.status === 'CLOSED' ? 'OPEN' : 'CLOSED';
        $scope.changeStatus(account, next);
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
        if ($scope.filters.accountType)   params.accountType   = $scope.filters.accountType;
        if ($scope.filters.status)        params.status        = $scope.filters.status;

        AdminService.getAllAccounts(params)
          .then(function (page) {
            $scope.accounts      = page.content || [];
            $scope.totalPages    = page.totalPages || 0;
            $scope.totalElements = page.totalElements || 0;
          })
          .catch(function () {
            ToastService.show('Failed to load accounts.', 'error');
          })
          .finally(function () {
            $scope.loading = false;
          });
      }

      load();
    }
  ]);