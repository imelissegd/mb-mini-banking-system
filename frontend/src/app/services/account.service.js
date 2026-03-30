angular.module('bankingApp')
  .service('AccountService', ['$http', '$q', 'APP_CONFIG',
    function ($http, $q, APP_CONFIG) {

      var self = this;

      // ─── MOCK FLAG ──────────────────────────────────────────────────────
      // Set to false when the backend is ready.
      var MOCK = true;

      // ─── getMyAccounts ───────────────────────────────────────────────────
      // Returns the logged-in customer's bank accounts.
      self.getMyAccounts = function () {
        if (MOCK) {
          // MOCK
          return $q.resolve([
            { id: 1, accountNumber: '1000-0001', accountType: 'CHECKING', balance: 5000.00,  status: 'ACTIVE' },
            { id: 2, accountNumber: '1000-0002', accountType: 'SAVINGS',  balance: 12000.00, status: 'ACTIVE' }
          ]);
          // END MOCK
        }

        // REAL
        return $http.get(APP_CONFIG.apiBaseUrl + '/customer/accounts')
          .then(function (res) { return res.data; });
      };

      // ─── openAccount ─────────────────────────────────────────────────────
      // Opens a new account of the given type for the logged-in customer.
      self.openAccount = function (accountType) {
        if (MOCK) {
          // MOCK
          return $q.resolve({
            id:            3,
            accountNumber: '1000-0003',
            accountType:   accountType,
            balance:       0,
            status:        'ACTIVE'
          });
          // END MOCK
        }

        // REAL
        return $http.post(APP_CONFIG.apiBaseUrl + '/customer/accounts', { accountType: accountType })
          .then(function (res) { return res.data; });
      };

    }
  ]);