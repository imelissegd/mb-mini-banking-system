angular.module('bankingApp')
  .controller('ProfileController', ['$scope', 'ProfileService', 'ToastService',
    function ($scope, ProfileService, ToastService) {

      // ─── State ────────────────────────────────────────────────────────
      $scope.loading    = true;
      $scope.editMode   = false;
      $scope.submitting = false;
      $scope.profile    = null;   // read-only display copy
      $scope.form       = {};     // editable working copy

      // ─── Load profile ─────────────────────────────────────────────────
      ProfileService.getMyProfile()
        .then(function (data) {
          $scope.profile = data;
        })
        .catch(function () {
          ToastService.show('Failed to load your profile. Please try again.', 'error');
        })
        .finally(function () {
          $scope.loading = false;
        });

      // ─── Enter edit mode ──────────────────────────────────────────────
      // Copy current profile into the form so edits don't mutate the display.
      $scope.startEdit = function () {
        $scope.form = {
          firstName:  $scope.profile.firstName,
          middleName: $scope.profile.middleName,
          lastName:   $scope.profile.lastName,
          suffix:     $scope.profile.suffix,
          email:      $scope.profile.email
        };
        $scope.editMode = true;
      };

      // ─── Cancel edit ──────────────────────────────────────────────────
      $scope.cancelEdit = function () {
        $scope.editMode = false;
        $scope.form     = {};
      };

      // ─── Submit update request ────────────────────────────────────────
      $scope.submitUpdate = function () {
        if (!$scope.form.firstName || !$scope.form.lastName || !$scope.form.email) {
          ToastService.show('First name, last name, and email are required.', 'error');
          return;
        }

        $scope.submitting = true;

        ProfileService.submitUpdateRequest({
          firstName:  $scope.form.firstName.trim(),
          middleName: $scope.form.middleName ? $scope.form.middleName.trim() : '',
          lastName:   $scope.form.lastName.trim(),
          suffix:     $scope.form.suffix ? $scope.form.suffix.trim() : '',
          email:      $scope.form.email.trim()
        })
          .then(function (res) {
            ToastService.show(
              res.message || 'Update request submitted. Pending admin approval.',
              'success'
            );
            // Reflect the locally submitted values in the display copy
            angular.extend($scope.profile, $scope.form);
            $scope.editMode = false;
            $scope.form     = {};
          })
          .catch(function (err) {
            var msg = (err && err.data && err.data.message)
              ? err.data.message
              : 'Failed to submit update request. Please try again.';
            ToastService.show(msg, 'error');
          })
          .finally(function () {
            $scope.submitting = false;
          });
      };

      // ─── Helper: full display name ────────────────────────────────────
      $scope.fullName = function () {
        if (!$scope.profile) return '';
        var parts = [
          $scope.profile.firstName,
          $scope.profile.middleName,
          $scope.profile.lastName,
          $scope.profile.suffix
        ];
        return parts.filter(Boolean).join(' ');
      };

    }
  ]);