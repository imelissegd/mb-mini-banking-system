package com.example.minibankingsystem.service;

import com.example.minibankingsystem.config.security.JwtUtil;
import com.example.minibankingsystem.dto.request.CreateBankAccountRequest;
import com.example.minibankingsystem.dto.request.TransactionTokenRequest;
import com.example.minibankingsystem.dto.response.BankAccountResponse;
import com.example.minibankingsystem.dto.response.TransactionTokenResponse;
import com.example.minibankingsystem.dto.response.TransactionTokenResult;
import com.example.minibankingsystem.exception.AccountNotActiveException;
import com.example.minibankingsystem.exception.InsufficientFundsException;
import com.example.minibankingsystem.exception.ResourceNotFoundException;
import com.example.minibankingsystem.model.BankAccount;
import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.model.enums.AccountStatus;
import com.example.minibankingsystem.model.enums.AccountType;
import com.example.minibankingsystem.repository.BankAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
        CHECK_EXISTS,           // account exists in DB
        CHECK_OWNED_BY_USER,    // account belongs to the authenticated user
        CHECK_OPEN,             // account status is OPEN
        CHECK_SUFFICIENT_FUNDS  // account has enough balance
    }

    public enum CreateAccountValidationRule {
        CHECK_USER_ID,
        CHECK_USER_ACTIVE,
        CHECK_TYPE
    }


    public BankAccount getAccountByAccountNumber(String accountNumber) {
        return bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Account not found: " + accountNumber));
    }


    public BankAccount getAccountOwnedByUser(String accountNumber, String username) {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("User not found: " + username);
        }
        return bankAccountRepository.findByAccountNumberAndUserId(accountNumber, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Account not found: " + accountNumber));
    }


    public void checkAccountOpen(BankAccount account) {
        if (account.getStatus() != AccountStatus.OPEN) {
            throw new AccountNotActiveException(
                    "Account " + account.getAccountNumber() + " is not active");
        }
    }


    public void checkSufficientFunds(BankAccount account, BigDecimal amount) {
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException(
                    "Insufficient funds");
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
                throw new ResourceNotFoundException("Account not found");
            }
        }

        if (ruleSet.contains(CHECK_OWNED_BY_USER)) {
            User user = userService.getUserByUsername(username);
            if (user == null) {
                throw new ResourceNotFoundException("User not found: " + username);
            }
            // re-verify ownership at validation time
            bankAccountRepository
                    .findByAccountNumberAndUserId(account.getAccountNumber(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Account not found:" +  account.getAccountNumber()));
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

    public List<BankAccountResponse> getBankAccountsByUsername(String username) {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("User not found: " + username);
        }
        return bankAccountRepository.findByUserId(user.getId())
                .stream()
                .map(this::createResponseBankAccount)
                .toList();
    }

    public BankAccountResponse addBankAccount(CreateBankAccountRequest request) {
        validateCreateBankAccount(request,
                CHECK_USER_ID, CHECK_USER_ACTIVE, CHECK_TYPE);

        User user = userService.getUserById(request.getUserId());
        BankAccount newBankAccount = createBankAccountFromRequest(request, user);
        newBankAccount = bankAccountRepository.save(newBankAccount);
        return createResponseBankAccount(newBankAccount);
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
            if (!userService.userExistsById(request.getUserId())) {
                throw new ResourceNotFoundException(ResourceNotFoundException.USER_ID);
            }
        }

        if (ruleSet.contains(CHECK_USER_ACTIVE)) {
            if (!userService.isUserActive(request.getUserId())) {
                throw new AccountNotActiveException("User account is not active.");
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
        account.setBalance(BigDecimal.ZERO);
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
        return response;
    }

    public String generateAccountNumber(Long userId, AccountType accountType) {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String userSegment = String.format("%06d", userId);
        String typeCode = switch (accountType) {
            case SAVINGS  -> "SAV";
            case CHECKING -> "CHK";
        };
        String random = String.format("%04d", new Random().nextInt(10000));
        return date + "-" + userSegment + "-" + typeCode + "-" + random;
    }

    private String formatOwnerName(User user) {
        return Stream.of(
                        user.getFirstName(),
                        user.getMiddleName(),
                        user.getLastName(),
                        user.getSuffix()
                )
                .filter(part -> part != null && !part.isBlank())
                .collect(Collectors.joining(" "));
    }
}
