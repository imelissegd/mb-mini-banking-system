angular.module('bankingApp')
  .service('AccountService', ['$http', '$q', 'APP_CONFIG',
    function ($http, $q, APP_CONFIG) {

      var self = this;

      // ─── MOCK FLAGS ──────────────────────────────────────────────────────
      var MOCK_GET_ACCOUNTS  = false;  // GET  /accounts  ← C-03: wired
      var MOCK_OPEN_ACCOUNT  = false;   // POST /requests/open-account

      // ─── getMyAccounts ───────────────────────────────────────────────────
      // GET /api/accounts
      // Returns a Spring Page — actual array is at res.data.data.content.
      // authInterceptor attaches withCredentials: true automatically.
      //
      // BE response shape:
      // {
      //   success: true,
      //   data: {
      //     content: [ { id, accountNumber, accountType, balance, status, createdAt, ownerName } ],
      //     totalElements, totalPages, ...
      //   }
      // }
      //
      // ⚠ status values from BE are 'OPEN' / 'INACTIVE' — not 'ACTIVE'.
      //   Dashboard badge checks must use 'OPEN', not 'ACTIVE'.
      self.getMyAccounts = function () {
        if (MOCK_GET_ACCOUNTS) {
          // MOCK
          return $q.resolve([
            { id: 1, accountNumber: '1000-0001', accountType: 'CHECKING', balance: 5000.00,  status: 'OPEN' },
            { id: 2, accountNumber: '1000-0002', accountType: 'SAVINGS',  balance: 12000.00, status: 'OPEN' }
          ]);
          // END MOCK
        }

        // REAL
        return $http.get(APP_CONFIG.apiBaseUrl + '/accounts')
          .then(function (res) {
            // res.data       → ApiResponse
            // res.data.data  → Spring Page
            // res.data.data.content → BankAccountResponse[]
            return res.data.data.content || [];
          });
      };

      // ─── openAccount ─────────────────────────────────────────────────────
      // POST /api/requests/open-account
      // Submits an open-account request for admin approval (not instant).
      self.openAccount = function (accountType) {
        if (MOCK_OPEN_ACCOUNT) {
          // MOCK
          return $q.resolve({
            id:            3,
            accountNumber: '1000-0003',
            accountType:   accountType,
            balance:       0,
            status:        'OPEN'
          });
          // END MOCK
        }

        // REAL
        return $http.post(APP_CONFIG.apiBaseUrl + '/requests/open-account', {
          accountType: accountType
        }).then(function (res) { return res.data.data; });
      };

    }
  ]);