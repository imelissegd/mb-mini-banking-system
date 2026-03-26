/**
 * toast.service.js
 *
 * Usage in any controller:
 *   ToastService.show('Transfer successful!', 'success');
 *   ToastService.show('Invalid credentials.', 'error');
 *   ToastService.show('Loading...', 'info');
 *
 * Types: 'success' | 'error' | 'info' | 'warning'
 */
angular.module('bankingApp')
  .service('ToastService', ['$rootScope', '$timeout',
    function ($rootScope, $timeout) {

      var self = this;

      // Shared state that the toast directive watches
      $rootScope.toast = {
        visible: false,
        message: '',
        type: 'info'   // default
      };

      var hideTimer = null;

      /**
       * Show a toast message.
       * @param {string} message   Text to display
       * @param {string} type      'success' | 'error' | 'info' | 'warning'
       * @param {number} duration  Milliseconds before auto-hide (default: 3500)
       */
      self.show = function (message, type, duration) {
        // Cancel any existing timer so rapid calls don't collide
        if (hideTimer) {
          $timeout.cancel(hideTimer);
        }

        $rootScope.toast.message = message || '';
        $rootScope.toast.type    = type || 'info';
        $rootScope.toast.visible = true;

        var delay = duration || 3500;

        hideTimer = $timeout(function () {
          $rootScope.toast.visible = false;
        }, delay);
      };

      /** Manually dismiss the toast */
      self.hide = function () {
        if (hideTimer) {
          $timeout.cancel(hideTimer);
        }
        $rootScope.toast.visible = false;
      };

    }
  ]);