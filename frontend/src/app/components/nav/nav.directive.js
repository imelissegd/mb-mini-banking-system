angular.module('bankingApp')
  .directive('bankNav', ['AuthService', '$location',
    function (AuthService, $location) {
      return {
        restrict: 'E',
        template: `
          <nav class="navbar" ng-if="showNav">

            <!-- Brand -->
            <a class="navbar-brand" href="#!/">
              <span class="navbar-logo">MB<span class="navbar-logo-accent">Bank</span></span>
              <span class="navbar-tagline">Mini Banking System</span>
            </a>

            <!-- Nav Links + User -->
            <div class="navbar-actions" ng-class="{ 'navbar-actions--open': menuOpen }">

              <!-- Customer Links -->
              <a class="nav-btn nav-btn--ghost" href="#!/dashboard"
                 ng-if="!isAdmin"
                 ng-class="{ active: currentPath() === '/dashboard' }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                Dashboard
              </a>

              <a class="nav-btn nav-btn--ghost" href="#!/transfer"
                 ng-if="!isAdmin"
                 ng-class="{ active: currentPath() === '/transfer' }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
                Transfer
              </a>

              <a class="nav-btn nav-btn--ghost" href="#!/history"
                 ng-if="!isAdmin"
                 ng-class="{ active: currentPath() === '/history' }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                History
              </a>

              <!-- Admin Links -->
              <a class="nav-btn nav-btn--ghost" href="#!/admin"
                 ng-if="isAdmin"
                 ng-class="{ active: currentPath() === '/admin' }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                Dashboard
              </a>

              <a class="nav-btn nav-btn--ghost" href="#!/admin/customers"
                 ng-if="isAdmin"
                 ng-class="{ active: currentPath() === '/admin/customers' }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="16" y1="11" x2="22" y2="11"/>
                </svg>
                Customers
              </a>

              <!-- User Info + Logout -->
              <div class="navbar-user">
                <span class="navbar-user-info">
                  <span class="navbar-username">{{ displayName }}</span>
                  <span class="navbar-role">{{ role }}</span>
                </span>

                <!-- Logout disabled — wire up in C-04 -->
                <button class="nav-btn nav-btn--logout" disabled title="Implement in C-04">
                  Logout
                </button>

                <!-- REAL — uncomment in C-04 -->
                <!-- <button class="nav-btn nav-btn--logout" ng-click="logout()">Logout</button> -->
              </div>

            </div>

            <!-- Hamburger -->
            <button class="navbar-hamburger"
                    ng-click="toggleMenu()"
                    ng-class="{ 'is-open': menuOpen }"
                    aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </button>

          </nav>
        `,
        link: function (scope) {

          var hiddenRoutes = ['/login', '/register'];

          scope.menuOpen = false;

          scope.currentPath = function () {
            return $location.path();
          };

          scope.toggleMenu = function () {
            scope.menuOpen = !scope.menuOpen;
          };

          scope.$watch(
            function () { return $location.path(); },
            function (path) {
              scope.menuOpen = false; // close menu on navigation

              // TEMP: always show navbar for independent testing
              // REAL: replace with line below when backend is ready
              scope.showNav     = true;
              // scope.showNav  = hiddenRoutes.indexOf(path) === -1 && AuthService.isAuthenticated();

              scope.isAdmin     = AuthService.isAdmin();
              scope.displayName = AuthService.getDisplayName() || 'Guest';
              scope.role        = AuthService.getRole() || 'GUEST';
            }
          );

          // scope.logout = function () {
          //   AuthService.logout();
          // };

        }
      };
    }
  ]);