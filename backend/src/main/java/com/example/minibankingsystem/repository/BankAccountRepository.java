package com.example.minibankingsystem.repository;

import com.example.minibankingsystem.model.BankAccount;
import com.example.minibankingsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    boolean existsByAccountNumber(String accountNumber);
    Long countByUser(User user);
}
