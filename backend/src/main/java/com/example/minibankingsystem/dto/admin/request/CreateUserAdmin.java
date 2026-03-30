package com.example.minibankingsystem.dto.admin.request;


import com.example.minibankingsystem.dto.request.RegisterRequest;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
public class CreateUserAdmin extends RegisterRequest {
    @NotBlank(message = "{error.user.role.missing}")
    private String role;
}
