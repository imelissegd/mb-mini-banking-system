package com.example.minibankingsystem.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message="{error.user.username.missing}")
    private String username;
    @NotBlank(message="{error.user.password.missing}")
    private String password;
}
