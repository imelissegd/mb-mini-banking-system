package com.example.minibankingsystem.dto.admin.request;


import com.example.minibankingsystem.dto.request.RegisterRequest;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
public class CreateUserAdmin extends RegisterRequest {
    private String role;
}
