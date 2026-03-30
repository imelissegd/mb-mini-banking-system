package com.example.minibankingsystem.component;

import com.example.minibankingsystem.model.BankAccount;
import com.example.minibankingsystem.model.enums.AccountStatus;
import com.example.minibankingsystem.model.enums.AccountType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class BankAccountSpecification {

    public static Specification<BankAccount> withFilters(
            String username,
            String accountNumber,
            AccountType accountType,
            AccountStatus status) {

        return Specification
                .where(usernameContainsIgnoreCase(username))
                .and(accountNumberContains(accountNumber))
                .and(hasAccountType(accountType))
                .and(hasStatus(status));
    }

    private static Specification<BankAccount> usernameContainsIgnoreCase(String username) {
        return (root, query, cb) -> {
            if (username == null || username.isBlank()) return null;
            return cb.like(
                    cb.lower(root.get("user").get("username")),
                    "%" + username.toLowerCase() + "%"
            );
        };
    }

    private static Specification<BankAccount> accountNumberContains(String accountNumber) {
        return (root, query, cb) -> {
            if (accountNumber == null || accountNumber.isBlank()) return null;
            return cb.like(
                    root.get("accountNumber"),
                    "%" + accountNumber + "%"
            );
        };
    }

    private static Specification<BankAccount> hasAccountType(AccountType accountType) {
        return (root, query, cb) -> {
            if (accountType == null) return null;
            return cb.equal(root.get("accountType"), accountType);
        };
    }

    private static Specification<BankAccount> hasStatus(AccountStatus status) {
        return (root, query, cb) -> {
            if (status == null) return null;
            return cb.equal(root.get("status"), status);
        };
    }
}