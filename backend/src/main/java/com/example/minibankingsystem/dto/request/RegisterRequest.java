package com.example.minibankingsystem.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String firstName;

    private String middleName;

    @NotBlank
    private String lastName;

    private String suffix;

    @NotBlank
    private String email;
    @NotBlank
    private String contactNumber;
    @NotBlank
    private String password;
}
