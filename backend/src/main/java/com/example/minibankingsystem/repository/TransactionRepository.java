package com.example.minibankingsystem.repository;

import com.example.minibankingsystem.model.BankAccount;
import com.example.minibankingsystem.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    @Query("""
        SELECT t FROM Transaction t
        LEFT JOIN t.fromAccount fa
        LEFT JOIN t.toAccount ta
        WHERE fa.id = :accountId OR ta.id = :accountId
        ORDER BY t.timestamp DESC
        """)
    List<Transaction> findRecentByAccountId(@Param("accountId") Long accountId,
                                            Pageable pageable);

    @Query("""
        SELECT t FROM Transaction t
        LEFT JOIN t.fromAccount fa
        LEFT JOIN t.toAccount ta
        WHERE fa.user.id = :userId OR ta.user.id = :userId
        ORDER BY t.timestamp DESC
        """)
    List<Transaction> findRecentByUserId(@Param("userId") Long userId,
                                         Pageable pageable);

    Page<Transaction> findAll(Specification<Transaction> spec, Pageable pageable);

}
