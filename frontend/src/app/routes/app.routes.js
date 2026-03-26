/**
 * app.routes.js
 *
 * Defines all application routes and enforces authentication / role guards
 * using $rootScope.$on('$routeChangeStart').
 *
 * Route data properties:
 *   requiresAuth {boolean} — redirect to /login if not authenticated
 *   requiresAdmin {boolean} — redirect to /dashboard if not ADMIN role
 */
angular.module('bankingApp')

  // ─── Route Definitions ──────────────────────────────────────────────────────

  .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

      $routeProvider

        // Public routes
        .when('/login', {
          templateUrl: 'src/app/components/login/login.html',
          controller:  'LoginController',
          controllerAs: 'vm'
        })

        .when('/register', {
          templateUrl: 'src/app/components/register/register.html',
          controller:  'RegisterController',
          controllerAs: 'vm'
        })

        // Customer protected routes
        .when('/dashboard', {
          templateUrl: 'src/app/components/dashboard/dashboard.html',
          controller:  'DashboardController',
          controllerAs: 'vm',
          data: { requiresAuth: true }
        })

        .when('/transfer', {
          templateUrl: 'src/app/components/transfer/transfer.html',
          controller:  'TransferController',
          controllerAs: 'vm',
          data: { requiresAuth: true }
        })

        .when('/history', {
          templateUrl: 'src/app/components/history/history.html',
          controller:  'HistoryController',
          controllerAs: 'vm',
          data: { requiresAuth: true }
        })

        // Admin protected routes
        .when('/admin', {
          templateUrl: 'src/app/components/admin/admin-dashboard/admin-dashboard.html',
          controller:  'AdminDashboardController',
          controllerAs: 'vm',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/customers', {
          templateUrl: 'src/app/components/admin/customer-list/customer-list.html',
          controller:  'CustomerListController',
          controllerAs: 'vm',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/customers/:id', {
          templateUrl: 'src/app/components/admin/customer-detail/customer-detail.html',
          controller:  'CustomerDetailController',
          controllerAs: 'vm',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        // Default redirect
        .otherwise({ redirectTo: '/login' });

      // Optional: use HTML5 history API (remove # from URLs)
      // Requires server-side redirect config — leave as hash mode for dev
      // $locationProvider.html5Mode(true);
    }
  ])

  // ─── Route Guard ────────────────────────────────────────────────────────────

  .run(['$rootScope', '$location', 'AuthService',
    function ($rootScope, $location, AuthService) {

      /**
       * Fires before every route change.
       * next.$$route.data contains the route's data object (if defined).
       */
      $rootScope.$on('$routeChangeStart', function (event, next) {
        // next.$$route may be undefined when navigating to a non-matched route
        var routeData = next && next.$$route && next.$$route.data;

        if (!routeData) return; // public or unguarded route — allow

        // Check authentication requirement
        if (routeData.requiresAuth && !AuthService.isAuthenticated()) {
          $location.path('/login');
          return;
        }

        // Check admin role requirement
        if (routeData.requiresAdmin && !AuthService.isAdmin()) {
          $location.path('/dashboard');
          return;
        }
      });

    }
  ]);