package com.example.minibankingsystem.service;

import com.example.minibankingsystem.component.BankAccountSpecification;
import com.example.minibankingsystem.config.security.JwtUtil;
import com.example.minibankingsystem.dto.request.CreateBankAccountRequest;
import com.example.minibankingsystem.dto.request.TransactionTokenRequest;
import com.example.minibankingsystem.dto.response.BankAccountResponse;
import com.example.minibankingsystem.dto.response.TransactionTokenResponse;
import com.example.minibankingsystem.dto.response.TransactionTokenResult;
import com.example.minibankingsystem.exception.AccountNotActiveException;
import com.example.minibankingsystem.exception.InsufficientFundsException;
import com.example.minibankingsystem.exception.MissingFieldsException;
import com.example.minibankingsystem.exception.ResourceNotFoundException;
import com.example.minibankingsystem.model.BankAccount;
import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.model.enums.AccountStatus;
import com.example.minibankingsystem.model.enums.AccountType;
import com.example.minibankingsystem.repository.BankAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.example.minibankingsystem.service.BankAccountServiceImpl.AccountValidationRule.*;
import static com.example.minibankingsystem.service.BankAccountServiceImpl.CreateAccountValidationRule.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class BankAccountServiceImpl {

    private final BankAccountRepository bankAccountRepository;
    private final UserServiceImpl userService;
    private final JwtUtil jwtUtil;

    public enum AccountValidationRule {
        CHECK_EXISTS, // account exists in DB
        CHECK_OWNED_BY_USER, // account belongs to the authenticated user
        CHECK_OPEN, // account status is OPEN
        CHECK_SUFFICIENT_FUNDS // account has enough balance
    }

    public enum CreateAccountValidationRule {
        CHECK_USER_ID,
        CHECK_USER_ACTIVE,
        CHECK_TYPE
    }

    public BankAccount getAccountByAccountNumber(String accountNumber) {
        return bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceNotFoundException.BANK_ACCOUNT_NUMBER,
                        accountNumber));
    }

    public BankAccount getAccountOwnedByUser(String accountNumber, String username) {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException(ResourceNotFoundException.USER_NAME, username);
        }
        return bankAccountRepository.findByAccountNumberAndUserId(accountNumber, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(ResourceNotFoundException.BANK_ACCOUNT_NUMBER,
                        accountNumber));
    }

    public void checkAccountOpen(BankAccount account) {
        if (account.getStatus() != AccountStatus.OPEN) {
            throw new AccountNotActiveException(AccountNotActiveException.ACCOUNT, account.getAccountNumber());
        }
    }

    public void checkSufficientFunds(BankAccount account, BigDecimal amount) {
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException();
        }
    }

    // Validate account for transaction requests
    public void validateAccount(
            BankAccount account,
            String username,
            BigDecimal amount,
            AccountValidationRule... rules) {

        Set<AccountValidationRule> ruleSet = Set.of(rules);

        if (ruleSet.contains(CHECK_EXISTS)) {
            if (account == null) {
                throw new ResourceNotFoundException(ResourceNotFoundException.BANK_ACCOUNT_DEFAULT);
            }
        }

        if (ruleSet.contains(CHECK_OWNED_BY_USER)) {
            User user = userService.getUserByUsername(username);
            if (user == null) {
                throw new ResourceNotFoundException(ResourceNotFoundException.USER_NAME, username);
            }
            // re-verify ownership at validation time
            bankAccountRepository
                    .findByAccountNumberAndUserId(account.getAccountNumber(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException(ResourceNotFoundException.BANK_ACCOUNT_NUMBER,
                            account.getAccountNumber()));
        }

        if (ruleSet.contains(CHECK_OPEN)) {
            checkAccountOpen(account);
        }

        if (ruleSet.contains(CHECK_SUFFICIENT_FUNDS)) {
            if (amount == null) {
                throw new IllegalArgumentException(
                        "Amount is required for CHECK_SUFFICIENT_FUNDS.");
            }
            checkSufficientFunds(account, amount);
        }
    }

    public BankAccount debit(BankAccount account, BigDecimal amount) {
        account.setBalance(account.getBalance().subtract(amount));
        return bankAccountRepository.save(account);
    }

    public BankAccount credit(BankAccount account, BigDecimal amount) {
        account.setBalance(account.getBalance().add(amount));
        return bankAccountRepository.save(account);
    }

    public BankAccountResponse getBankAccountByAccountNumber(
            String username, String accountNumber) {
        BankAccount account = getAccountOwnedByUser(accountNumber, username);
        return createResponseBankAccount(account);
    }

    public Page<BankAccountResponse> getBankAccountsByUsername(String username, Pageable pageable) {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException(ResourceNotFoundException.USER_NAME, username);
        }
        Page<BankAccount> bankAccounts = bankAccountRepository.findByUserId(user.getId(), pageable);
        return bankAccounts.map(this::createResponseBankAccount);

    }

    // Admin functions
    public Page<BankAccountResponse> getBankAccountsAdmin(
            String username,
            String accountNumber,
            AccountType accountType,
            AccountStatus status,
            Pageable pageable) {

        Specification<BankAccount> spec = BankAccountSpecification.withFilters(
                username, accountNumber, accountType, status);

        return bankAccountRepository.findAll(spec, pageable)
                .map(this::createResponseBankAccount);
    }

    public BankAccountResponse addBankAccount(CreateBankAccountRequest request) {
        validateCreateBankAccount(request,
                CHECK_USER_ID, CHECK_USER_ACTIVE, CHECK_TYPE);

        User user = userService.getUserById(request.getUserId());
        BankAccount newBankAccount = createBankAccountFromRequest(request, user);
        newBankAccount = bankAccountRepository.save(newBankAccount);
        return createResponseBankAccount(newBankAccount);
    }

    public BankAccountResponse getAccountAdmin(String accountNumber) {
        BankAccount account = getAccountByAccountNumber(accountNumber);
        return createResponseBankAccount(account);
    }

    public BankAccountResponse changeStatus(String accountNumber, AccountStatus status) {
        BankAccount account = getAccountByAccountNumber(accountNumber);
        account.setStatus(status);
        bankAccountRepository.save(account);
        return createResponseBankAccount(account);
    }

    public BigDecimal getTotalBalance() {
        BigDecimal total = bankAccountRepository.sumAllBalances();
        return total != null ? total : BigDecimal.ZERO;
    }

    public Long countAllAccounts() {
        return bankAccountRepository.countAllAccounts();
    }

    public TransactionTokenResult issueTransactionToken(
            String username, TransactionTokenRequest request) {

        BankAccount account = getAccountOwnedByUser(request.getAccountNumber(), username);
        checkAccountOpen(account);

        String token = jwtUtil.generateTransactionToken(
                username, request.getAccountNumber(), request.getAction());

        TransactionTokenResponse meta = TransactionTokenResponse.builder()
                .accountNumber(request.getAccountNumber())
                .action(request.getAction())
                .expiresIn(jwtUtil.getTransactionTokenExpiration() / 1000)
                .build();

        return TransactionTokenResult.builder()
                .token(token)
                .meta(meta)
                .build();
    }

    // Create Account Validation

    public void validateCreateBankAccount(
            CreateBankAccountRequest request,
            CreateAccountValidationRule... rules) {

        Set<CreateAccountValidationRule> ruleSet = Set.of(rules);

        if (ruleSet.contains(CHECK_USER_ID)) {
            if (request.getUserId() == null) {
                throw new MissingFieldsException(MissingFieldsException.USER_ID);
            }
            if (!userService.userExistsById(request.getUserId())) {
                throw new ResourceNotFoundException(ResourceNotFoundException.USER_ID,
                        String.valueOf(request.getUserId()));
            }
        }

        if (ruleSet.contains(CHECK_USER_ACTIVE)) {
            if (!userService.isUserActive(request.getUserId())) {
                throw new AccountNotActiveException(AccountNotActiveException.USER_DEFAULT);
            }
        }

        if (ruleSet.contains(CHECK_TYPE)) {
            try {
                AccountType.valueOf(request.getAccountType());
            } catch (IllegalArgumentException e) {
                throw new ResourceNotFoundException(ResourceNotFoundException.BANK_ACCOUNT_TYPE);
            }
        }
    }

    // Helper functions

    public BankAccount createBankAccountFromRequest(
            CreateBankAccountRequest request, User user) {
        String accountNumber;
        do {
            accountNumber = generateAccountNumber(
                    user.getId(), AccountType.valueOf(request.getAccountType()));
        } while (bankAccountRepository.existsByAccountNumber(accountNumber));

        BankAccount account = new BankAccount();
        account.setAccountNumber(accountNumber);
        account.setUser(user);
        account.setAccountType(AccountType.valueOf(request.getAccountType()));
        if (request.getInitialBalance() == null) {
            account.setBalance(BigDecimal.ZERO);
        } else {
            account.setBalance(request.getInitialBalance());
        }
        account.setStatus(AccountStatus.OPEN);
        account.setCreatedAt(LocalDateTime.now());
        return account;
    }

    public BankAccountResponse createResponseBankAccount(BankAccount bankAccount) {
        User user = userService.getUserById(bankAccount.getUser().getId());
        BankAccountResponse response = new BankAccountResponse();
        response.setId(bankAccount.getId());
        response.setAccountNumber(bankAccount.getAccountNumber());
        response.setAccountType(String.valueOf(bankAccount.getAccountType()));
        response.setBalance(bankAccount.getBalance());
        response.setStatus(String.valueOf(bankAccount.getStatus()));
        response.setCreatedAt(bankAccount.getCreatedAt());
        response.setOwnerName(formatOwnerName(user));
        response.setOwnerUsername(user.getUsername());
        return response;
    }

    public String generateAccountNumber(Long userId, AccountType accountType) {
        long number = (long) (Math.random() * 900_000_000_000L) + 100_000_000_000L;
        return String.valueOf(number);
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
}
