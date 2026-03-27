package com.example.minibankingsystem.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String firstName;
    private String middleName;
    private String lastName;
    private String suffix;

    private String email;
    private String contactNumber;
    private String password;
}
