package com.example.minibankingsystem.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "{error.user.username.missing}")
    @Size(min = 3, max = 45, message = "{error.user.username.size}")
    private String username;

    @NotBlank(message = "{error.user.first.name.missing}")
    @Size(max = 45, message = "{error.user.first.name.size}")
    private String firstName;

    @Size(max = 45, message = "{error.user.middle.name.size}")
    private String middleName;

    @NotBlank(message = "{error.user.last.name.missing}")
    @Size(max = 45, message = "{error.user.last.name.size}")
    private String lastName;

    @Size(max = 45, message = "{error.user.suffix.size}")
    private String suffix;

    @NotBlank(message = "{error.user.email.missing}")
    @Email(message = "{error.user.email.invalid}")
    private String email;

    @NotBlank(message = "{error.user.contact.number.missing}")
    @Size(max = 20, message = "{error.user.contact.number.size}")
    private String contactNumber;

    @NotBlank(message = "{error.user.password.missing}")
    @Size(min = 8, message = "{error.user.password.size}")
    private String password;
}
