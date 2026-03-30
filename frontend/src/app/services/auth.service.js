angular.module('bankingApp')
  .service('AuthService', ['$http', '$q', '$location', 'APP_CONFIG',
    function ($http, $q, $location, APP_CONFIG) {

      var self = this;

      // ─── MOCK FLAG ──────────────────────────────────────────────────────
      // Set to false when the backend is ready.
      var MOCK = true;

      // ─── Mock JWT builder ────────────────────────────────────────────────
      // Builds a syntactically valid JWT (unsigned) so atob() decoding works.
      function buildMockToken(payload) {
        var header  = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
        var body    = btoa(JSON.stringify(payload));
        var sig     = 'mock-signature';
        // btoa may produce '+' '/' '=' — replace so split('.') stays clean
        return header.replace(/=/g,'') + '.' + body.replace(/=/g,'') + '.' + sig;
      }

      // ─── Token Storage ──────────────────────────────────────────────────
      self.saveToken  = function (token) { localStorage.setItem(APP_CONFIG.tokenKey, token); };
      self.getToken   = function ()      { return localStorage.getItem(APP_CONFIG.tokenKey); };
      self.clearToken = function ()      { localStorage.removeItem(APP_CONFIG.tokenKey); };

      // ─── JWT Decode ─────────────────────────────────────────────────────
      self.decodeToken = function () {
        var token = self.getToken();
        if (!token) return null;
        try {
          var parts = token.split('.');
          if (parts.length !== 3) return null;
          // Restore base64 padding stripped by buildMockToken / real JWTs
          var base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          var pad    = base64.length % 4;
          if (pad) { base64 += '===='.slice(pad); }
          return JSON.parse(atob(base64));
        } catch (e) {
          console.error('AuthService: failed to decode token', e);
          return null;
        }
      };

      // ─── Auth State ─────────────────────────────────────────────────────
      self.isAuthenticated = function () {
        var payload    = self.decodeToken();
        if (!payload)  return false;
        var nowSeconds = Math.floor(Date.now() / 1000);
        return payload.exp && payload.exp > nowSeconds;
      };

      self.getRole = function () {
        var payload = self.decodeToken();
        return payload ? payload.role : null;
      };

      self.isAdmin = function () {
        return self.getRole() === APP_CONFIG.roles.ADMIN;
      };

      self.getDisplayName = function () {
        var payload = self.decodeToken();
        if (!payload) return 'User';
        // Use firstName from token, fall back to username (sub), then generic
        return payload.firstName || payload.sub || 'User';
      };

      // Returns the raw username stored in the token (sub claim)
      self.getUsername = function () {
        var payload = self.decodeToken();
        return payload ? payload.sub : '';
      };

      // ─── Login ──────────────────────────────────────────────────────────
      self.login = function (credentials) {
        if (MOCK) {
          // Accept any credentials; role is driven by username prefix 'admin'
          var isAdmin   = credentials.username && credentials.username.toLowerCase().startsWith('admin');
          var role      = isAdmin ? APP_CONFIG.roles.ADMIN : APP_CONFIG.roles.CUSTOMER;
          var firstName = isAdmin ? 'Admin' : 'Juan';
          var exp       = Math.floor(Date.now() / 1000) + (60 * 60 * 8); // 8 hours

          var payload = {
            sub:       credentials.username || 'mockuser',
            role:      role,
            firstName: firstName,
            exp:       exp
          };

          var token = buildMockToken(payload);
          self.saveToken(token);

          return $q.resolve({
            data: {
              success: true,
              message: 'Login successful.',
              data:    { token: token }
            }
          });
        }

        // REAL
        return $http.post(APP_CONFIG.apiBaseUrl + '/auth/login', credentials)
          .then(function (response) {
            if (response.data && response.data.data && response.data.data.token) {
              self.saveToken(response.data.data.token);
            }
            return response;
          });
      };

      // ─── Register ────────────────────────────────────────────────────────
      self.register = function (data) {
        if (MOCK) {
          return $q.resolve({
            success: true,
            message: 'Registration successful. You may now log in.'
          });
        }

        // REAL
        return $http.post(APP_CONFIG.apiBaseUrl + '/auth/register', data)
          .then(function (res) { return res.data; });
      };

      // ─── Logout ──────────────────────────────────────────────────────────
      self.logout = function () {
        self.clearToken();
        $location.path('/login');
      };

    }
  ]);