angular.module('bankingApp')
  .service('ProfileService', ['$http', '$q', 'APP_CONFIG',
    function ($http, $q, APP_CONFIG) {

      var self = this;

      // ─── MOCK FLAG ──────────────────────────────────────────────────────
      var MOCK = false;

      // ─── getMyProfile ────────────────────────────────────────────────────
      // GET /api/auth/me
      // There is no separate customer profile endpoint — /auth/me is the
      // canonical source of UserResponse for the authenticated customer.
      // Returns UserResponse at res.data.data:
      // { id, username, firstName, middleName, lastName, suffix,
      //   email, role, isActive }
      self.getMyProfile = function () {
        if (MOCK) {
          return $q.resolve({
            id:         1,
            username:   'customer',
            email:      'juan@email.com',
            firstName:  'Juan',
            middleName: 'Santos',
            lastName:   'dela Cruz',
            suffix:     'Jr.',
            role:       'CUSTOMER',
            isActive:   true
          });
        }

        // REAL
        // C-08: was /customer/profile (does not exist)
        //       → /auth/me (the only customer user-data endpoint)
        //       was res.data (raw ApiResponse) → res.data.data (UserResponse)
        return $http.get(APP_CONFIG.apiBaseUrl + '/auth/me')
          .then(function (res) { return res.data.data; });
      };

      // ─── submitUpdateRequest ─────────────────────────────────────────────
      // POST /api/requests/edit-profile
      // Submits an edit-profile request for admin approval (not instant).
      // Body must match EditProfileRequest:
      //   { firstName, middleName, lastName, suffix, email }
      // Returns RequestResponse wrapped in ApiResponse at HTTP 201.
      // 201 is a 2xx — $http routes it to .then(), not .catch().
      // Controller reads res.message for the toast.
      self.submitUpdateRequest = function (data) {
        if (MOCK) {
          return $q.resolve({ message: 'Update request submitted.', success: true });
        }

        // REAL
        // C-08: was /customer/profile/update-request (does not exist)
        //       → /requests/edit-profile
        //       was res.data (ApiResponse) — kept as-is so controller
        //       can read .message directly
        return $http.post(APP_CONFIG.apiBaseUrl + '/requests/edit-profile', {
          firstName:  data.firstName,
          middleName: data.middleName,
          lastName:   data.lastName,
          suffix:     data.suffix,
          email:      data.email
        }).then(function (res) { return res.data; });
      };

    }
  ]);