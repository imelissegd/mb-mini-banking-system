/**
 * admin.service.js
 * All HTTP calls for admin-only endpoints.
 */
angular.module('bankingApp')
  .service('AdminService', ['$http', 'APP_CONFIG',
    function ($http, APP_CONFIG) {

      var base = APP_CONFIG.apiBaseUrl + '/admin';
      var self = this;

      /** GET /api/admin/dashboard/summary */
      self.getDashboardSummary = function () {
        return $http.get(base + '/dashboard/summary');
      };

      /** GET /api/admin/users */
      self.getAllCustomers = function () {
        return $http.get(base + '/users');
      };

      /** GET /api/admin/users/:id */
      self.getCustomer = function (id) {
        return $http.get(base + '/users/' + id);
      };

      /** POST /api/admin/users */
      self.createCustomer = function (data) {
        return $http.post(base + '/users', data);
      };

      /** PUT /api/admin/users/:id */
      self.updateCustomer = function (id, data) {
        return $http.put(base + '/users/' + id, data);
      };

      /** POST /api/admin/users/:userId/accounts */
      self.provisionAccount = function (userId) {
        return $http.post(base + '/users/' + userId + '/accounts', {});
      };

      /** PUT /api/admin/users/:id/status  (activate / deactivate) */
      self.setCustomerStatus = function (id, isActive) {
        return $http.put(base + '/users/' + id + '/status', { isActive: isActive });
      };

    }
  ]);