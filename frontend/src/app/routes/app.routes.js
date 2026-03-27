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
        })

        .when('/transfer', {
          templateUrl:  'src/app/components/transfer/transfer.html',
          controller:   'TransferController',
          controllerAs: 'vm'
        })

        .when('/history', {
          templateUrl:  'src/app/components/history/history.html',
          controller:   'HistoryController',
          controllerAs: 'vm'
        })

        .when('/admin', {
          templateUrl:  'src/app/components/admin/admin-dashboard/admin-dashboard.html',
          controller:   'AdminDashboardController',
          controllerAs: 'vm'
        })

        .when('/admin/customers', {
          templateUrl:  'src/app/components/admin/customer-list/customer-list.html',
          controller:   'CustomerListController',
          controllerAs: 'vm'
        })

        .when('/admin/customers/:id', {
          templateUrl:  'src/app/components/admin/customer-detail/customer-detail.html',
          controller:   'CustomerDetailController',
          controllerAs: 'vm'
        })

        .otherwise({ redirectTo: '/login' });

    }
  ])

;