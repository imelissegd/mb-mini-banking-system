package com.example.minibankingsystem.component;

import com.example.minibankingsystem.model.BankAccount;
import com.example.minibankingsystem.model.Transaction;
import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.model.enums.TransactionType;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class TransactionSpecification {

    // ── Join key constants ────────────────────────────────────────────────────
    private static final String FROM_ACCOUNT = "fromAccount";
    private static final String TO_ACCOUNT   = "toAccount";
    private static final String USER         = "user";
    private static final String USERNAME     = "username";
    private static final String ACCOUNT_NUMBER = "accountNumber";
    private static final String ID           = "id";

    public static Specification<Transaction> withFilters(
            Long bankAccountId,
            String username,
            String accountNumber,
            TransactionType type,
            LocalDate startDate,
            LocalDate endDate) {

        return Specification
                .where(hasBankAccountId(bankAccountId))
                .and(usernameContainsIgnoreCase(username))
                .and(accountNumberContains(accountNumber))
                .and(hasTransactionType(type))
                .and(dateBetween(startDate, endDate));
    }

    // ── Reusable join helper — prevents duplicate joins ───────────────────────

    @SuppressWarnings("unchecked")
    private static <T> Join<Transaction, T> getOrCreateJoin(
            Root<Transaction> root, String attribute) {

        // Reuse existing join if already created by a previous spec in the same query
        return (Join<Transaction, T>) root.getJoins().stream()
                .filter(j -> j.getAttribute().getName().equals(attribute))
                .findFirst()
                .orElseGet(() -> root.join(attribute, JoinType.LEFT));
    }

    private static Specification<Transaction> hasBankAccountId(Long bankAccountId) {
        return (root, query, cb) -> {
            if (bankAccountId == null) return null;
            Join<Transaction, BankAccount> fromJoin = getOrCreateJoin(root, FROM_ACCOUNT);
            Join<Transaction, BankAccount> toJoin   = getOrCreateJoin(root, TO_ACCOUNT);
            return cb.or(
                    cb.equal(fromJoin.get(ID), bankAccountId),
                    cb.equal(toJoin.get(ID), bankAccountId)
            );
        };
    }

    private static Specification<Transaction> usernameContainsIgnoreCase(String username) {
        return (root, query, cb) -> {
            if (username == null || username.isBlank()) return null;
            Join<Transaction, BankAccount> fromJoin = getOrCreateJoin(root, FROM_ACCOUNT);
            Join<Transaction, BankAccount> toJoin   = getOrCreateJoin(root, TO_ACCOUNT);
            Join<BankAccount, User> fromUser = fromJoin.join(USER, JoinType.LEFT);
            Join<BankAccount, User> toUser   = toJoin.join(USER, JoinType.LEFT);
            String pattern = "%" + username.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(fromUser.get(USERNAME)), pattern),
                    cb.like(cb.lower(toUser.get(USERNAME)), pattern)
            );
        };
    }

    private static Specification<Transaction> accountNumberContains(String accountNumber) {
        return (root, query, cb) -> {
            if (accountNumber == null || accountNumber.isBlank()) return null;
            Join<Transaction, BankAccount> fromJoin = getOrCreateJoin(root, FROM_ACCOUNT);
            Join<Transaction, BankAccount> toJoin   = getOrCreateJoin(root, TO_ACCOUNT);
            String pattern = "%" + accountNumber + "%";
            return cb.or(
                    cb.like(fromJoin.get(ACCOUNT_NUMBER), pattern),
                    cb.like(toJoin.get(ACCOUNT_NUMBER), pattern)
            );
        };
    }

    private static Specification<Transaction> hasTransactionType(TransactionType type) {
        return (root, query, cb) -> {
            if (type == null) return null;
            return cb.equal(root.get("type"), type);
        };
    }

    private static Specification<Transaction> dateBetween(
            LocalDate startDate, LocalDate endDate) {
        return (root, query, cb) -> {
            if (startDate == null && endDate == null) return null;
            Path<LocalDateTime> datePath = root.get("timestamp");

            if (startDate != null && endDate != null) {
                return cb.between(
                        datePath,
                        startDate.atStartOfDay(),
                        endDate.atTime(LocalTime.MAX)
                );
            } else if (startDate != null) {
                return cb.greaterThanOrEqualTo(datePath, startDate.atStartOfDay());
            } else {
                return cb.lessThanOrEqualTo(datePath, endDate.atTime(LocalTime.MAX));
            }
        };
    }
}