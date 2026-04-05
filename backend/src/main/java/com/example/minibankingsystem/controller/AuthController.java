package com.example.minibankingsystem.controller;

import com.example.minibankingsystem.component.CookieUtil;
import com.example.minibankingsystem.component.MessageHelper;
import com.example.minibankingsystem.dto.request.CreateBankAccountRequest;
import com.example.minibankingsystem.dto.request.LoginRequest;
import com.example.minibankingsystem.dto.request.RegisterRequest;
import com.example.minibankingsystem.dto.response.ApiResponse;
import com.example.minibankingsystem.dto.response.AuthResponse;
import com.example.minibankingsystem.dto.response.UserResponse;
import com.example.minibankingsystem.service.AuthServiceImpl;
import com.example.minibankingsystem.service.BankAccountServiceImpl;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        private static final Logger log = LoggerFactory.getLogger(AuthController.class);

        @Autowired
        private AuthServiceImpl authService;
        @Autowired
        private BankAccountServiceImpl bankAccountService;
        @Autowired
        private CookieUtil cookieUtil;

        // ─── Register ────────────────────────────────────────────────────────────
        // Public endpoint — no token required.
        // Creates the user and auto-creates a default CHECKING bank account.
        // Returns 201 with the new UserResponse (no login, redirect to /login).
        @PostMapping("/register")
        public ResponseEntity<ApiResponse<UserResponse>> register(
                        @Valid @RequestBody RegisterRequest request) {

                UserResponse response = authService.registerUser(request);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.success(MessageHelper.get("success.auth.register"), response));
        }

        // ─── Login ───────────────────────────────────────────────────────────────
        // Public endpoint — no token required.
        // Authenticates credentials via AuthService.
        // On success: sets two HttpOnly cookies via response headers:
        // - access_token: short-lived (e.g. 15 min), used for all API calls
        // - refresh_token: longer-lived (e.g. 7 days), used to silently refresh
        // Returns the UserResponse in the body — no token in the body.
        // The frontend calls GET /auth/me after this to populate its in-memory user.
        @PostMapping("/login")
        public ResponseEntity<ApiResponse<UserResponse>> login(
                        @Valid @RequestBody LoginRequest request) {

                AuthResponse response = authService.login(request);

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE,
                                                cookieUtil.createAccessTokenCookie(response.getAccessToken())
                                                                .toString())
                                .header(HttpHeaders.SET_COOKIE,
                                                cookieUtil.createRefreshTokenCookie(response.getRefreshToken())
                                                                .toString())
                                .body(ApiResponse.success(MessageHelper.get("success.auth.login"), response.getUser()));
        }

        // ─── Me ──────────────────────────────────────────────────────────────────
        // Protected endpoint — requires a valid access_token cookie.
        // JwtAuthFilter runs for this path (it is NOT in the shouldNotFilter skip
        // list).
        // If the cookie is valid, Spring Security populates @AuthenticationPrincipal.
        // If the cookie is absent or expired, @AuthenticationPrincipal is null → 401.
        //
        // Called by the frontend:
        // 1. On every page load / refresh to restore in-memory user state (Option A).
        // 2. Immediately after POST /auth/login to populate currentUser.
        //
        // Returns: ApiResponse<UserResponse> with id, username, firstName, lastName,
        // email, role, isActive — everything the frontend needs for display
        // and role-based routing. No sensitive data (no password hash, etc.).
        @GetMapping("/me")
        public ResponseEntity<ApiResponse<UserResponse>> me(
                        @AuthenticationPrincipal UserDetails userDetails) {

                if (userDetails == null) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(ApiResponse.error("Not authenticated"));
                }

                UserResponse user = authService.getUserByUsername(userDetails.getUsername());
                return ResponseEntity.ok(ApiResponse.success(MessageHelper.get("success.user.retrieved"), user));
        }

        // ─── Logout ──────────────────────────────────────────────────────────────
        // Public endpoint — intentionally permit-all so it works even if the
        // access token has already expired (user should always be able to log out).
        // Clears both HttpOnly cookies by setting them with maxAge=0.
        // The browser deletes a cookie immediately when it receives maxAge=0.
        // Frontend clears its in-memory currentUser and redirects to /login.
        @PostMapping("/logout")
        public ResponseEntity<ApiResponse<Void>> logout() {
                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE,
                                                cookieUtil.deleteAccessTokenCookie().toString())
                                .header(HttpHeaders.SET_COOKIE,
                                                cookieUtil.deleteRefreshTokenCookie().toString())
                                .body(ApiResponse.success(MessageHelper.get("success.auth.logout"), null));
        }
}