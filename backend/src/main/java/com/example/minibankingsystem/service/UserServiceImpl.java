package com.example.minibankingsystem.service;

import com.example.minibankingsystem.component.UserSpecification;
import com.example.minibankingsystem.dto.request.EditProfileRequest;
import com.example.minibankingsystem.dto.response.UserResponse;
import com.example.minibankingsystem.exception.MissingFieldsException;
import com.example.minibankingsystem.exception.ResourceDuplicateException;
import com.example.minibankingsystem.exception.ResourceNotFoundException;
import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.repository.UserRepository;
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
        };
        return user;
    }

    public User getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            throw new ResourceNotFoundException(ResourceNotFoundException.USER_NAME, username);
        };
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

    @Transactional
    public void updateProfile(String username, EditProfileRequest dto) {
        User user = getUserByUsername(username);
        if (dto.getUsername() != null) {
            checkUsername(dto.getUsername());
            user.setUsername(dto.getUsername());
        }
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getMiddleName() != null)    user.setMiddleName(dto.getMiddleName());
        if (dto.getLastName() != null)  user.setLastName(dto.getLastName());
        if (dto.getSuffix() != null)    user.setSuffix(dto.getSuffix());
        if (dto.getEmail() != null) {
            checkEmail(dto.getEmail());
            user.setEmail(dto.getEmail());
        }
        if (dto.getContactNumber() != null) {
            checkContactNumber(dto.getContactNumber());
            user.setContactNumber(dto.getContactNumber());
        }

        userRepository.save(user);
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

    private void checkUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new MissingFieldsException(MissingFieldsException.USER_USERNAME);
        }
        if (userRepository.existsByUsername(username)) {
            throw new ResourceDuplicateException(
                    ResourceDuplicateException.USER_USERNAME, username);
        }
    }

    private void checkEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new MissingFieldsException(MissingFieldsException.USER_EMAIL);
        }
        if (userRepository.existsByEmail(email)) {
            throw new ResourceDuplicateException(
                    ResourceDuplicateException.USER_EMAIl, email);
        }
    }

    private void checkContactNumber(String contactNumber) {
        if (contactNumber == null || contactNumber.isBlank()) {
            throw new MissingFieldsException(MissingFieldsException.USER_CONTACTNUMBER);
        }
        if (userRepository.existsByContactNumber(contactNumber)) {
            throw new ResourceDuplicateException(
                    ResourceDuplicateException.USER_CONTACTNUMBER, contactNumber);
        }
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
