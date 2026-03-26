package com.example.minibankingsystem.dto.response;

import com.example.minibankingsystem.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String firstName;
    private String middleName;
    private String lastName;
    private String suffix;
    private String email;
    private Role role;
    private boolean isActive;
}