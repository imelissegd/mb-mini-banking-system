angular.module('bankingApp')
  .service('TransactionService', ['$http', '$q', 'APP_CONFIG',
    function ($http, $q, APP_CONFIG) {

      var self = this;

      // ─── MOCK FLAG ──────────────────────────────────────────────────────
      var MOCK = false;

      // ─── getMyTransactions ───────────────────────────────────────────────
      // GET /api/transactions
      // Returns List<TransactionResponse> at res.data.data
      self.getMyTransactions = function () {
        if (MOCK) {
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
        }

        // REAL
        // C-06: was /customer/transactions  → /transactions
        //       was res.data               → res.data.data
        return $http.get(APP_CONFIG.apiBaseUrl + '/transactions')
          .then(function (res) { return res.data.data; });
      };

      // ─── transfer ────────────────────────────────────────────────────────
      // POST /api/transactions/transfer
      // Body: { fromAccountNumber, toAccountNumber, amount, description }
      // Header: X-Transaction-Token  (required by BE even though validation
      //         is commented out — omitting it causes Spring to return 400)
      // Resolves: res.data (ApiResponse) so controller can read .message
      self.transfer = function (data) {
        if (MOCK) {
          return $q.resolve({ message: 'Transfer successful.', success: true });
        }

        // REAL
        // C-04 fixes:
        //   URL was /customer/transfer        → /transactions/transfer
        //   field was fromAccountId (integer) → fromAccountNumber (string)
        //   added X-Transaction-Token header
        return $http.post(
          APP_CONFIG.apiBaseUrl + '/transactions/transfer',
          {
            fromAccountNumber: data.fromAccountNumber,
            toAccountNumber:   data.toAccountNumber,
            amount:            data.amount,
            description:       data.description
          },
          {
            headers: { 'X-Transaction-Token': 'placeholder' }
          }
        ).then(function (res) { return res.data; });
      };

      // ─── deposit ─────────────────────────────────────────────────────────
      // POST /api/transactions/deposit
      // Body: { toAccountNumber, amount, description }
      // Header: X-Transaction-Token
      // Resolves: res.data (ApiResponse) so controller can read .message
      self.deposit = function (data) {
        if (MOCK) {
          return $q.resolve({ message: 'Deposit successful.', success: true });
        }

        // REAL
        // C-05 fixes:
        //   URL was /customer/deposit       → /transactions/deposit
        //   field was accountId (integer)   → toAccountNumber (string)
        //   added X-Transaction-Token header
        return $http.post(
          APP_CONFIG.apiBaseUrl + '/transactions/deposit',
          {
            toAccountNumber: data.toAccountNumber,
            amount:          data.amount,
            description:     data.description || ''
          },
          {
            headers: { 'X-Transaction-Token': 'placeholder' }
          }
        ).then(function (res) { return res.data; });
      };

      // ─── withdraw ────────────────────────────────────────────────────────
      // POST /api/transactions/withdraw
      // Body: { fromAccountNumber, amount, description }
      // Header: X-Transaction-Token
      // Resolves: res.data (ApiResponse) so controller can read .message
      self.withdraw = function (data) {
        if (MOCK) {
          return $q.resolve({ message: 'Withdrawal successful.', success: true });
        }

        // REAL
        // C-05 fixes:
        //   URL was /customer/withdraw      → /transactions/withdraw
        //   field was accountId (integer)   → fromAccountNumber (string)
        //   added X-Transaction-Token header
        return $http.post(
          APP_CONFIG.apiBaseUrl + '/transactions/withdraw',
          {
            fromAccountNumber: data.fromAccountNumber,
            amount:            data.amount,
            description:       data.description || ''
          },
          {
            headers: { 'X-Transaction-Token': 'placeholder' }
          }
        ).then(function (res) { return res.data; });
      };

    }
  ]);