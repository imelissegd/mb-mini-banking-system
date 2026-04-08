angular.module('bankingApp')
  .controller('MyRequestsController', ['$scope', '$http', 'APP_CONFIG', 'ToastService',
    function ($scope, $http, APP_CONFIG, ToastService) {

      var BASE = APP_CONFIG.apiBaseUrl;

      $scope.loading       = false;
      $scope.requests      = [];
      $scope.page          = 0;
      $scope.size          = 10;
      $scope.totalPages    = 0;
      $scope.totalElements = 0;
      $scope.statusFilter  = '';
      $scope.pageSizeOptions = [10, 25, 50];

      // ─── Badge helpers ─────────────────────────────────────────────────
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

      // ─── Pagination helpers ────────────────────────────────────────────
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

      // ─── Load ─────────────────────────────────────────────────────────
      function load() {
        $scope.loading = true;

        var params = {
          page:    $scope.page,
          size:    $scope.size,
          sortBy:  'createdAt',
          sortDir: 'desc'
        };

        if ($scope.statusFilter) params.status = $scope.statusFilter;

        $http.get(BASE + '/requests', { params: params })
          .then(function (res) {
            var page = res.data.data;
            $scope.requests      = page.content || [];
            $scope.totalPages    = page.totalPages || 0;
            $scope.totalElements = page.totalElements || 0;
          })
          .catch(function () {
            ToastService.show('Failed to load your requests.', 'error');
          })
          .finally(function () {
            $scope.loading = false;
          });
      }

      load();
    }
  ]);