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

              <!-- ── Customer Links ── -->
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

              <a class="nav-btn nav-btn--ghost" href="#!/history"
                 ng-if="!isAdmin"
                 ng-class="{ active: currentPath() === '/history' }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                History
              </a>

              <a class="nav-btn nav-btn--ghost" href="#!/requests"
                 ng-if="!isAdmin"
                 ng-class="{ active: currentPath() === '/requests' }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="17" x2="12" y2="17"/>
                </svg>
                Requests
              </a>

              <a class="nav-btn nav-btn--ghost" href="#!/profile"
                 ng-if="!isAdmin"
                 ng-class="{ active: currentPath() === '/profile' }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                Profile
              </a>

              <!-- ── Admin Links ── -->
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

              <a class="nav-btn nav-btn--ghost" href="#!/admin/accounts"
                 ng-if="isAdmin"
                 ng-class="{ active: currentPath().startsWith('/admin/accounts') }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
                Accounts
                
              </a>
              <a class="nav-btn nav-btn--ghost" href="#!/admin/users"
                 ng-if="isAdmin"
                 ng-class="{ active: currentPath().startsWith('/admin/users') }">
                <svg viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M4 20v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"></path>
                </svg>
                Users
              </a>

              <a class="nav-btn nav-btn--ghost" href="#!/admin/transactions"
                 ng-if="isAdmin"
                 ng-class="{ active: currentPath().startsWith('/admin/transactions') }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Transactions
              </a>

              <a class="nav-btn nav-btn--ghost" href="#!/admin/requests"
                 ng-if="isAdmin"
                 ng-class="{ active: currentPath().startsWith('/admin/requests') }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="17" x2="12" y2="17"/>
                </svg>
                Requests
              </a>

              <!-- ── User Info + Logout ── -->
              <div class="navbar-user">
                <span class="navbar-user-info">
                  <span class="navbar-username">{{ displayName }}</span>
                  <span class="navbar-role">{{ role }}</span>
                </span>
                <button class="nav-btn nav-btn--logout" ng-click="logout()">Logout</button>
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

          function syncNav() {
            var path = $location.path();
            scope.menuOpen    = false;
            scope.showNav     = hiddenRoutes.indexOf(path) === -1 && AuthService.isAuthenticated();
            scope.isAdmin     = AuthService.isAdmin();
            scope.displayName = AuthService.getDisplayName() || 'Guest';
            scope.role        = AuthService.getRole() || 'GUEST';
          }

          scope.$watch(function () { return $location.path(); }, syncNav);
          scope.$watch(function () { return AuthService.currentUser; }, syncNav);

          scope.logout = function () {
            AuthService.logout();
          };

        }
      };
    }
  ]);