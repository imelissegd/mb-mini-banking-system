package com.example.minibankingsystem.dto.request;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferRequest {

    /** The source account ID owned by the authenticated user. */
    @NotNull
    private Long fromAccountId;

    /** Destination account number (the payee). */
    @NotBlank
    private String toAccountNumber;

    @NotNull
    @DecimalMin(value = "0.01", message = "Transfer amount must be greater than zero")
    private BigDecimal amount;

    private String description;

    /**
     * Short-lived transaction token obtained from POST /api/accounts/transaction-token.
     * Must be scoped to fromAccountId with action "TRANSFER".
     */
    @NotBlank
    private String transactionToken;
}