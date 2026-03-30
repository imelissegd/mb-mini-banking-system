package com.example.minibankingsystem.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EditProfileRequest {
    @Size(min = 3, max = 45, message = "{error.user.username.size}")
    private String username;

    @Size(max = 45, message = "{error.user.first.name.size}")
    private String firstName;

    @Size(max = 45, message = "{error.user.middle.name.size}")
    private String middleName;

    @Size(max = 45, message = "{error.user.last.name.size}")
    private String lastName;

    @Size(max = 45, message = "{error.user.suffix.size}")
    private String suffix;

    @Email(message = "{request.email.invalid}")
    private String email;

    @Size(max = 20, message = "{request.contactNumber.size}")
    private String contactNumber;
}
