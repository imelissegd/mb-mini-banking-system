package com.example.minibankingsystem.service;

import com.example.minibankingsystem.component.UserSpecification;
import com.example.minibankingsystem.dto.request.EditProfileRequest;
import com.example.minibankingsystem.dto.response.UserResponse;
import com.example.minibankingsystem.exception.MissingFieldsException;
import com.example.minibankingsystem.exception.ResourceDuplicateException;
import com.example.minibankingsystem.exception.ResourceNotFoundException;
import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.model.enums.Role;
import com.example.minibankingsystem.repository.UserRepository;

import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl {
    @Autowired
    UserRepository userRepository;

    // Functions used by other services
    public boolean userExistsById(Long id) {
        return userRepository.existsById(id);
    }

    public void usernameExists(Long userId, String username) {
        if (username == null) {
            return;
        }
        User user = userRepository.findById(userId).orElse(null);
        if (user != null && !user.getId().equals(userId)) {
            throw new ResourceDuplicateException(
                    ResourceDuplicateException.USER_USERNAME, username);
        }
    }

    public void emailExists(Long userId, String email) {
        if (email == null) {
            return;
        }
        User user = userRepository.findById(userId).orElse(null);
        if (user != null && !user.getEmail().equals(email)) {
            throw new ResourceDuplicateException(
                    ResourceDuplicateException.USER_EMAIl, email);
        }
    }

    public void contactExists(Long userId, String contact) {
        if (contact == null) {
            return;
        }
        User user = userRepository.findById(userId).orElse(null);
        if (user != null && !user.getContactNumber().equals(contact)) {
            throw new ResourceDuplicateException(
                    ResourceDuplicateException.USER_CONTACTNUMBER, contact);
        }
    }

    public boolean isUserActive(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new ResourceNotFoundException(ResourceNotFoundException.USER_ID, String.valueOf(userId));
        }
        return user.isActive();
    }

    public User getUserById(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new ResourceNotFoundException(ResourceNotFoundException.USER_ID, String.valueOf(userId));
        }
        ;
        return user;
    }

    public User getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            throw new ResourceNotFoundException(ResourceNotFoundException.USER_NAME, username);
        }
        ;
        return user;
    }

    // Admin functions
    public UserResponse getUserDetails(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new ResourceNotFoundException(ResourceNotFoundException.USER_ID, String.valueOf(userId));
        }
        ;
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

    @Transactional
    public void updateProfile(Long userId, String username, EditProfileRequest dto) {
        User user = getUserByUsername(username);
        if (dto.getUsername() != null) {
            checkUsername(userId, dto.getUsername());
            user.setUsername(dto.getUsername());
        }
        if (dto.getFirstName() != null)
            user.setFirstName(dto.getFirstName());
        if (dto.getMiddleName() != null)
            user.setMiddleName(dto.getMiddleName());
        if (dto.getLastName() != null)
            user.setLastName(dto.getLastName());
        if (dto.getSuffix() != null)
            user.setSuffix(dto.getSuffix());
        if (dto.getEmail() != null) {
            checkEmail(userId, dto.getEmail());
            user.setEmail(dto.getEmail());
        }
        if (dto.getContactNumber() != null) {
            checkContactNumber(userId, dto.getContactNumber());
            user.setContactNumber(dto.getContactNumber());
        }

        userRepository.save(user);
    }

    public UserResponse toggleUserActive(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new ResourceNotFoundException(ResourceNotFoundException.USER_ID, String.valueOf(userId));
        }
        user.setActive(!user.isActive());
        userRepository.save(user);
        return mapToUserResponse(user);
    }

    public Long countAllUsers() {
        return userRepository.countAllUsers();
    }

    public Long countAllCustomers() {
        return userRepository.countByRole(Role.CUSTOMER);
    }

    private void checkUsername(Long userId, String username) {
        if (username == null || username.isBlank()) {
            throw new MissingFieldsException(MissingFieldsException.USER_USERNAME);
        }
        User user = userRepository.findById(userId).orElse(null);
        if (user != null && !user.getId().equals(userId)) {
            throw new ResourceDuplicateException(
                    ResourceDuplicateException.USER_USERNAME, username);
        }
    }

    private void checkEmail(Long userId, String email) {
        if (email == null || email.isBlank()) {
            throw new MissingFieldsException(MissingFieldsException.USER_EMAIL);
        }
        User user = userRepository.findById(userId).orElse(null);
        if (user != null && !user.getEmail().equals(email)) {
            throw new ResourceDuplicateException(
                    ResourceDuplicateException.USER_EMAIl, email);
        }
    }

    private void checkContactNumber(Long userId, String contactNumber) {
        if (contactNumber == null || contactNumber.isBlank()) {
            throw new MissingFieldsException(MissingFieldsException.USER_CONTACTNUMBER);
        }
        User user = userRepository.findById(userId).orElse(null);
        if (user != null && !user.getContactNumber().equals(contactNumber)) {
            throw new ResourceDuplicateException(
                    ResourceDuplicateException.USER_CONTACTNUMBER, contactNumber);
        }
    }

    private String formatOwnerName(User user) {
        return Stream.of(
                user.getFirstName(),
                user.getMiddleName(),
                user.getLastName(),
                user.getSuffix())
                .filter(part -> part != null && !part.isBlank())
                .collect(Collectors.joining(" "));
    }

    // Helper functions
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .middleName(user.getMiddleName())
                .lastName(user.getLastName())
                .fullName(formatOwnerName(user))
                .suffix(user.getSuffix())
                .email(user.getEmail())
                .contactNumber(user.getContactNumber())
                .role(user.getRole())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
