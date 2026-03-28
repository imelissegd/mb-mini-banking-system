package com.example.minibankingsystem.service;

import com.example.minibankingsystem.config.security.CustomUserDetailsService;
import com.example.minibankingsystem.config.security.JwtUtil;
import com.example.minibankingsystem.dto.admin.request.CreateUserAdmin;
import com.example.minibankingsystem.dto.request.LoginRequest;
import com.example.minibankingsystem.dto.request.RegisterRequest;
import com.example.minibankingsystem.dto.response.AuthResponse;
import com.example.minibankingsystem.dto.response.UserResponse;
import com.example.minibankingsystem.exception.MissingFieldsException;
import com.example.minibankingsystem.exception.ResourceDuplicateException;
import com.example.minibankingsystem.exception.ResourceNotFoundException;
import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.model.enums.Role;
import com.example.minibankingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

import static com.example.minibankingsystem.service.AuthServiceImpl.ValidationRule.*;

@Service
public class AuthServiceImpl {

    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    UserRepository userRepository;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    CustomUserDetailsService customUserDetailsService;

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
        return mapToUserResponse(newUser);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User "  + request.getUsername() + " not found."));

        String accessToken  = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(mapToUserResponse(user))
                .build();
    }

    // for admin: includes role
    public UserResponse addUser(CreateUserAdmin createUserAdmin) {
        User newUser = createUserFromRequest(createUserAdmin);
        newUser.setRole(Role.valueOf(createUserAdmin.getRole()));
        newUser = userRepository.save(newUser);
        return mapToUserResponse(newUser);
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
