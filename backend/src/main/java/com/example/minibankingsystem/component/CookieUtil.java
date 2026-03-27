package com.example.minibankingsystem.component;

import com.example.minibankingsystem.config.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CookieUtil {

    @Autowired
    private final JwtUtil jwtUtil;

    @Value("${app.cookie.secure:false}")
    private boolean secure;

    public ResponseCookie createAccessTokenCookie(String token) {
        return buildCookie("access_token", token,
                jwtUtil.getAccessTokenExpiration() / 1000); // ms → seconds
    }

    public ResponseCookie createRefreshTokenCookie(String token) {
        return buildCookie("refresh_token", token,
                jwtUtil.getRefreshTokenExpiration() / 1000); // ms → seconds
    }

    public ResponseCookie deleteAccessTokenCookie() {
        return buildCookie("access_token", "", 0);
    }

    public ResponseCookie deleteRefreshTokenCookie() {
        return buildCookie("refresh_token", "", 0);
    }

    private ResponseCookie buildCookie(String name, String value, long maxAgeSeconds) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(maxAgeSeconds)
                .sameSite("Strict")
                .build();
    }
}