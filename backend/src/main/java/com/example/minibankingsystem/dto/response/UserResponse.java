package com.example.minibankingsystem.dto.response;

import com.example.minibankingsystem.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private String firstName;
    private String middleName;
    private String lastName;
    private String suffix;
    private String email;
    private String contactNumber;
    private Role role;
    private boolean isActive;
    private LocalDateTime createdAt;
}