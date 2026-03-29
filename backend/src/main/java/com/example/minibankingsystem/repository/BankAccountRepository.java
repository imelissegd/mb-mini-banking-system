package com.example.minibankingsystem.repository;

import com.example.minibankingsystem.model.BankAccount;
import com.example.minibankingsystem.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    boolean existsByAccountNumber(String accountNumber);
    Long countByUser(User user);
    Optional<BankAccount> findByAccountNumberAndUserId(String accountNumber, Long userId);

    Optional<BankAccount> findByAccountNumber(String accountNumber);

    Page<BankAccount> findByUserId(Long id, Pageable pageable);
}
