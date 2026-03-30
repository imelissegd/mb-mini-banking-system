angular.module('bankingApp')
  .service('AdminService', ['$http', '$q', 'APP_CONFIG',
    function ($http, $q, APP_CONFIG) {

      var self = this;

      // ─── MOCK FLAG ──────────────────────────────────────────────────────
      // Set to false when the backend is ready.
      var MOCK = true;

      // ─── Mock Data ───────────────────────────────────────────────────────

      var MOCK_CUSTOMERS = [
        {
          id:         1,
          username:   'customer',
          email:      'juan@email.com',
          firstName:  'Juan',
          middleName: 'Santos',
          lastName:   'dela Cruz',
          suffix:     'Jr.',
          role:       'CUSTOMER',
          isActive:   true,
          accounts: [
            { id: 1, accountNumber: '1000-0001', accountType: 'CHECKING', balance: 5000.00,  status: 'ACTIVE' },
            { id: 2, accountNumber: '1000-0002', accountType: 'SAVINGS',  balance: 12000.00, status: 'ACTIVE' }
          ]
        },
        {
          id:         2,
          username:   'customer2',
          email:      'maria@email.com',
          firstName:  'Maria',
          middleName: '',
          lastName:   'Santos',
          suffix:     '',
          role:       'CUSTOMER',
          isActive:   true,
          accounts: [
            { id: 3, accountNumber: '1000-0003', accountType: 'CHECKING', balance: 3200.00, status: 'ACTIVE' }
          ]
        },
        {
          id:         3,
          username:   'customer3',
          email:      'pedro@email.com',
          firstName:  'Pedro',
          middleName: '',
          lastName:   'Reyes',
          suffix:     '',
          role:       'CUSTOMER',
          isActive:   false,
          accounts:   []
        }
      ];

      var MOCK_TRANSACTIONS = [
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
          fromAccountNumber: '1000-0003',
          toAccountNumber:   '1000-0001',
          amount:            750.00,
          type:              'TRANSFER',
          timestamp:         '2025-03-15T16:45:00',
          description:       'Bills'
        }
      ];

      // ─── getDashboardSummary ─────────────────────────────────────────────
      // Returns high-level stats for the admin dashboard.
      self.getDashboardSummary = function () {
        if (MOCK) {
          // MOCK
          return $q.resolve({
            totalCustomers:    12,
            totalAccounts:     20,
            transactionsToday: 5,
            totalBalance:      98500.00
          });
          // END MOCK
        }

        // REAL
        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/dashboard')
          .then(function (res) { return res.data; });
      };

      // ─── getAllCustomers ──────────────────────────────────────────────────
      // Returns the full list of customers.
      self.getAllCustomers = function () {
        if (MOCK) {
          // MOCK
          return $q.resolve(MOCK_CUSTOMERS);
          // END MOCK
        }

        // REAL
        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/customers')
          .then(function (res) { return res.data; });
      };

      // ─── getCustomer ──────────────────────────────────────────────────────
      // Returns a single customer by id.
      self.getCustomer = function (customerId) {
        if (MOCK) {
          // MOCK
          var found = MOCK_CUSTOMERS.filter(function (c) { return c.id === +customerId; });
          return $q.resolve(found.length ? found[0] : MOCK_CUSTOMERS[0]);
          // END MOCK
        }

        // REAL
        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/customers/' + customerId)
          .then(function (res) { return res.data; });
      };

      // ─── createCustomer ───────────────────────────────────────────────────
      // Creates a new customer account.
      // data: { username, email, password, firstName, middleName, lastName, suffix }
      self.createCustomer = function (data) {
        if (MOCK) {
          // MOCK
          return $q.resolve(angular.extend({ id: 99, role: 'CUSTOMER', isActive: true, accounts: [] }, data));
          // END MOCK
        }

        // REAL
        return $http.post(APP_CONFIG.apiBaseUrl + '/admin/customers', data)
          .then(function (res) { return res.data; });
      };

      // ─── updateCustomer ───────────────────────────────────────────────────
      // Updates an existing customer's details.
      // data: { firstName, middleName, lastName, suffix, email }
      self.updateCustomer = function (customerId, data) {
        if (MOCK) {
          // MOCK
          return $q.resolve(angular.extend({ id: +customerId, role: 'CUSTOMER', isActive: true, accounts: [] }, data));
          // END MOCK
        }

        // REAL
        return $http.put(APP_CONFIG.apiBaseUrl + '/admin/customers/' + customerId, data)
          .then(function (res) { return res.data; });
      };

      // ─── setCustomerStatus ────────────────────────────────────────────────
      // Activates or deactivates a customer account.
      // isActive: boolean
      self.setCustomerStatus = function (customerId, isActive) {
        if (MOCK) {
          // MOCK
          return $q.resolve({ id: +customerId, isActive: isActive });
          // END MOCK
        }

        // REAL
        return $http.patch(APP_CONFIG.apiBaseUrl + '/admin/customers/' + customerId + '/status', { isActive: isActive })
          .then(function (res) { return res.data; });
      };

      // ─── openAccountForCustomer ───────────────────────────────────────────
      // Opens a new bank account for a specific customer.
      // accountType: 'CHECKING' | 'SAVINGS'
      self.openAccountForCustomer = function (customerId, accountType) {
        if (MOCK) {
          // MOCK
          return $q.resolve({
            id:            10,
            accountNumber: '9000-000' + customerId,
            accountType:   accountType,
            balance:       0,
            status:        'ACTIVE'
          });
          // END MOCK
        }

        // REAL
        return $http.post(APP_CONFIG.apiBaseUrl + '/admin/customers/' + customerId + '/accounts', { accountType: accountType })
          .then(function (res) { return res.data; });
      };

      // ─── getAllTransactions ───────────────────────────────────────────────
      // Returns the full transaction log across all customers.
      self.getAllTransactions = function () {
        if (MOCK) {
          // MOCK
          return $q.resolve(MOCK_TRANSACTIONS);
          // END MOCK
        }

        // REAL
        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/transactions')
          .then(function (res) { return res.data; });
      };

      // ─── getTransaction ───────────────────────────────────────────────────
      // Returns a single transaction by id.
      self.getTransaction = function (transactionId) {
        if (MOCK) {
          // MOCK
          var found = MOCK_TRANSACTIONS.filter(function (t) { return t.id === +transactionId; });
          return $q.resolve(found.length ? found[0] : MOCK_TRANSACTIONS[0]);
          // END MOCK
        }

        // REAL
        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/transactions/' + transactionId)
          .then(function (res) { return res.data; });
      };

    }
  ]);