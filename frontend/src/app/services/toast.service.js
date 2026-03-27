angular.module('bankingApp')
  .service('ToastService', ['$rootScope', '$timeout',
    function ($rootScope, $timeout) {

      var self      = this;
      var hideTimer = null;

      $rootScope.toast = {
        visible: false,
        message: '',
        type:    'info'
      };

      self.show = function (message, type, duration) {
        if (hideTimer) { $timeout.cancel(hideTimer); }
        $rootScope.toast.message = message || '';
        $rootScope.toast.type    = type    || 'info';
        $rootScope.toast.visible = true;
        hideTimer = $timeout(function () {
          $rootScope.toast.visible = false;
        }, duration || 3500);
      };

      self.hide = function () {
        if (hideTimer) { $timeout.cancel(hideTimer); }
        $rootScope.toast.visible = false;
      };

    }
  ]);