package com.example.minibankingsystem.service;

import com.example.minibankingsystem.dto.request.RegisterRequest;
import com.example.minibankingsystem.dto.response.UserResponse;
import com.example.minibankingsystem.exceptions.MissingFieldsException;
import com.example.minibankingsystem.exceptions.ResourceDuplicateException;
import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.model.enums.Role;
import com.example.minibankingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.minibankingsystem.service.AuthServiceImpl.ValidationRule.*;

import java.time.LocalDateTime;
import java.util.Set;

import static com.example.minibankingsystem.service.AuthServiceImpl.ValidationRule.*;

@Service
public class AuthServiceImpl {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UserRepository userRepository;

    enum ValidationRule {
        CHECK_ID,
        CHECK_USERNAME,
        CHECK_NAME,
        CHECK_EMAIL,
        CHECK_CONTACTNUMBER,
        CHECK_PASSWORD,
        CHECK_ROLE,
        CHECK_EXISTS,
    }

    public UserResponse registerUser(RegisterRequest registerRequest) {

        validateUser(registerRequest,
                CHECK_USERNAME, CHECK_NAME, CHECK_EMAIL, CHECK_CONTACTNUMBER,
                CHECK_PASSWORD);

        User newUser = createUserFromRequest(registerRequest);
        newUser.setRole(Role.valueOf("CUSTOMER"));
        newUser = userRepository.save(newUser);
        return createUserResponseFromRequest(newUser);
    }

    private User createUserFromRequest(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setFirstName(request.getFirstName());
        user.setMiddleName(request.getMiddleName());
        user.setLastName(request.getLastName());
        user.setSuffix(request.getSuffix());
        user.setEmail(request.getEmail());
        user.setContactNumber(request.getContactNumber());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }

    private UserResponse createUserResponseFromRequest(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setEmail(user.getEmail());
        userResponse.setContactNumber(user.getContactNumber());
        userResponse.setRole(user.getRole());
        userResponse.setActive(user.isActive());
        return userResponse;
    }


    private void validateUser(RegisterRequest registerRequest, ValidationRule... rules) {
        Set<ValidationRule> ruleSet = Set.of(rules);

        if (ruleSet.contains(CHECK_USERNAME)) {
            if (registerRequest.getUsername() == null || registerRequest.getUsername().isBlank()) {
                throw new MissingFieldsException(MissingFieldsException.USER_USERNAME);
            }
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                throw new ResourceDuplicateException(ResourceDuplicateException.USER_USERNAME);
            }
        }

        if (ruleSet.contains(CHECK_NAME)) {
            if (registerRequest.getFirstName() == null || registerRequest.getFirstName().isBlank()) {
                throw new MissingFieldsException(MissingFieldsException.USER_FIRSTNAME);
            }
            if (registerRequest.getLastName() == null || registerRequest.getLastName().isBlank()) {
                throw new MissingFieldsException(MissingFieldsException.USER_LASTNAME);
            }
        }

//        if (ruleSet.contains(CHECK_ID) && registerRequest.getUserId() == null) {
//            throw new MissingFieldsException(MissingFieldsException.USER_ID);
//        }

        if (ruleSet.contains(CHECK_EMAIL)) {
            if (registerRequest.getEmail() == null || registerRequest.getEmail().isBlank()) {
                throw new MissingFieldsException(MissingFieldsException.USER_EMAIL);
            }
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                throw new ResourceDuplicateException(ResourceDuplicateException.USER_EMAIl);
            }
        }


        if (ruleSet.contains(CHECK_CONTACTNUMBER)) {
            if (registerRequest.getContactNumber() == null || registerRequest.getContactNumber().isBlank()) {
                throw new MissingFieldsException(MissingFieldsException.USER_CONTACTNUMBER);
            }
            if (userRepository.existsByContactNumber(registerRequest.getContactNumber())) {
                throw new ResourceDuplicateException(ResourceDuplicateException.USER_CONTACTNUMBER);
            }
        }

        if (ruleSet.contains(CHECK_PASSWORD) &&
                (registerRequest.getPassword() == null || registerRequest.getPassword().isBlank())) {
            throw new MissingFieldsException(MissingFieldsException.USER_PASSWORD);
        }

//        if (ruleSet.contains(CHECK_ROLE) &&
//                (registerRequest.getRole() == null || registerRequest.getRole().isBlank())) {
//            throw new MissingFieldsException(MissingFieldsException.USER_ROLE);
//        }

//        if (ruleSet.contains(CHECK_EXISTS)) {
//            userRepository.findById(registerRequest.getUserId())
//                    .orElseThrow(() -> new UserNotFoundException(registerRequest.getUserId()));
//        }
    }

}
