angular.module('bankingApp')
  .config(['$routeProvider',
    function ($routeProvider) {

      $routeProvider

        .when('/login', {
          templateUrl: 'src/app/components/login/login.html',
          controller:  'LoginController'
        })

        .when('/register', {
          templateUrl: 'src/app/components/register/register.html',
          controller:  'RegisterController'
        })

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

        .when('/admin/requests', {
          templateUrl: 'src/app/components/admin/admin-request-list/admin-request-list.html',
          controller:  'RequestListController',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/requests/:id', {
          templateUrl: 'src/app/components/admin/admin-request-detail/admin-request-detail.html',
          controller:  'RequestDetailController',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .otherwise({ redirectTo: '/login' });

    }
  ])

  .run(['$rootScope', '$location', 'AuthService',
    function ($rootScope, $location, AuthService) {

      $rootScope.$on('$routeChangeStart', function (event, next) {
        var routeData = next && next.$$route && next.$$route.data;

        // Public route — always allow through
        if (!routeData) return;

        // currentUser in memory — synchronous check, no HTTP call
        if (AuthService.isAuthenticated()) {
          if (routeData.requiresAdmin && !AuthService.isAdmin()) {
            $location.path('/dashboard');
          }
          return;
        }

        // currentUser is null (hard reload / fresh tab).
        // Cannot determine cookie validity synchronously — let the route render.
        // The controller's loadCurrentUser() will recover the session.
        // authInterceptor handles 401 and redirects to /login automatically.
      });

    }
  ]);