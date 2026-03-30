angular.module('bankingApp')
  .service('TransactionService', ['$http', '$q', 'APP_CONFIG',
    function ($http, $q, APP_CONFIG) {

      var self = this;

      // ─── MOCK FLAG ──────────────────────────────────────────────────────
      // Set to false when the backend is ready.
      var MOCK = true;

      // ─── getMyTransactions ───────────────────────────────────────────────
      // Returns the logged-in customer's full transaction history.
      self.getMyTransactions = function () {
        if (MOCK) {
          // MOCK
          return $q.resolve([
            {
              id:                1,
              fromAccountNumber: '1000-0001',
              toAccountNumber:   '2000-0001',
              amount:            500.00,
              type:              'TRANSFER',
              timestamp:         '2025-03-01T10:00:00',
              description:       'Rent payment'
            },
            {
              id:                2,
              fromAccountNumber: null,
              toAccountNumber:   '1000-0001',
              amount:            1000.00,
              type:              'DEPOSIT',
              timestamp:         '2025-03-05T14:30:00',
              description:       'Salary'
            },
            {
              id:                3,
              fromAccountNumber: '1000-0001',
              toAccountNumber:   null,
              amount:            200.00,
              type:              'WITHDRAWAL',
              timestamp:         '2025-03-10T09:15:00',
              description:       'ATM withdrawal'
            },
            {
              id:                4,
              fromAccountNumber: '1000-0002',
              toAccountNumber:   '3000-0001',
              amount:            750.00,
              type:              'TRANSFER',
              timestamp:         '2025-03-15T16:45:00',
              description:       'Bills'
            }
          ]);
          // END MOCK
        }

        // REAL
        return $http.get(APP_CONFIG.apiBaseUrl + '/customer/transactions')
          .then(function (res) { return res.data; });
      };

      // ─── transfer ────────────────────────────────────────────────────────
      // Transfers funds from one of the customer's accounts to another account.
      // data: { fromAccountId, toAccountNumber, amount, description }
      self.transfer = function (data) {
        if (MOCK) {
          // MOCK
          return $q.resolve({ message: 'Transfer successful.', success: true });
          // END MOCK
        }

        // REAL
        return $http.post(APP_CONFIG.apiBaseUrl + '/customer/transfer', {
          fromAccountId:   data.fromAccountId,
          toAccountNumber: data.toAccountNumber,
          amount:          data.amount,
          description:     data.description
        }).then(function (res) { return res.data; });
      };

      // ─── deposit ─────────────────────────────────────────────────────────
      // Deposits funds into one of the customer's accounts.
      // data: { accountId, amount }
      self.deposit = function (data) {
        if (MOCK) {
          // MOCK
          return $q.resolve({ message: 'Deposit successful.', success: true });
          // END MOCK
        }

        // REAL
        return $http.post(APP_CONFIG.apiBaseUrl + '/customer/deposit', {
          accountId: data.accountId,
          amount:    data.amount
        }).then(function (res) { return res.data; });
      };

      // ─── withdraw ────────────────────────────────────────────────────────
      // Withdraws funds from one of the customer's accounts.
      // data: { accountId, amount }
      self.withdraw = function (data) {
        if (MOCK) {
          // MOCK
          return $q.resolve({ message: 'Withdrawal successful.', success: true });
          // END MOCK
        }

        // REAL
        return $http.post(APP_CONFIG.apiBaseUrl + '/customer/withdraw', {
          accountId: data.accountId,
          amount:    data.amount
        }).then(function (res) { return res.data; });
      };

    }
  ]);