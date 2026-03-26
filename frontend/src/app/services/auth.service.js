/**
 * auth.service.js
 *
 * Handles:
 *  - Storing / retrieving JWT from localStorage
 *  - Decoding JWT payload (base64 → JSON)
 *  - Checking auth state and role
 *  - Login, register, logout HTTP calls
 */
angular.module('bankingApp')
  .service('AuthService', ['$http', '$location', 'APP_CONFIG',
    function ($http, $location, APP_CONFIG) {

      var self = this;

      // ─── Token Storage ────────────────────────────────────────────────────

      self.saveToken = function (token) {
        localStorage.setItem(APP_CONFIG.tokenKey, token);
      };

      self.getToken = function () {
        return localStorage.getItem(APP_CONFIG.tokenKey);
      };

      self.clearToken = function () {
        localStorage.removeItem(APP_CONFIG.tokenKey);
      };

      // ─── JWT Decode ───────────────────────────────────────────────────────

      /**
       * Decodes the JWT payload without verifying the signature.
       * Signature verification is the backend's responsibility.
       * We only decode for UX (display name, role-based UI).
       *
       * @returns {Object|null} parsed payload or null on failure
       */
      self.decodeToken = function () {
        var token = self.getToken();
        if (!token) return null;

        try {
          var parts = token.split('.');
          if (parts.length !== 3) return null;

          // JWT payload is base64url encoded — replace chars then decode
          var base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          var jsonStr = atob(base64);
          return JSON.parse(jsonStr);
        } catch (e) {
          console.error('AuthService: failed to decode token', e);
          return null;
        }
      };

      // ─── Auth State ───────────────────────────────────────────────────────

      /**
       * Returns true if a non-expired token exists in localStorage.
       * Expiry check is UX-only — backend validates the real expiry.
       */
      self.isAuthenticated = function () {
        var payload = self.decodeToken();
        if (!payload) return false;

        // JWT exp is in seconds; Date.now() is in milliseconds
        var nowSeconds = Math.floor(Date.now() / 1000);
        return payload.exp && payload.exp > nowSeconds;
      };

      /**
       * Returns the role string from the JWT payload (e.g. "ADMIN", "CUSTOMER").
       * Returns null if not authenticated.
       */
      self.getRole = function () {
        var payload = self.decodeToken();
        return payload ? payload.role : null;
      };

      /**
       * Returns true if the current user has the ADMIN role.
       */
      self.isAdmin = function () {
        return self.getRole() === APP_CONFIG.roles.ADMIN;
      };

      /**
       * Returns display name from token claims.
       */
      self.getDisplayName = function () {
        var payload = self.decodeToken();
        if (!payload) return '';
        return payload.firstName || payload.sub || 'User';
      };

      // ─── API Calls ────────────────────────────────────────────────────────

      /**
       * POST /api/auth/login
       * On success: saves token and returns the response.
       */
      self.login = function (credentials) {
        return $http.post(APP_CONFIG.apiBaseUrl + '/auth/login', credentials)
          .then(function (response) {
            if (response.data && response.data.token) {
              self.saveToken(response.data.token);
            }
            return response;
          });
      };

      /**
       * POST /api/auth/register
       */
      self.register = function (data) {
        return $http.post(APP_CONFIG.apiBaseUrl + '/auth/register', data);
      };

      /**
       * Logout: clear token and redirect to /login.
       */
      self.logout = function () {
        self.clearToken();
        $location.path('/login');
      };

    }
  ]);