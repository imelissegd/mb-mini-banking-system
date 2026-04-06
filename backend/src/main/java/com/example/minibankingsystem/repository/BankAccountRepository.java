package com.example.minibankingsystem.repository;

import com.example.minibankingsystem.model.BankAccount;
import com.example.minibankingsystem.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long>, JpaSpecificationExecutor<BankAccount> {
    boolean existsByAccountNumber(String accountNumber);
    Long countByUser(User user);
    Optional<BankAccount> findByAccountNumberAndUserId(String accountNumber, Long userId);

    Optional<BankAccount> findByAccountNumber(String accountNumber);

    Page<BankAccount> findByUserId(Long id, Pageable pageable);

    Page<BankAccount> findAll(Specification<BankAccount> spec, Pageable pageable);

    @Query("SELECT SUM(b.balance) FROM BankAccount b")
    BigDecimal sumAllBalances();

    @Query("SELECT COUNT(b) FROM BankAccount b")
    Long countAllAccounts();

}
