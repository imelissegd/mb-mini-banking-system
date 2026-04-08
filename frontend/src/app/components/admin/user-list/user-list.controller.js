angular.module('bankingApp')
  .controller('UserListController', ['$scope', '$location', 'AdminService', 'ToastService',
    function ($scope, $location, AdminService, ToastService) {

      $scope.loading   = true;
      $scope.users = [];
      $scope.busy      = {};   // tracks per-row toggle loading: { [id]: true/false }

      // ─── Pagination state ─────────────────────────────────────────────
      $scope.page          = 0;
      $scope.size          = 10;
      $scope.totalPages    = 0;
      $scope.totalElements = 0;
      $scope.pageSizeOptions = [10, 25, 50];

      // ─── Filter state ─────────────────────────────────────────────────
      $scope.filters = {
        username:  '',
        firstName: '',
        lastName:  ''
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

      // ─── Apply filters (reset to page 0) ─────────────────────────────
      $scope.applyFilters = function () {
        $scope.page = 0;
        load();
      };

      $scope.changeSize = function () {
        $scope.page = 0;
        load();
      };

      $scope.clearFilters = function () {
        $scope.filters = { username: '', firstName: '', lastName: '' };
        $scope.page = 0;
        load();
      };

      // ─── Navigate ─────────────────────────────────────────────────────
      $scope.viewUser = function (userId) {
        $location.path('/admin/users/' + userId);
      };

      $scope.goToCreate = function () {
        $location.path('/admin/users/new');
      };

      // ─── Toggle active/inactive ───────────────────────────────────────
      $scope.toggleActive = function (user) {
        $scope.busy[user.id] = true;
        AdminService.toggleUserActive(user.id)
          .then(function (updated) {
            user.active = updated.active;
            ToastService.show(
              'User ' + user.username + ' has been ' +
              (updated.active ? 'activated' : 'deactivated') + '.',
              'success'
            );
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message : 'Failed to update user status.';
            ToastService.show(msg, 'error');
          })
          .finally(function () {
            $scope.busy[user.id] = false;
          });
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

        if ($scope.filters.username)  params.username  = $scope.filters.username;
        if ($scope.filters.firstName) params.firstName = $scope.filters.firstName;
        if ($scope.filters.lastName)  params.lastName  = $scope.filters.lastName;

        AdminService.getAllUsers(params)
          .then(function (page) {
            $scope.users     = page.content || [];
            $scope.totalPages    = page.totalPages || 0;
            $scope.totalElements = page.totalElements || 0;
          })
          .catch(function () {
            ToastService.show('Failed to load users.', 'error');
          })
          .finally(function () {
            $scope.loading = false;
          });
      }

      load();
    }
  ]);