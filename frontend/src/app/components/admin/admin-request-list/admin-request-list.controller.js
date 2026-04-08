angular.module('bankingApp')
  .controller('RequestListController', ['$scope', '$location', 'AdminService', 'ToastService',
    function ($scope, $location, AdminService, ToastService) {

      $scope.loading  = true;
      $scope.requests = [];

      // ─── Pagination state ─────────────────────────────────────────────
      $scope.page          = 0;
      $scope.size          = 10;
      $scope.totalPages    = 0;
      $scope.totalElements = 0;
      $scope.pageSizeOptions = [10, 25, 50];


      // ─── Filter state ─────────────────────────────────────────────────
      $scope.statusFilter = '';
      $scope.sortBy       = 'createdAt';
      $scope.sortDir      = 'desc';

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

      $scope.applyFilter = function () {
        $scope.page = 0;
        load();
      };

      $scope.changeSize = function () {
        $scope.page = 0;
        load();
      };

      // ─── Badge helpers ────────────────────────────────────────────────
      $scope.statusBadgeClass = function (status) {
        switch (status) {
          case 'PENDING':  return 'badge--pending';
          case 'APPROVED': return 'badge--active';
          case 'REJECTED': return 'badge--inactive';
          default:         return '';
        }
      };

      $scope.typeBadgeClass = function (type) {
        switch (type) {
          case 'OPEN_ACCOUNT': return 'req-type-badge--account';
          case 'EDIT_PROFILE': return 'req-type-badge--profile';
          default:             return '';
        }
      };

      $scope.formatType = function (type) {
        switch (type) {
          case 'OPEN_ACCOUNT': return 'Open Account';
          case 'EDIT_PROFILE': return 'Edit Profile';
          default:             return type;
        }
      };

      $scope.formatDate = function (ts) {
        if (!ts) return '—';
        var d = new Date(ts);
        return d.toLocaleDateString('en-PH', {
          year: 'numeric', month: 'short', day: 'numeric'
        }) + ' ' + d.toLocaleTimeString('en-PH', {
          hour: '2-digit', minute: '2-digit'
        });
      };

      $scope.viewRequest = function (id) {
        $location.path('/admin/requests/' + id);
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

        if ($scope.statusFilter) params.status = $scope.statusFilter;

        AdminService.getAllRequests(params)
          .then(function (page) {
            $scope.requests      = page.content || [];
            $scope.totalPages    = page.totalPages || 0;
            $scope.totalElements = page.totalElements || 0;
          })
          .catch(function () {
            ToastService.show('Failed to load requests.', 'error');
          })
          .finally(function () {
            $scope.loading = false;
          });
      }

      load();
    }
  ]);