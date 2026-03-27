angular.module('bankingApp')
  .config(['$routeProvider',
    function ($routeProvider) {

      $routeProvider

        .when('/login', {
          templateUrl:  'src/app/components/login/login.html',
          controller:   'LoginController',
          controllerAs: 'vm'
        })

        .when('/register', {
          templateUrl:  'src/app/components/register/register.html',
          controller:   'RegisterController',
          controllerAs: 'vm'
        })

        .when('/dashboard', {
          templateUrl:  'src/app/components/dashboard/dashboard.html',
          controller:   'DashboardController',
          controllerAs: 'vm'
          // data: { requiresAuth: true }
        })

        .when('/transfer', {
          templateUrl:  'src/app/components/transfer/transfer.html',
          controller:   'TransferController',
          controllerAs: 'vm'
          // data: { requiresAuth: true }
        })

        .when('/history', {
          templateUrl:  'src/app/components/history/history.html',
          controller:   'HistoryController',
          controllerAs: 'vm'
          // data: { requiresAuth: true }
        })

        .when('/admin', {
          templateUrl:  'src/app/components/admin/admin-dashboard/admin-dashboard.html',
          controller:   'AdminDashboardController',
          controllerAs: 'vm'
          // data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/customers', {
          templateUrl:  'src/app/components/admin/customer-list/customer-list.html',
          controller:   'CustomerListController',
          controllerAs: 'vm'
          // data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/customers/:id', {
          templateUrl:  'src/app/components/admin/customer-detail/customer-detail.html',
          controller:   'CustomerDetailController',
          controllerAs: 'vm'
          // data: { requiresAuth: true, requiresAdmin: true }
        })

        .otherwise({ redirectTo: '/login' });

    }
  ])

  // ─── Route Guard ──────────────────────────────────────────────────────────
  // Inactive until data blocks above are uncommented
  .run(['$rootScope', '$location', 'AuthService',
    function ($rootScope, $location, AuthService) {

      $rootScope.$on('$routeChangeStart', function (event, next) {
        var routeData = next && next.$$route && next.$$route.data;

        // No data block = public route = allow through
        if (!routeData) return;

        // Not logged in → go to login
        if (routeData.requiresAuth && !AuthService.isAuthenticated()) {
          $location.path('/login');
          return;
        }

        // Logged in but not admin → go to dashboard
        if (routeData.requiresAdmin && !AuthService.isAdmin()) {
          $location.path('/dashboard');
          return;
        }
      });

    }
  ]);