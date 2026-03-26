/**
 * nav.directive.js
 *
 * Usage: <bank-nav></bank-nav> in index.html (already placed in S-11)
 *
 * Hides itself on /login and /register.
 * Shows admin links if user role is ADMIN.
 * Decodes JWT using AuthService to display the user's name.
 */
angular.module('bankingApp')
  .directive('bankNav', ['AuthService', '$location',
    function (AuthService, $location) {
      return {
        restrict: 'E',
        template: `
          <nav class="navbar" ng-if="showNav">
            <div class="navbar-brand">
              🏦 Mini Bank
            </div>

            <ul class="navbar-links">
              <!-- Customer links -->
              <li ng-if="!isAdmin">
                <a href="#!/dashboard"
                   ng-class="{ active: currentPath() === '/dashboard' }">Dashboard</a>
              </li>
              <li ng-if="!isAdmin">
                <a href="#!/transfer"
                   ng-class="{ active: currentPath() === '/transfer' }">Transfer</a>
              </li>
              <li ng-if="!isAdmin">
                <a href="#!/history"
                   ng-class="{ active: currentPath() === '/history' }">History</a>
              </li>

              <!-- Admin links -->
              <li ng-if="isAdmin">
                <a href="#!/admin"
                   ng-class="{ active: currentPath() === '/admin' }">Dashboard</a>
              </li>
              <li ng-if="isAdmin">
                <a href="#!/admin/customers"
                   ng-class="{ active: currentPath() === '/admin/customers' }">Customers</a>
              </li>
            </ul>

            <div class="navbar-user">
              <span style="margin-right:12px;">👤 {{ displayName }}</span>
              <button class="btn btn-danger" style="padding:6px 14px;font-size:13px;"
                      ng-click="logout()">Logout</button>
            </div>
          </nav>
        `,
        link: function (scope) {

          // ─── Reactive properties ─────────────────────────────────────────

          var hiddenRoutes = ['/login', '/register'];

          scope.currentPath = function () {
            return $location.path();
          };

          // Show navbar only when authenticated and not on public routes
          scope.$watch(
            function () { return $location.path(); },
            function (path) {
              var onPublicRoute = hiddenRoutes.indexOf(path) !== -1;
              scope.showNav    = !onPublicRoute && AuthService.isAuthenticated();
              scope.isAdmin    = AuthService.isAdmin();
              scope.displayName = AuthService.getDisplayName();
            }
          );

          // ─── Actions ─────────────────────────────────────────────────────

          scope.logout = function () {
            AuthService.logout();
          };

        }
      };
    }
  ]);