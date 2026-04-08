angular.module('bankingApp')
  .service('AuthService', ['$http', '$q', '$location', 'APP_CONFIG',
    function ($http, $q, $location, APP_CONFIG) {

      var self = this;

      // ─── MOCK FLAGS ──────────────────────────────────────────────────────
      // One flag per method so each can be wired independently.
      // Set to false as each backend endpoint becomes ready.
      var MOCK_LOAD_USER = false;   // GET  /auth/me
      var MOCK_LOGIN     = false;   // POST /auth/login
      var MOCK_REGISTER  = false;  // POST /auth/register  ← C-01: wired
      var MOCK_LOGOUT    = false;   // POST /auth/logout

      // ─── Mock users ──────  ────────────────────────────────────────────────
      // Simulates what GET /api/auth/me returns from the server.
      var MOCK_USERS = {
        admin: {
          id:        0,
          username:  'admin',
          firstName: 'Admin',
          lastName:  'User',
          email:     'admin@bank.com',
          role:      APP_CONFIG.roles.ADMIN,
          isActive:  true
        },
        customer: {
          id:        1,
          username:  'customer',
          firstName: 'Juan',
          lastName:  'dela Cruz',
          email:     'juan@bank.com',
          role:      APP_CONFIG.roles.CUSTOMER,
          isActive:  true
        }
      };

      // ─── In-memory user state (Option A) ────────────────────────────────
      // This is the ONLY place user info lives on the frontend.
      // No localStorage. No JWT decoding.
      // Populated by loadCurrentUser(). Cleared on logout.
      // Lost on page refresh — loadCurrentUser() silently restores it.
      self.currentUser = null;

      // ─── Load current user ───────────────────────────────────────────────
      // Call this on app start and immediately after login.
      //
      // MOCK:  resolves immediately with a hardcoded user object.
      //        Pass 'admin' as mockUsername to get ADMIN role.
      //
      // REAL:  GET /api/auth/me — browser sends the HttpOnly access_token
      //        cookie automatically (withCredentials is set by authInterceptor).
      //        Returns 401 if cookie is absent or expired → currentUser stays null.
      self.loadCurrentUser = function (mockUsername) {
        if (MOCK_LOAD_USER) {
          var isAdmin      = mockUsername && mockUsername.toLowerCase().startsWith('admin');
          self.currentUser = isAdmin ? MOCK_USERS.admin : MOCK_USERS.customer;
          return $q.resolve(self.currentUser);
        }

        return $http.get(APP_CONFIG.apiBaseUrl + '/auth/me')
          .then(function (res) {
            // res.data → ApiResponse<UserResponse>
            // { success, message, data: { id, username, firstName, lastName, email, role, isActive } }
            self.currentUser = res.data.data;
            return self.currentUser;
          })
          .catch(function () {
            self.currentUser = null;
            return $q.reject('Not authenticated');
          });
      };

      // ─── Auth state helpers ──────────────────────────────────────────────
      self.isAuthenticated = function () {
        return !!self.currentUser;
      };

      self.getRole = function () {
        return self.currentUser ? self.currentUser.role : null;
      };

      self.isAdmin = function () {
        return self.getRole() === APP_CONFIG.roles.ADMIN;
      };

      self.getDisplayName = function () {
        if (!self.currentUser) return 'User';
        return `${self.currentUser.firstName || ''} ${self.currentUser.lastName || ''}`.trim();
      };

      self.getUsername = function () {
        return self.currentUser ? self.currentUser.username : '';
      };

      // ─── Login ───────────────────────────────────────────────────────────
      // MOCK:  immediately sets currentUser based on username prefix.
      //
      // REAL:  POST /api/auth/login → server sets HttpOnly cookies.
      //        We then call loadCurrentUser() to populate currentUser from /auth/me.
      self.login = function (credentials) {
        if (MOCK_LOGIN) {
          var isAdmin      = credentials.username &&
                             credentials.username.toLowerCase().startsWith('admin');
          self.currentUser = isAdmin ? MOCK_USERS.admin : MOCK_USERS.customer;
          return $q.resolve({
            data: { success: true, message: 'Login successful.' }
          });
        }

        return $http.post(APP_CONFIG.apiBaseUrl + '/auth/login', credentials)
          .then(function (res) {
            // Cookies are set by the server — nothing to store here.
            // Populate currentUser by calling /auth/me.
            return self.loadCurrentUser().then(function () {
              return res;
            });
          });
      };

      // ─── Register ────────────────────────────────────────────────────────
      // REAL:  POST /api/auth/register → returns ApiResponse<UserResponse> (201).
      //        Does not log the user in — controller redirects to /login on success.
      //
      // Request body must match RegisterRequest exactly:
      //   { username, firstName, middleName, lastName, suffix,
      //     email, password, contactNumber }
      //
      // ⚠  contactNumber — not phone, not phoneNumber.
      self.register = function (data) {
        if (MOCK_REGISTER) {
          return $q.resolve({
            data: {
              success: true,
              message: 'Registration successful. You may now log in.'
            }
          });
        }

        return $http.post(APP_CONFIG.apiBaseUrl + '/auth/register', data)
          .then(function (res) {
            // res.data → ApiResponse<UserResponse>
            // { success, message, data: UserResponse }
            // Controller reads res.data.message for the toast, then redirects.
            return res;
          });
      };

      // ─── Logout ──────────────────────────────────────────────────────────
      // MOCK:  clears currentUser and redirects immediately.
      //
      // REAL:  POST /api/auth/logout → server clears both HttpOnly cookies.
      //        We clear currentUser and redirect in .finally() regardless of
      //        response status so the user is always sent to /login.
      self.logout = function () {
        if (MOCK_LOGOUT) {
          self.currentUser = null;
          $location.path('/login');
          return;
        }

        return $http.post(APP_CONFIG.apiBaseUrl + '/auth/logout')
          .then(function () {
            self.currentUser = null;
            $location.path('/login');
          })
          .catch(function () {
            // Even on network error, clear local state and redirect.
            // The server cookie will expire on its own.
            self.currentUser = null;
            $location.path('/login');
          });
      };

    }
  ]);