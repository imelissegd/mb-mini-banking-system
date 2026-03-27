package com.example.minibankingsystem.service;

import com.example.minibankingsystem.dto.request.CreateBankAccountRequest;
import com.example.minibankingsystem.dto.response.BankAccountResponse;
import com.example.minibankingsystem.exceptions.AccountNotActiveException;
import com.example.minibankingsystem.exceptions.ResourceNotFoundException;
import com.example.minibankingsystem.model.BankAccount;
import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.model.enums.AccountStatus;
import com.example.minibankingsystem.model.enums.AccountType;
import com.example.minibankingsystem.repository.BankAccountRepository;
import com.example.minibankingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.minibankingsystem.service.BankAccountServiceImpl.ValidationRule.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.example.minibankingsystem.service.BankAccountServiceImpl.ValidationRule.*;

@Service
public class BankAccountServiceImpl {

    enum ValidationRule {
        CHECK_USER_ID,
        CHECK_USER_ACTIVE,
        CHECK_TYPE
    }

    @Autowired
    private BankAccountRepository bankAccountRepository;
    @Autowired
    private UserServiceImpl userService;


    public BankAccountResponse addBankAccount(CreateBankAccountRequest request) {
        validateBankAccount(request, CHECK_USER_ID, CHECK_TYPE,  CHECK_USER_ACTIVE);
        User userStub = new User();
        userStub.setId(request.getUserId());
        BankAccount newBankAccount = createBankAccountFromRequest(request, userStub);
        newBankAccount = bankAccountRepository.save(newBankAccount);
        return createResponseBankAccount(newBankAccount);
    }

    public BankAccount createBankAccountFromRequest(CreateBankAccountRequest request, User user) {
        String accountNumber;
        do {
            accountNumber = generateAccountNumber(user.getId(), AccountType.valueOf(request.getAccountType()));
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
        BankAccountResponse bankAccountResponse = new BankAccountResponse();
        bankAccountResponse.setId(bankAccount.getId());
        bankAccountResponse.setAccountNumber(bankAccount.getAccountNumber());
        bankAccountResponse.setAccountType(String.valueOf(bankAccount.getAccountType()));
        bankAccountResponse.setBalance(bankAccount.getBalance());
        bankAccountResponse.setStatus(String.valueOf(bankAccount.getStatus()));
        bankAccountResponse.setCreatedAt(bankAccount.getCreatedAt());
        bankAccountResponse.setOwnerName(formatOwnerName(bankAccount.getUser()));
        return bankAccountResponse;
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

    public void validateBankAccount(CreateBankAccountRequest request, ValidationRule... rules) {
        Set<BankAccountServiceImpl.ValidationRule> ruleSet = Set.of(rules);

        if (ruleSet.contains(CHECK_USER_ID)) {
          if (!userService.userExistsById(request.getUserId())) {
              throw new ResourceNotFoundException(ResourceNotFoundException.USER_ID);
          }
        }

        if (ruleSet.contains(CHECK_USER_ACTIVE)) {
            if (!userService.isUserActive(request.getUserId())) {
                throw new AccountNotActiveException("error.user.not.active");
            }
        }

        if (ruleSet.contains(CHECK_TYPE)) {
            try {
                AccountType accountType = AccountType.valueOf(request.getAccountType());
            } catch (IllegalArgumentException e) {
                throw new ResourceNotFoundException(ResourceNotFoundException.BANK_ACCOUNT_TYPE);
            }
        }
    }
}
