package com.example.minibankingsystem.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class TransactionTokenRequest {
    @NotNull
    private Long accountId;
    @NotBlank
    private String action; // e.g. "TRANSFER", "WITHDRAWAL, DEPOSIT"
}