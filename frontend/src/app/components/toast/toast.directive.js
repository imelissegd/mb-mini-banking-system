angular.module('bankingApp')
  .directive('bankToast', ['$rootScope', 'ToastService',
    function ($rootScope, ToastService) {
      return {
        restrict: 'E',
        template: `
          <div ng-show="$root.toast.visible"
               style="position:fixed;bottom:28px;right:28px;z-index:9999;
                      padding:14px 20px;border-radius:8px;color:#fff;
                      font-size:14px;min-width:280px;max-width:420px;
                      display:flex;align-items:center;gap:12px;
                      box-shadow:0 6px 16px rgba(0,0,0,0.2);"
               ng-style="{ background: $root.toast.type === 'success' ? '#28a745' :
                                        $root.toast.type === 'error'   ? '#dc3545' :
                                        $root.toast.type === 'warning' ? '#ffc107' : '#1a237e' }">
            <span style="flex:1;">{{ $root.toast.message }}</span>
            <button ng-click="dismiss()"
                    style="background:transparent;border:none;color:inherit;
                           cursor:pointer;font-size:18px;">✕</button>
          </div>
        `,
        link: function (scope) {
          scope.dismiss = function () {
            ToastService.hide();
          };
        }
      };
    }
  ]);