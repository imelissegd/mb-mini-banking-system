angular.module('bankingApp')
  .config(['$routeProvider',
    function ($routeProvider) {

      $routeProvider

        // ─── Public ───────────────────────────────────────────────────────
        .when('/login', {
          templateUrl: 'src/app/components/login/login.html',
          controller:  'LoginController'
        })

        .when('/register', {
          templateUrl: 'src/app/components/register/register.html',
          controller:  'RegisterController'
        })

        // ─── Customer ─────────────────────────────────────────────────────
        .when('/dashboard', {
          templateUrl: 'src/app/components/dashboard/dashboard.html',
          controller:  'DashboardController',
          data: { requiresAuth: true }
        })

        .when('/transfer', {
          templateUrl: 'src/app/components/transfer/transfer.html',
          controller:  'TransferController',
          data: { requiresAuth: true }
        })

        .when('/deposit-withdraw', {
          templateUrl: 'src/app/components/transfer/deposit-withdraw.html',
          controller:  'DepositWithdrawController',
          data: { requiresAuth: true }
        })

        .when('/history', {
          templateUrl: 'src/app/components/history/history.html',
          controller:  'HistoryController',
          data: { requiresAuth: true }
        })

        .when('/profile', {
          templateUrl: 'src/app/components/profile/profile.html',
          controller:  'ProfileController',
          data: { requiresAuth: true }
        })

        .when('/open-account', {
          templateUrl: 'src/app/components/open-account/open-account.html',
          controller:  'OpenAccountController',
          data: { requiresAuth: true }
        })

        // ─── Admin ────────────────────────────────────────────────────────
        .when('/admin', {
          templateUrl: 'src/app/components/admin/admin-dashboard/admin-dashboard.html',
          controller:  'AdminDashboardController',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/customers', {
          templateUrl: 'src/app/components/admin/customer-list/customer-list.html',
          controller:  'CustomerListController',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/customers/new', {
          templateUrl: 'src/app/components/admin/create-customer/create-customer.html',
          controller:  'CreateCustomerController',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/customers/:id', {
          templateUrl: 'src/app/components/admin/customer-detail/customer-detail.html',
          controller:  'CustomerDetailController',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/transactions', {
          templateUrl: 'src/app/components/admin/transaction-list/transaction-list.html',
          controller:  'TransactionListController',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/transactions/:id', {
          templateUrl: 'src/app/components/admin/transaction-detail/transaction-detail.html',
          controller:  'TransactionDetailController',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .otherwise({ redirectTo: '/login' });

    }
  ])

  // ─── Route Guard ──────────────────────────────────────────────────────────
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