package com.example.minibankingsystem.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionTokenResponse {
    private String transactionToken;
    private String action;
    private Long accountId;

    /** Expiry in seconds from now (default: 300) */
    private long expiresIn;
}