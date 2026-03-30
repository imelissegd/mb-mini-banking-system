package com.example.minibankingsystem.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateBankAccountRequest {
    private Long userId;
    @NotBlank(message = "{error.account.type.missing}")
    private String accountType; //CHECKING, SAVINGS
    private BigDecimal initialBalance;
}
