package com.example.minibankingsystem.service;

import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
}
