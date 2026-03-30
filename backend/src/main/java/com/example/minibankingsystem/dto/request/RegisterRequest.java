package com.example.minibankingsystem.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message="{error.user.username.missing}")
    private String username;
    @NotBlank(message="{error.user.first.name.missing}")
    private String firstName;
    private String middleName;
    @NotBlank(message="{error.user.last.name.missing}")
    private String lastName;
    private String suffix;

    @NotBlank(message="{error.user.email.missing}")
    private String email;
    @NotBlank(message="{error.user.contact.number.missing}")
    private String contactNumber;
    @NotBlank(message="{error.user.password.missing}")
    private String password;
}
