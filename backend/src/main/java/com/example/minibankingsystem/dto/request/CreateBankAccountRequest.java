package com.example.minibankingsystem.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateBankAccountRequest {
    @NotNull(message = "error.user.id.missing")
    private Long userId;
    @NotBlank(message = "error.account.type.missing")
    private String accountType;
}
