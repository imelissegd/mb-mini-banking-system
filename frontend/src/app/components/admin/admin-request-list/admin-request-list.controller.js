angular.module('bankingApp')
  .controller('RequestListController', ['$scope', '$location', 'AdminService', 'ToastService',
    function ($scope, $location, AdminService, ToastService) {

      $scope.loading      = true;
      $scope.requests     = [];
      $scope.statusFilter = '';   // '' = All

      // ─── Client-side status filter predicate ──────────────────────────
      $scope.filterByStatus = function (req) {
        if (!$scope.statusFilter) return true;
        return req.status === $scope.statusFilter;
      };

      // ─── Status badge class ───────────────────────────────────────────
      $scope.statusBadgeClass = function (status) {
        switch (status) {
          case 'PENDING':  return 'badge--pending';
          case 'APPROVED': return 'badge--active';
          case 'REJECTED': return 'badge--inactive';
          default:         return '';
        }
      };

      // ─── Type badge class ─────────────────────────────────────────────
      $scope.typeBadgeClass = function (type) {
        switch (type) {
          case 'OPEN_ACCOUNT': return 'req-type-badge--account';
          case 'EDIT_PROFILE': return 'req-type-badge--profile';
          default:             return '';
        }
      };

      // ─── Format type label ────────────────────────────────────────────
      $scope.formatType = function (type) {
        switch (type) {
          case 'OPEN_ACCOUNT': return 'Open Account';
          case 'EDIT_PROFILE': return 'Edit Profile';
          default:             return type;
        }
      };

      // ─── Format ISO timestamp ─────────────────────────────────────────
      $scope.formatDate = function (timestamp) {
        if (!timestamp) return '—';
        var d = new Date(timestamp);
        return d.toLocaleDateString('en-PH', {
          year:  'numeric',
          month: 'short',
          day:   'numeric'
        }) + ' ' + d.toLocaleTimeString('en-PH', {
          hour:   '2-digit',
          minute: '2-digit'
        });
      };

      // ─── Navigate to request detail ───────────────────────────────────
      $scope.viewRequest = function (requestId) {
        $location.path('/admin/requests/' + requestId);
      };

      // ─── Load all requests on init ────────────────────────────────────
      AdminService.getAllRequests()
        .then(function (data) {
          $scope.requests = data;
        })
        .catch(function () {
          ToastService.show('Failed to load requests.', 'error');
        })
        .finally(function () {
          $scope.loading = false;
        });

    }
  ]);