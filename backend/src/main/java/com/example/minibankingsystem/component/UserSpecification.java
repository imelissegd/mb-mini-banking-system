package com.example.minibankingsystem.component;

import com.example.minibankingsystem.model.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class UserSpecification {

    public static Specification<User> withFilters(
            String username,
            String firstName,
            String lastName) {

        return Specification
                .where(usernameContainsIgnoreCase(username))
                .and(firstNameContainsIgnoreCase(firstName))
                .and(lastNameContainsIgnoreCase(lastName));
    }

    private static Specification<User> usernameContainsIgnoreCase(String username) {
        return (root, query, cb) -> {
            if (username == null || username.isBlank()) return null;
            return cb.like(
                    cb.lower(root.get("username")),
                    "%" + username.toLowerCase() + "%"
            );
        };
    }

    private static Specification<User> firstNameContainsIgnoreCase(String firstName) {
        return (root, query, cb) -> {
            if (firstName == null || firstName.isBlank()) return null;
            return cb.like(
                    cb.lower(root.get("firstName")),
                    "%" + firstName.toLowerCase() + "%"
            );
        };
    }

    private static Specification<User> lastNameContainsIgnoreCase(String lastName) {
        return (root, query, cb) -> {
            if (lastName == null || lastName.isBlank()) return null;
            return cb.like(
                    cb.lower(root.get("lastName")),
                    "%" + lastName.toLowerCase() + "%"
            );
        };
    }
}