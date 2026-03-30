angular.module('bankingApp')
  .service('ProfileService', ['$http', '$q', 'APP_CONFIG',
    function ($http, $q, APP_CONFIG) {

      var self = this;

      // ─── MOCK FLAG ──────────────────────────────────────────────────────
      // Set to false when the backend is ready.
      var MOCK = true;

      // ─── getMyProfile ────────────────────────────────────────────────────
      // Returns the logged-in customer's profile information.
      self.getMyProfile = function () {
        if (MOCK) {
          // MOCK
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
          // END MOCK
        }

        // REAL
        return $http.get(APP_CONFIG.apiBaseUrl + '/customer/profile')
          .then(function (res) { return res.data; });
      };

      // ─── submitUpdateRequest ─────────────────────────────────────────────
      // Submits a profile update request for admin approval.
      // data: { firstName, middleName, lastName, suffix, email }
      self.submitUpdateRequest = function (data) {
        if (MOCK) {
          // MOCK
          return $q.resolve({ message: 'Update request submitted.', success: true });
          // END MOCK
        }

        // REAL
        return $http.post(APP_CONFIG.apiBaseUrl + '/customer/profile/update-request', {
          firstName:  data.firstName,
          middleName: data.middleName,
          lastName:   data.lastName,
          suffix:     data.suffix,
          email:      data.email
        }).then(function (res) { return res.data; });
      };

    }
  ]);