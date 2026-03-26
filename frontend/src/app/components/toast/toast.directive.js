/**
 * toast.directive.js
 *
 * Usage: Place <bank-toast></bank-toast> once in index.html (already added in S-11).
 * The directive reads from $rootScope.toast (set by ToastService).
 */
angular.module('bankingApp')
  .directive('bankToast', ['ToastService',
    function (ToastService) {
      return {
        restrict: 'E',       // element: <bank-toast>
        template: `
          <div class="toast-container" ng-if="toast.visible" ng-class="'toast-' + toast.type">
            <span class="toast-message">{{ toast.message }}</span>
            <button class="toast-close" ng-click="dismissToast()">✕</button>
          </div>
        `,
        link: function (scope) {
          scope.dismissToast = function () {
            ToastService.hide();
          };
        }
      };
    }
  ]);