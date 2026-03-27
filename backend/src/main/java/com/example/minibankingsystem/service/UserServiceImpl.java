package com.example.minibankingsystem.service;

import com.example.minibankingsystem.dto.response.UserResponse;
import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl {
    @Autowired
    UserRepository userRepository;

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

    public UserResponse getUserDetails(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;
        return mapToUserResponse(user);
    }

    public Page<UserResponse> getUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(this::mapToUserResponse);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .middleName(user.getMiddleName())
                .lastName(user.getLastName())
                .suffix(user.getSuffix())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.isActive())
                .build();
    }
}
