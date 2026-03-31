angular.module('bankingApp')
  .controller('RequestDetailController', ['$scope', '$routeParams', '$location', 'AdminService', 'ToastService',
    function ($scope, $routeParams, $location, AdminService, ToastService) {

      var requestId = $routeParams.id;

      $scope.loading      = true;
      $scope.request      = null;
      $scope.error        = false;
      $scope.resolveBusy  = false;
      $scope.payload      = null;   // parsed once, stored here — no function call in template

      // Resolve form state
      $scope.showResolveForm = false;
      $scope.resolveAction   = '';   // 'APPROVED' | 'REJECTED'
      $scope.resolveRemarks  = '';

      // ─── Navigation ───────────────────────────────────────────────────
      $scope.goBack = function () {
        $location.path('/admin/requests');
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

      // ─── Type label ───────────────────────────────────────────────────
      $scope.formatType = function (type) {
        switch (type) {
          case 'OPEN_ACCOUNT': return 'Open Account';
          case 'EDIT_PROFILE': return 'Edit Profile';
          default:             return type;
        }
      };

      // ─── Format ISO timestamp ──────────────────────────────────────────
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

      // ─── Parse payload once and store on scope ─────────────────────────
      // Do NOT call JSON.parse() from the template — it returns a new object
      // every digest cycle and causes an infinite digest (infdig) error.
      function parsePayload(request) {
        if (!request || !request.payload) {
          $scope.payload = null;
          return;
        }
        try {
          $scope.payload = JSON.parse(request.payload);
        } catch (e) {
          $scope.payload = null;
        }
      }

      // ─── Open resolve form ────────────────────────────────────────────
      $scope.openResolve = function (action) {
        $scope.resolveAction   = action;
        $scope.resolveRemarks  = '';
        $scope.showResolveForm = true;
      };

      $scope.cancelResolve = function () {
        $scope.showResolveForm = false;
        $scope.resolveAction   = '';
        $scope.resolveRemarks  = '';
      };

      // ─── Submit resolve ───────────────────────────────────────────────
      // PATCH /api/admin/requests/:requestId/resolve
      // Body: { status: 'APPROVED'|'REJECTED', remarks: string }
      // BE requires remarks when rejecting; send empty string (not null)
      // for approvals to avoid validation errors.
      $scope.submitResolve = function () {
        if ($scope.resolveAction === 'REJECTED' && !$scope.resolveRemarks.trim()) {
          ToastService.show('Remarks are required when rejecting a request.', 'error');
          return;
        }

        $scope.resolveBusy = true;

        AdminService.resolveRequest(requestId, {
          status:  $scope.resolveAction,
          remarks: $scope.resolveRemarks.trim() || ''   // send '' not null to avoid BE validation error
        })
          .then(function (updated) {
            $scope.request = updated;
            parsePayload(updated);
            $scope.showResolveForm = false;
            ToastService.show(
              'Request ' + updated.status.toLowerCase() + ' successfully.',
              'success'
            );
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message
              : 'Failed to resolve request.';
            ToastService.show(msg, 'error');
          })
          .finally(function () {
            $scope.resolveBusy = false;
          });
      };

      // ─── Load request on init ──────────────────────────────────────────
      AdminService.getRequest(requestId)
        .then(function (data) {
          $scope.request = data;
          parsePayload(data);
        })
        .catch(function () {
          $scope.error = true;
          ToastService.show('Failed to load request.', 'error');
        })
        .finally(function () {
          $scope.loading = false;
        });

    }
  ]);