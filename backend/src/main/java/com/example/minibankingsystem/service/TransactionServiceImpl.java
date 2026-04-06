package com.example.minibankingsystem.service;

import com.example.minibankingsystem.component.TransactionSpecification;
import com.example.minibankingsystem.config.security.JwtUtil;
import com.example.minibankingsystem.dto.request.TransferRequest;
import com.example.minibankingsystem.dto.response.TransactionResponse;
import com.example.minibankingsystem.exception.*;
import com.example.minibankingsystem.model.BankAccount;
import com.example.minibankingsystem.model.Transaction;
import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.model.enums.AccountStatus;
import com.example.minibankingsystem.model.enums.TransactionType;
import com.example.minibankingsystem.repository.BankAccountRepository;
import com.example.minibankingsystem.repository.TransactionRepository;
import com.example.minibankingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static com.example.minibankingsystem.service.BankAccountServiceImpl.AccountValidationRule.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl {

    private final TransactionRepository transactionRepository;
    private final BankAccountServiceImpl bankAccountService;
    private final UserServiceImpl userService;
    private final JwtUtil jwtUtil;

    // Account Transactions
    @Transactional
    public TransactionResponse transfer(String username, TransferRequest request) {

//        validateTransactionToken(
//                request.getTransactionToken(),
//                username,
//                request.getFromAccountNumber(),
//                "TRANSFER"
//        );

        if (request.getFromAccountNumber() == null || request.getFromAccountNumber().isBlank()) {
            throw new MissingFieldsException(MissingFieldsException.FROM_BANK_ACCOUNT_NUMBER);
        }
        if (request.getToAccountNumber() == null || request.getToAccountNumber().isBlank()) {
            throw new MissingFieldsException(MissingFieldsException.TO_BANK_ACCOUNT_NUMBER);
        }

        BankAccount source = bankAccountService
                .getAccountOwnedByUser(request.getFromAccountNumber(), username);

        BankAccount destination = bankAccountService
                .getAccountByAccountNumber(request.getToAccountNumber());


        // Check if account is allowed for transfer
        bankAccountService.validateAccount(
                source,
                username,
                request.getAmount(),
                CHECK_OPEN,
                CHECK_SUFFICIENT_FUNDS
        );

        // Check if destination is valid
        bankAccountService.validateAccount(
                destination,
                null,
                null,
                CHECK_OPEN
        );

        // Cannot transfer to same account
        if (source.getAccountNumber().equals(destination.getAccountNumber())) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        // Bank account service performs the debit and credit
        bankAccountService.debit(source, request.getAmount());
        bankAccountService.credit(destination, request.getAmount());


        Transaction transaction = buildTransaction(
                source, destination,
                request.getAmount(),
                TransactionType.TRANSFER,
                request.getDescription()
        );
        transactionRepository.save(transaction);

        return mapToResponse(transaction);
    }


    @Transactional
    public TransactionResponse withdraw(String username, TransferRequest request) {

//        validateTransactionToken(
//                request.getTransactionToken(),
//                username,
//                request.getFromAccountNumber(),
//                "WITHDRAWAL"
//        );

        if (request.getFromAccountNumber() == null || request.getFromAccountNumber().isBlank()) {
            throw new MissingFieldsException(MissingFieldsException.FROM_BANK_ACCOUNT_NUMBER);
        }

        // Check if account exists and owned by the user
        BankAccount source = bankAccountService
                .getAccountOwnedByUser(request.getFromAccountNumber(), username);

        // Check if account is allowed for withdraw
        bankAccountService.validateAccount(
                source,
                username,
                request.getAmount(),
                CHECK_OPEN,
                CHECK_SUFFICIENT_FUNDS
        );

        bankAccountService.debit(source, request.getAmount());

        Transaction transaction = buildTransaction(
                source, null, // no destination for withdrawal
                request.getAmount(),
                TransactionType.WITHDRAWAL,
                request.getDescription()
        );

        transactionRepository.save(transaction);

        return mapToResponse(transaction);
    }

    @Transactional
    public TransactionResponse deposit(String username, TransferRequest request) {

//        validateTransactionToken(
//                request.getTransactionToken(),
//                username,
//                request.getFromAccountNumber(),
//                "DEPOSIT"
//        );

        if (request.getToAccountNumber() == null || request.getToAccountNumber().isBlank()) {
            throw new MissingFieldsException(MissingFieldsException.TO_BANK_ACCOUNT_NUMBER);
        }

        // Check if account exists and owned by the user
        BankAccount destination = bankAccountService
                .getAccountOwnedByUser(request.getToAccountNumber(), username);

        // Check if destination is valid
        bankAccountService.validateAccount(
                destination,
                null,
                null,
                CHECK_OPEN
        );

        bankAccountService.credit(destination, request.getAmount());

        Transaction transaction = buildTransaction(
                null, destination, // no source for deposit
                request.getAmount(),
                TransactionType.DEPOSIT,
                request.getDescription()
        );

        transactionRepository.save(transaction);

        return mapToResponse(transaction);
    }


    // Admin can deposit when a user requests it
    @Transactional
    public TransactionResponse depositAdmin(TransferRequest request) {

        if (request.getToAccountNumber() == null || request.getToAccountNumber().isBlank()) {
            throw new MissingFieldsException(MissingFieldsException.TO_BANK_ACCOUNT_NUMBER);
        }

        // Check if account exists
        BankAccount destination = bankAccountService
                .getAccountByAccountNumber(request.getToAccountNumber());

        // Check if destination is valid
        bankAccountService.validateAccount(
                destination,
                null,
                null,
                CHECK_OPEN
        );

        bankAccountService.credit(destination, request.getAmount());

        Transaction transaction = buildTransaction(
                null, destination, // no source for deposit
                request.getAmount(),
                TransactionType.DEPOSIT,
                request.getDescription()
        );

        transactionRepository.save(transaction);

        return mapToResponse(transaction);
    }



    // Customer transaction queries
    public List<TransactionResponse> getMyTransactions(String username) {
        User user = userService.getUserByUsername(username);
        return transactionRepository.findRecentByUserId(user.getId(), PageRequest.of(0,10))
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    public Page<TransactionResponse> getMyAccountTransactions(
            String username,
            String accountNumber,
            TransactionType type,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable) {

        Specification<Transaction> spec = TransactionSpecification.withFilters(
                null, username, accountNumber, type, startDate, endDate
        );

        Page<Transaction> transactions = transactionRepository.findAll(spec, pageable);
        return transactions.map(this::mapToResponse);
    }


    // Admin transaction queries
    public TransactionResponse getTransactionById(long id) {
        Transaction transaction = transactionRepository.findById(id).orElse(null);
        if (transaction == null) {
            throw new ResourceNotFoundException(ResourceNotFoundException.TRANSACTION_ID, String.valueOf(id));
        }
        return mapToResponse(transaction);
    }

    public Page<TransactionResponse> getAllTransactions(
            Long bankAccountId,
            String username,
            String accountNumber,
            TransactionType type,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable) {

        Specification<Transaction> spec = TransactionSpecification.withFilters(
                bankAccountId, username, accountNumber, type, startDate, endDate
        );

        Page<Transaction> transactions = transactionRepository.findAll(spec, pageable);
        return transactions.map(this::mapToResponse);
    }


//    private void validateTransactionToken(
//            String token,
//            String username,
//            String accountNumber,
//            String action) {
//
//        if (!jwtUtil.isTransactionTokenValid(token, username, accountNumber, action)) {
//            throw new InvalidTransactionTokenException(
//                    "Transaction token is invalid, expired, or does not match this operation.");
//        }
//
//        if (tokenBlacklistService.isAlreadyUsed(token)) {
//            throw new InvalidTransactionTokenException(
//                    "Transaction token has already been used.");
//        }
//    }

    private Transaction buildTransaction(
            BankAccount from,
            BankAccount to,
            BigDecimal amount,
            TransactionType type,
            String description) {

        return Transaction.builder()
                .fromAccount(from)
                .toAccount(to)
                .amount(amount)
                .type(type)
                .timestamp(LocalDateTime.now())
                .description(description)
                .build();
    }

    private TransactionResponse mapToResponse(Transaction t) {
        String username = "";
        if (t.getType().equals(TransactionType.DEPOSIT)) {
            username = t.getToAccount().getUser().getUsername();
        } else {
            username = t.getFromAccount().getUser().getUsername();
        }

        return TransactionResponse.builder()
                .id(t.getId())
                .username(username)
                .fromAccountNumber(t.getFromAccount() != null
                        ? t.getFromAccount().getAccountNumber() : null)
                .toAccountNumber(t.getToAccount() != null
                        ? t.getToAccount().getAccountNumber() : null)
                .amount(t.getAmount())
                .type(t.getType())
                .timestamp(t.getTimestamp())
                .description(t.getDescription())
                .build();
    }
}