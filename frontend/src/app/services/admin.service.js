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

      var MOCK_ACCOUNTS = [
        { id: 1, accountNumber: '1000-0001', accountType: 'CHECKING', balance: 5000.00,  status: 'OPEN',   ownerName: 'Juan Santos dela Cruz Jr.', createdAt: '2025-01-01T00:00:00' },
        { id: 2, accountNumber: '1000-0002', accountType: 'SAVINGS',  balance: 12000.00, status: 'OPEN',   ownerName: 'Juan Santos dela Cruz Jr.', createdAt: '2025-01-02T00:00:00' },
        { id: 3, accountNumber: '1000-0003', accountType: 'CHECKING', balance: 3200.00,  status: 'OPEN',   ownerName: 'Maria Santos',              createdAt: '2025-01-03T00:00:00' },
        { id: 4, accountNumber: '1000-0004', accountType: 'SAVINGS',  balance: 0.00,     status: 'FROZEN', ownerName: 'Pedro Reyes',               createdAt: '2025-01-04T00:00:00' }
      ];

      var MOCK_TRANSACTIONS = [
        {
          id:                1,
          fromAccountNumber: '1000-0001',
          toAccountNumber:   '2000-0001',
          amount:            500.00,
          type:              'TRANSFER',
          timestamp:         '2025-03-01T10:00:00',
          description:       'Rent payment',
          username:          'customer'
        },
        {
          id:                2,
          fromAccountNumber: null,
          toAccountNumber:   '1000-0001',
          amount:            1000.00,
          type:              'DEPOSIT',
          timestamp:         '2025-03-05T14:30:00',
          description:       'Salary',
          username:          'customer'
        },
        {
          id:                3,
          fromAccountNumber: '1000-0001',
          toAccountNumber:   null,
          amount:            200.00,
          type:              'WITHDRAWAL',
          timestamp:         '2025-03-10T09:15:00',
          description:       'ATM withdrawal',
          username:          'customer'
        },
        {
          id:                4,
          fromAccountNumber: '1000-0003',
          toAccountNumber:   '1000-0001',
          amount:            750.00,
          type:              'TRANSFER',
          timestamp:         '2025-03-15T16:45:00',
          description:       'Bills',
          username:          'customer2'
        }
      ];

      var MOCK_REQUESTS = [
        {
          id:                 1,
          requesterUsername:  'customer',
          type:               'OPEN_ACCOUNT',
          status:             'PENDING',
          payload:            '{"accountType":"SAVINGS"}',
          remarks:            null,
          createdAt:          '2025-03-20T09:00:00',
          resolvedAt:         null,
          resolvedBy:         null
        },
        {
          id:                 2,
          requesterUsername:  'customer2',
          type:               'EDIT_PROFILE',
          status:             'APPROVED',
          payload:            '{"firstName":"Maria","middleName":"","lastName":"Santos","suffix":"","email":"maria@email.com"}',
          remarks:            'Approved as requested.',
          createdAt:          '2025-03-18T14:00:00',
          resolvedAt:         '2025-03-19T10:30:00',
          resolvedBy:         'admin'
        },
        {
          id:                 3,
          requesterUsername:  'customer3',
          type:               'OPEN_ACCOUNT',
          status:             'REJECTED',
          payload:            '{"accountType":"CHECKING"}',
          remarks:            'Account is deactivated.',
          createdAt:          '2025-03-17T11:00:00',
          resolvedAt:         '2025-03-17T15:45:00',
          resolvedBy:         'admin'
        }
      ];

      // ─── getDashboardSummary ─────────────────────────────────────────────
      self.getDashboardSummary = function () {
        if (MOCK) {
          return $q.resolve({
            totalCustomers: 12,
            totalAccounts:  20,
            totalBalance:   98500.00
          });
        }

        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/dashboard')
          .then(function (res) { return res.data.data; });
      };

      // ─── getAllUsers ──────────────────────────────────────────────────
      // GET /api/admin/users
      // Supports server-side pagination + filtering.
      // params: { username, firstName, lastName, page, size, sortBy, sortDir }
      // Returns full Spring Page object: { content, totalPages, totalElements, ... }
      self.getAllUsers = function (params) {
        if (MOCK) {
          return $q.resolve({
            content:       MOCK_CUSTOMERS,
            totalPages:    1,
            totalElements: MOCK_CUSTOMERS.length
          });
        }

        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/users', { params: params })
          .then(function (res) {
            var page = res.data.data;
            // Inject empty accounts array so c.accounts.length doesn't throw
            page.content = (page.content || []).map(function (u) {
              u.accounts = u.accounts || [];
              return u;
            });
            return page;
          });
      };

      // ─── getUser ──────────────────────────────────────────────────────
      // GET /api/admin/users/:userId
      // Fetches accounts separately and attaches them to the customer object.
      self.getUser = function (userId) {
        if (MOCK) {
          var found = MOCK_CUSTOMERS.filter(function (c) { return c.id === +userId; });
          return $q.resolve(found.length ? found[0] : MOCK_CUSTOMERS[0]);
        }

        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/users/' + userId)
          .then(function (res) {
            var user = res.data.data;
            user.accounts = [];
            return $http.get(APP_CONFIG.apiBaseUrl + '/admin/accounts', {
              params: { username: user.username, size: 50 }
            }).then(function (accRes) {
              user.accounts = accRes.data.data.content || [];
              return user;
            }).catch(function () {
              return user;
            });
          });
      };

      // ─── createUser ───────────────────────────────────────────────────
      // POST /api/admin/users
      // Body: { firstName, middleName, lastName, suffix, username, email,
      //         password, contactNumber, role }
      // Returns UserResponse at res.data.data (HTTP 201).
      self.createUser = function (data) {
        if (MOCK) {
          return $q.resolve(angular.extend({ id: 99, isActive: true, accounts: [] }, data));
        }

        return $http.post(APP_CONFIG.apiBaseUrl + '/admin/users', {
          firstName:     data.firstName,
          middleName:    data.middleName    || '',
          lastName:      data.lastName,
          suffix:        data.suffix        || '',
          username:      data.username,
          email:         data.email,
          password:      data.password,
          contactNumber: data.contactNumber || '',
          role:          data.role          || 'CUSTOMER'
        }).then(function (res) { return res.data.data; });
      };

      // ─── updateUser ───────────────────────────────────────────────────
      // No direct admin edit endpoint — profile changes go through the
      // request/approval flow. Stubbed to reject with a clear message.
      self.updateUser = function (userId, data) {
        if (MOCK) {
          return $q.resolve(angular.extend({ id: +userId, isActive: true, accounts: [] }, data));
        }
        return $q.reject({
          data: { message: 'Direct profile editing is not available. Use the request approval flow.' }
        });
      };

      // ─── toggleUserActive ─────────────────────────────────────────────
      // PATCH /api/admin/users/:userId/toggle-active
      // BE toggles the current state — no request body needed.
      // Returns UserResponse at res.data.data.
      self.toggleUserActive = function (customerId) {
        if (MOCK) {
          var found = MOCK_CUSTOMERS.filter(function (c) { return c.id === +customerId; });
          if (found.length) { found[0].isActive = !found[0].isActive; }
          return $q.resolve(found.length ? found[0] : {});
        }

        return $http.patch(APP_CONFIG.apiBaseUrl + '/admin/users/' + customerId + '/toggle-active')
          .then(function (res) { return res.data.data; });
      };

      // ─── openAccountForUser ───────────────────────────────────────────
      // POST /api/admin/accounts
      // Body: { userId, accountType }
      // Returns BankAccountResponse at res.data.data (HTTP 201).
      self.openAccountForUser = function (userId, accountType) {
        if (MOCK) {
          return $q.resolve({
            id:            10,
            accountNumber: '9000-000' + userId,
            accountType:   accountType,
            balance:       0,
            status:        'OPEN'
          });
        }

        return $http.post(APP_CONFIG.apiBaseUrl + '/admin/accounts', {
          userId:      userId,
          accountType: accountType
        }).then(function (res) { return res.data.data; });
      };

      // ─── getAllAccounts ───────────────────────────────────────────────────
      // GET /api/admin/accounts
      // Supports server-side pagination + filtering.
      // params: { username, accountNumber, accountType, status, page, size, sortBy, sortDir }
      // Returns full Spring Page object: { content, totalPages, totalElements, ... }
      self.getAllAccounts = function (params) {
        if (MOCK) {
          return $q.resolve({
            content:       MOCK_ACCOUNTS,
            totalPages:    1,
            totalElements: MOCK_ACCOUNTS.length
          });
        }

        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/accounts', { params: params })
          .then(function (res) { return res.data.data; });
      };

      // ─── changeAccountStatus ─────────────────────────────────────────────
      // PATCH /api/admin/accounts/:accountNumber?accountStatus=OPEN|FROZEN|CLOSED
      // No request body — status is passed as a query param.
      // Path variable is accountNumber (string), not id.
      // Returns BankAccountResponse at res.data.data.
      self.changeAccountStatus = function (accountNumber, status) {
        if (MOCK) {
          var found = MOCK_ACCOUNTS.filter(function (a) { return a.accountNumber === accountNumber; });
          if (found.length) { found[0].status = status; }
          return $q.resolve(found.length ? found[0] : {});
        }

        return $http.patch(APP_CONFIG.apiBaseUrl + '/admin/accounts/' + accountNumber, null, {
          params: { accountStatus: status }
        }).then(function (res) { return res.data.data; });
      };

      // ─── getAllTransactions ───────────────────────────────────────────────
      // GET /api/admin/transactions
      // Supports server-side pagination + filtering.
      // params: { username, accountNumber, type, startDate, endDate, page, size, sortBy, sortDir }
      // Returns full Spring Page object: { content, totalPages, totalElements, ... }
      self.getAllTransactions = function (params) {
        if (MOCK) {
          return $q.resolve({
            content:       MOCK_TRANSACTIONS,
            totalPages:    1,
            totalElements: MOCK_TRANSACTIONS.length
          });
        }

        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/transactions', { params: params })
          .then(function (res) { return res.data.data; });
      };

      // ─── getTransaction ───────────────────────────────────────────────────
      // GET /api/admin/transactions/:transactionId
      // Returns TransactionResponse at res.data.data.
      self.getTransaction = function (transactionId) {
        if (MOCK) {
          var found = MOCK_TRANSACTIONS.filter(function (t) { return t.id === +transactionId; });
          return $q.resolve(found.length ? found[0] : MOCK_TRANSACTIONS[0]);
        }

        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/transactions/' + transactionId)
          .then(function (res) { return res.data.data; });
      };

      // ─── getAllRequests ───────────────────────────────────────────────────
      // GET /api/admin/requests
      // Supports server-side pagination + filtering.
      // params: { status, page, size, sortBy, sortDir }
      // Returns full Spring Page object: { content, totalPages, totalElements, ... }
      self.getAllRequests = function (params) {
        if (MOCK) {
          return $q.resolve({
            content:       MOCK_REQUESTS,
            totalPages:    1,
            totalElements: MOCK_REQUESTS.length
          });
        }

        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/requests', { params: params })
          .then(function (res) { return res.data.data; });
      };

      // ─── getRequest ───────────────────────────────────────────────────────
      // GET /api/admin/requests/:requestId
      // Returns RequestResponse at res.data.data.
      self.getRequest = function (requestId) {
        if (MOCK) {
          var found = MOCK_REQUESTS.filter(function (r) { return r.id === +requestId; });
          return $q.resolve(found.length ? found[0] : MOCK_REQUESTS[0]);
        }

        return $http.get(APP_CONFIG.apiBaseUrl + '/admin/requests/' + requestId)
          .then(function (res) { return res.data.data; });
      };

      // ─── resolveRequest ───────────────────────────────────────────────────
      // PATCH /api/admin/requests/:requestId/resolve
      // Body: { status: 'APPROVED'|'REJECTED', remarks: string|null }
      // Returns RequestResponse at res.data.data.
      self.resolveRequest = function (requestId, dto) {
        if (MOCK) {
          var mockFound = MOCK_REQUESTS.filter(function (r) { return r.id === +requestId; });
          var mockReq   = mockFound.length ? angular.copy(mockFound[0]) : angular.copy(MOCK_REQUESTS[0]);
          mockReq.status     = dto.status;
          mockReq.remarks    = dto.remarks || null;
          mockReq.resolvedAt = new Date().toISOString();
          mockReq.resolvedBy = 'admin';
          MOCK_REQUESTS.forEach(function (r, i) {
            if (r.id === +requestId) { MOCK_REQUESTS[i] = mockReq; }
          });
          return $q.resolve(mockReq);
        }

        return $http.patch(
          APP_CONFIG.apiBaseUrl + '/admin/requests/' + requestId + '/resolve',
          { status: dto.status, remarks: dto.remarks }
        ).then(function (res) { return res.data.data; });
      };

    }
  ]);