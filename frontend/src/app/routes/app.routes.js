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

        .when('/requests', {
          templateUrl: 'src/app/components/requests/my-requests.html',
          controller:  'MyRequestsController',
          data: { requiresAuth: true }
        })

        .when('/admin', {
          templateUrl: 'src/app/components/admin/admin-dashboard/admin-dashboard.html',
          controller:  'AdminDashboardController',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/users', {
          templateUrl: 'src/app/components/admin/user-list/user-list.html',
          controller:  'UserListController',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/users/new', {
          templateUrl: 'src/app/components/admin/create-user/create-user.html',
          controller:  'CreateUserController',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/users/:id', {
          templateUrl: 'src/app/components/admin/user-detail/user-detail.html',
          controller:  'UserDetailController',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        .when('/admin/accounts', {
          templateUrl: 'src/app/components/admin/account-list/account-list.html',
          controller:  'AccountListController',
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

        if (!routeData) return;

      if (AuthService.isAuthenticated()) {
        if (routeData.requiresAdmin && !AuthService.isAdmin()) {
          $location.path('/dashboard');
        }
      } else {
        // Not logged in — bounce to login for any protected route
        if (routeData.requiresAuth) {
          $location.path('/login');
        }
      }
      });

    }
  ]);