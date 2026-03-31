angular.module('bankingApp')
  .service('AdminService', ['$http', '$q', 'APP_CONFIG',
    function ($http, $q, APP_CONFIG) {

      var self = this;

      // ─── MOCK FLAG ──────────────────────────────────────────────────────
      var MOCK = false;

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
            { id: 1, accountNumber: '1000-0001', accountType: 'CHECKING', balance: 5000.00,  status: 'OPEN' },
            { id: 2, accountNumber: '1000-0002', accountType: 'SAVINGS',  balance: 12000.00, status: 'OPEN' }
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
            { id: 3, accountNumber: '1000-0003', accountType: 'CHECKING', balance: 3200.00, status: 'OPEN' }
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
      // ⚠ A-07: GET /api/admin/dashboard does not exist in the BE.
      // The AdminController has no dashboard summary endpoint.
      // This method returns a graceful empty summary so the dashboard
      // renders without crashing. Flag to BE to add this endpoint.
      self.getDashboardSummary = function () {
        if (MOCK) {
          return $q.resolve({
            totalCustomers:    12,
            totalAccounts:     20,
            transactionsToday: 5,
            totalBalance:      98500.00
          });
        }

        // REAL
        // ⚠ Endpoint missing — resolve with null so controller can
        // show a "unavailable" state instead of a broken page.
        return $q.resolve(null);

        // When BE adds GET /api/admin/dashboard returning DashboardSummaryResponse,
        // replace the above with:
        // return $http.get(APP_CONFIG.apiBaseUrl + '/admin/dashboard')
        //   .then(function (res) { return res.data.data; });
      };

      // ─── getAllCustomers ──────────────────────────────────────────────────
      // A-06: GET /api/admin/users (not /admin/customers)
      // Returns Page<UserResponse> — array is at res.data.data.content
      // UserResponse does NOT include accounts — accounts are loaded
      // separately per customer in getCustomer().
      // customer-list.html uses c.accounts.length — will show 0 for all
      // rows until accounts are loaded per-customer (acceptable for list view).
      self.getAllCustomers = function () {
        if (MOCK) {
          return $q.resolve(MOCK_CUSTOMERS);
        }

        // REAL
        // A-06: was /admin/customers → /admin/users
        //       returns Page<UserResponse> → unwrap .content
        //       each UserResponse has no accounts field — inject empty array
        //       so customer-list.html c.accounts.length doesn't throw
        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/users')
          .then(function (res) {
            var users = res.data.data.content || [];
            return users.map(function (u) {
              u.accounts = u.accounts || [];
              return u;
            });
          });
      };

      // ─── getCustomer ──────────────────────────────────────────────────────
      // A-05: GET /api/admin/users/:userId (not /admin/customers/:id)
      // Returns UserResponse at res.data.data.
      // UserResponse has no accounts — load them via GET /admin/accounts?username=
      // and attach to the customer object so customer-detail.html can render them.
      self.getCustomer = function (customerId) {
        if (MOCK) {
          var found = MOCK_CUSTOMERS.filter(function (c) { return c.id === +customerId; });
          return $q.resolve(found.length ? found[0] : MOCK_CUSTOMERS[0]);
        }

        // REAL
        // A-05: was /admin/customers/:id → /admin/users/:userId
        //       fetch accounts separately and attach to customer object
        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/users/' + customerId)
          .then(function (res) {
            var customer = res.data.data;
            customer.accounts = [];

            // Load this customer's accounts via username filter
            return $http.get(APP_CONFIG.apiBaseUrl + '/admin/accounts', {
              params: { username: customer.username, size: 50 }
            }).then(function (accRes) {
              customer.accounts = (accRes.data.data.content || []).map(function (acc) {
                // Normalize status: BE returns 'OPEN', HTML checks 'OPEN' ✅
                return acc;
              });
              return customer;
            }).catch(function () {
              // If accounts fail to load, return customer without accounts
              // rather than failing the whole page
              return customer;
            });
          });
      };

      // ─── createCustomer ───────────────────────────────────────────────────
      // A-01: POST /api/admin/users (not /admin/customers)
      // Body: CreateUserAdmin DTO — fields match RegisterRequest:
      //   { firstName, middleName, lastName, suffix, username, email, password }
      // contactNumber is not collected by the form — omit or send empty string.
      // Returns UserResponse at res.data.data (HTTP 201).
      self.createCustomer = function (data) {
        if (MOCK) {
          return $q.resolve(angular.extend({ id: 99, role: 'CUSTOMER', isActive: true, accounts: [] }, data));
        }

        // REAL
        // A-01: was /admin/customers → /admin/users
        //       was res.data → res.data.data
        return $http.post(APP_CONFIG.apiBaseUrl + '/admin/users', {
          firstName:     data.firstName,
          middleName:    data.middleName   || '',
          lastName:      data.lastName,
          suffix:        data.suffix       || '',
          username:      data.username,
          email:         data.email,
          password:      data.password,
          contactNumber: data.contactNumber || ''
        }).then(function (res) { return res.data.data; });
      };

      // ─── updateCustomer ───────────────────────────────────────────────────
      // A-03: PUT /api/admin/customers/:id does NOT exist in the BE.
      // AdminController has no direct profile-edit endpoint for admin.
      // Profile changes go through the request/approval flow.
      // This method is stubbed to reject with a clear message so the
      // controller's catch block shows a meaningful toast.
      // Flag to BE: add PUT/PATCH /api/admin/users/:userId for direct edit.
      self.updateCustomer = function (customerId, data) {
        if (MOCK) {
          return $q.resolve(angular.extend({ id: +customerId, role: 'CUSTOMER', isActive: true, accounts: [] }, data));
        }

        // REAL
        // ⚠ Endpoint missing — reject so controller shows error toast.
        // When BE adds the endpoint, replace with:
        // return $http.put(APP_CONFIG.apiBaseUrl + '/admin/users/' + customerId, data)
        //   .then(function (res) { return res.data.data; });
        return $q.reject({
          data: { message: 'Direct profile editing is not available. Use the request approval flow.' }
        });
      };

      // ─── setCustomerStatus ────────────────────────────────────────────────
      // A-04: PATCH /api/admin/users/:userId/toggle-active (not /admin/customers/:id/status)
      // BE toggles the current state — no request body needed.
      // Returns UserResponse at res.data.data.
      self.setCustomerStatus = function (customerId, isActive) {
        if (MOCK) {
          return $q.resolve({ id: +customerId, isActive: isActive });
        }

        // REAL
        // A-04: was /admin/customers/:id/status with body { isActive }
        //       → /admin/users/:userId/toggle-active with NO body
        //       BE toggles blindly — controller passes the expected next
        //       state, we ignore the body and just PATCH the toggle endpoint.
        return $http.patch(APP_CONFIG.apiBaseUrl + '/admin/users/' + customerId + '/toggle-active')
          .then(function (res) { return res.data.data; });
      };

      // ─── openAccountForCustomer ───────────────────────────────────────────
      // A-02: POST /api/admin/accounts (not /admin/customers/:id/accounts)
      // Body: CreateBankAccountRequest — { userId, accountType }
      // userId must be sent in the body — it is NOT a path variable here.
      // Returns BankAccountResponse at res.data.data (HTTP 201).
      self.openAccountForCustomer = function (customerId, accountType) {
        if (MOCK) {
          return $q.resolve({
            id:            10,
            accountNumber: '9000-000' + customerId,
            accountType:   accountType,
            balance:       0,
            status:        'OPEN'
          });
        }

        // REAL
        // A-02: was /admin/customers/:id/accounts with { accountType } only
        //       → /admin/accounts with { userId: customerId, accountType }
        //       was res.data → res.data.data
        return $http.post(APP_CONFIG.apiBaseUrl + '/admin/accounts', {
          userId:      customerId,
          accountType: accountType
        }).then(function (res) { return res.data.data; });
      };

      // ─── getAllTransactions ───────────────────────────────────────────────
      // A-09: GET /api/admin/transactions ✅ URL correct
      // Returns Page<TransactionResponse> — array is at res.data.data.content
      self.getAllTransactions = function () {
        if (MOCK) {
          return $q.resolve(MOCK_TRANSACTIONS);
        }

        // REAL
        // A-09: was res.data (raw ApiResponse) → res.data.data.content (array)
        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/transactions')
          .then(function (res) { return res.data.data.content || []; });
      };

      // ─── getTransaction ───────────────────────────────────────────────────
      // A-08: GET /api/admin/transactions/:transactionId ✅ URL correct
      // Returns TransactionResponse at res.data.data.
      self.getTransaction = function (transactionId) {
        if (MOCK) {
          var found = MOCK_TRANSACTIONS.filter(function (t) { return t.id === +transactionId; });
          return $q.resolve(found.length ? found[0] : MOCK_TRANSACTIONS[0]);
        }

        // REAL
        // A-08: was res.data → res.data.data
        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/transactions/' + transactionId)
          .then(function (res) { return res.data.data; });
      };

    }
  ]);