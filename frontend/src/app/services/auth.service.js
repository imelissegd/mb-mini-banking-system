angular.module('bankingApp')
  .service('AuthService', ['$http', '$q', '$location', 'APP_CONFIG',
    function ($http, $q, $location, APP_CONFIG) {

      var self = this;

      // ─── MOCK FLAG ───────────────────────────────────────────────────────
      // Set to false when the backend is ready.
      var MOCK = true;

      // ─── Mock users ──────────────────────────────────────────────────────
      // Simulates what GET /api/auth/me returns from the server.
      // Switch MOCK_ACTIVE_USER to test different roles.
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
      //        Change credentials.username prefix to 'admin' to get ADMIN role.
      //
      // REAL:  GET /api/auth/me — browser sends the HttpOnly access_token
      //        cookie automatically (withCredentials is set by authInterceptor).
      //        Server validates the cookie and returns the current user.
      //        Returns 401 if cookie is absent or expired → currentUser stays null.
      self.loadCurrentUser = function (mockUsername) {
        if (MOCK) {
          var isAdmin      = mockUsername && mockUsername.toLowerCase().startsWith('admin');
          self.currentUser = isAdmin ? MOCK_USERS.admin : MOCK_USERS.customer;
          return $q.resolve(self.currentUser);
        }

        return $http.get(APP_CONFIG.apiBaseUrl + '/auth/me')
          .then(function (res) {
            // res.data shape: ApiResponse<UserResponse>
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
        return self.currentUser.firstName || self.currentUser.username || 'User';
      };

      self.getUsername = function () {
        return self.currentUser ? self.currentUser.username : '';
      };

      // ─── Login ───────────────────────────────────────────────────────────
      // MOCK:  immediately sets currentUser based on username prefix.
      //        Username starting with 'admin' → ADMIN role, anything else → CUSTOMER.
      //
      // REAL:  POST /api/auth/login → server authenticates credentials and
      //        sets two HttpOnly cookies (access_token, refresh_token) in the
      //        response headers. No token is returned in the body.
      //        We then call loadCurrentUser() to populate currentUser from /auth/me.
      self.login = function (credentials) {
        if (MOCK) {
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
      // MOCK:  resolves immediately with a success message.
      // REAL:  POST /api/auth/register → returns ApiResponse<UserResponse> (201).
      //        Does not log the user in — redirect to /login after success.
      self.register = function (data) {
        if (MOCK) {
          return $q.resolve({
            data: {
              success: true,
              message: 'Registration successful. You may now log in.'
            }
          });
        }

        return $http.post(APP_CONFIG.apiBaseUrl + '/auth/register', data)
          .then(function (res) { return res; });
      };

      // ─── Logout ──────────────────────────────────────────────────────────
      // MOCK:  clears currentUser and redirects immediately.
      // REAL:  POST /api/auth/logout → server sets both cookies with maxAge=0,
      //        which tells the browser to delete them immediately.
      //        We clear currentUser and redirect regardless of response status
      //        (use .finally) so the user is always sent to /login.
      self.logout = function () {
        if (MOCK) {
          self.currentUser = null;
          $location.path('/login');
          return;
        }

        $http.post(APP_CONFIG.apiBaseUrl + '/auth/logout')
          .finally(function () {
            self.currentUser = null;
            $location.path('/login');
          });
      };

    }
  ]);