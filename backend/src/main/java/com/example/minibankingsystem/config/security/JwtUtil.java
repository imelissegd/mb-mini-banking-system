package com.example.minibankingsystem.config.security;

import com.example.minibankingsystem.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@Slf4j
public class JwtUtil {

    private static final String TOKEN_TYPE_CLAIM = "token_type";
    private static final String ACCESS   = "ACCESS";
    private static final String REFRESH  = "REFRESH";
    private static final String TRANSACTION = "TRANSACTION";

    @Value("${jwt.secret}")
    private String secret;

    // Getters
    @Getter
    @Value("${jwt.access-token.expiration}")
    private long accessTokenExpiration;

    @Getter
    @Value("${jwt.refresh-token.expiration}")
    private long refreshTokenExpiration;

    @Value("${jwt.transaction-token.expiration}")
    private long transactionTokenExpiration;


    public String generateAccessToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(TOKEN_TYPE_CLAIM, ACCESS);
        return buildToken(claims, user.getUsername(), accessTokenExpiration);
    }

    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(TOKEN_TYPE_CLAIM, REFRESH);
        return buildToken(claims, user.getUsername(), refreshTokenExpiration);
    }

    /**
     * Transaction token: short-lived, scoped to a specific account and action.
     * This token must be presented alongside the access token when executing a transfer.
     */
    public String generateTransactionToken(String username, Long accountId, String action) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(TOKEN_TYPE_CLAIM, TRANSACTION);
        claims.put("account_id", accountId);
        claims.put("action", action);
        return buildToken(claims, username, transactionTokenExpiration);
    }

    private String buildToken(Map<String, Object> extraClaims, String subject, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }


    // Validation

    public boolean isAccessToken(String token) {
        return ACCESS.equals(extractClaim(token, c -> c.get(TOKEN_TYPE_CLAIM, String.class)));
    }

    public boolean isRefreshToken(String token) {
        return REFRESH.equals(extractClaim(token, c -> c.get(TOKEN_TYPE_CLAIM, String.class)));
    }

    public boolean isTransactionToken(String token) {
        return TRANSACTION.equals(extractClaim(token, c -> c.get(TOKEN_TYPE_CLAIM, String.class)));
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public boolean isTransactionTokenValid(String token, String username, Long accountId, String action) {
        try {
            Claims claims = extractAllClaims(token);
            boolean usernameMatches = username.equals(claims.getSubject());
            boolean accountMatches = accountId.equals(claims.get("account_id", Long.class));
            boolean actionMatches = action.equals(claims.get("action", String.class));
            boolean notExpired = !isTokenExpired(token);
            boolean isTransactionType = TRANSACTION.equals(claims.get(TOKEN_TYPE_CLAIM, String.class));
            return usernameMatches && accountMatches && actionMatches && notExpired && isTransactionType;
        } catch (JwtException e) {
            log.warn("Transaction token validation failed: {}", e.getMessage());
            return false;
        }
    }


    // Extraction

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractAccountId(String token) {
        return extractClaim(token, c -> c.get("account_id", Long.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

}