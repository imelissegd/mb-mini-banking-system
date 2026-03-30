package com.example.minibankingsystem.service;

import com.example.minibankingsystem.component.UserSpecification;
import com.example.minibankingsystem.dto.response.UserResponse;
import com.example.minibankingsystem.exception.MissingFieldsException;
import com.example.minibankingsystem.exception.ResourceNotFoundException;
import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl {
    @Autowired
    UserRepository userRepository;

    // Functions used by other services
    public boolean userExistsById(Long id) {
        return userRepository.existsById(id);
    }

    public boolean isUserActive(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        return user.isActive();
    }

    public User getUserById(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;
        return user;
    }

    public User getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return null;
        return user;
    }


    // Admin functions
    public UserResponse getUserDetails(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new ResourceNotFoundException(ResourceNotFoundException.USER_ID, String.valueOf(userId));
        };
        return mapToUserResponse(user);
    }


    public Page<UserResponse> getUsers(
            String username,
            String firstName,
            String lastName,
            Pageable pageable) {

        Specification<User> spec = UserSpecification.withFilters(
                username, firstName, lastName);

        return userRepository.findAll(spec, pageable)
                .map(this::mapToUserResponse);
    }

    public UserResponse toggleUserActive(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if  (user == null) {
            throw new ResourceNotFoundException(ResourceNotFoundException.USER_ID, String.valueOf(userId));
        }
        user.setActive(!user.isActive());
        userRepository.save(user);
        return mapToUserResponse(user);
    }


    // Helper functions
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .middleName(user.getMiddleName())
                .lastName(user.getLastName())
                .suffix(user.getSuffix())
                .email(user.getEmail())
                .contactNumber(user.getContactNumber())
                .role(user.getRole())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
