package com.example.minibankingsystem.controller;

import com.example.minibankingsystem.component.MessageHelper;
import com.example.minibankingsystem.dto.admin.request.CreateUserAdmin;
import com.example.minibankingsystem.dto.admin.request.ResolveRequest;
import com.example.minibankingsystem.dto.request.CreateBankAccountRequest;
import com.example.minibankingsystem.dto.request.RegisterRequest;
import com.example.minibankingsystem.dto.request.TransferRequest;
import com.example.minibankingsystem.dto.response.*;
import com.example.minibankingsystem.model.enums.AccountStatus;
import com.example.minibankingsystem.model.enums.AccountType;
import com.example.minibankingsystem.model.enums.RequestStatus;
import com.example.minibankingsystem.model.enums.TransactionType;
import com.example.minibankingsystem.repository.RequestRepository;
import com.example.minibankingsystem.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    AuthServiceImpl authService;
    @Autowired
    UserServiceImpl userService;
    @Autowired
    BankAccountServiceImpl bankAccountService;
    @Autowired
    TransactionServiceImpl transactionService;
    @Autowired
    RequestServiceImpl requestService;

    // Users
    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody CreateUserAdmin createUserAdmin) {
        UserResponse response = authService.addUser(createUserAdmin);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(MessageHelper.get("success.user.added"), response));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(
            @Valid @PathVariable("userId") Long userId) {
        UserResponse response = userService.getUserDetails(userId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(MessageHelper.get("success.user.retrieved"), response));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<UserResponse> result = userService.getUsers(
                username, firstName, lastName, pageable);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(MessageHelper.get("success.user.list.retrieved"), result));
    }

    @PatchMapping("/users/{userId}/toggle-active")
    public ResponseEntity<ApiResponse<UserResponse>> toggleActive(@Valid @PathVariable("userId") Long userId) {
        UserResponse response = userService.toggleUserActive(userId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(MessageHelper.get("success.user.updated"), response));
    }

    // Bank accounts
    @GetMapping("/accounts")
    public ResponseEntity<ApiResponse<Page<BankAccountResponse>>> getBankAccountsAdmin(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String accountNumber,
            @RequestParam(required = false) AccountType accountType,
            @RequestParam(required = false) AccountStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<BankAccountResponse> result = bankAccountService.getBankAccountsAdmin(
                username, accountNumber, accountType, status, pageable);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(MessageHelper.get("success.bank.account.list.retrieved"), result));
    }

    @PostMapping("/accounts")
    public ResponseEntity<ApiResponse<BankAccountResponse>> addBankAccount(
            @Valid @RequestBody CreateBankAccountRequest createBankAccountRequest) {
        BankAccountResponse response = bankAccountService.addBankAccount(createBankAccountRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(MessageHelper.get("success.bank.account.created"), response));
    }

    @GetMapping("/accounts/{accountNumber}")
    public ResponseEntity<ApiResponse<BankAccountResponse>> changeBankAccountStatus(
            @Valid @PathVariable("accountNumber") String accountNumber
    ) {
        BankAccountResponse response = bankAccountService.getAccountAdmin(accountNumber);
        return ResponseEntity.ok(ApiResponse.success(
                MessageHelper.get("success.bank.account.retrieved"), response));
    }


    @PatchMapping("/accounts/{accountNumber}")
    public ResponseEntity<ApiResponse<BankAccountResponse>> changeBankAccountStatus(
            @Valid @PathVariable("accountNumber") String accountNumber,
            @RequestParam(required = false) @Valid AccountStatus accountStatus
    ) {
        BankAccountResponse response = bankAccountService.changeStatus(accountNumber, accountStatus);
        return ResponseEntity.ok(ApiResponse.success(
                MessageHelper.get("success.bank.account.status.changed"), response));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBankAccountsTotalBalance() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCustomers", userService.countAllCustomers());
        stats.put("totalAccounts", bankAccountService.countAllAccounts());
        stats.put("totalBalance", bankAccountService.getTotalBalance());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // Transactions
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getTransactions(
            @RequestParam(required = false) Long bankAccountId,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String accountNumber,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TransactionResponse> response = transactionService.getAllTransactions(
                bankAccountId, username, accountNumber, type, startDate, endDate, pageable
        );

        return ResponseEntity.ok(
                ApiResponse.success(MessageHelper.get("success.transaction.list.retrieved"), response)
        );
    }


    @GetMapping("/transactions/{transactionId}")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransactionById(
            @PathVariable Long transactionId) {
        TransactionResponse response = transactionService.getTransactionById(transactionId);
        return ResponseEntity.ok(
                ApiResponse.success(MessageHelper.get("success.transaction.retrieved"), response));
    }

    @PostMapping("/transactions/deposit")
    public ResponseEntity<ApiResponse<TransactionResponse>> deposit(
            @Valid @RequestBody TransferRequest request) {
        TransactionResponse response = transactionService.depositAdmin(request);
        return ResponseEntity.ok(
                ApiResponse.success(MessageHelper.get("success.transaction.deposit"), response));
    }


    // Requests
    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<Page<RequestResponse>>> getAllRequests(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        return ResponseEntity.ok(ApiResponse.success(
                MessageHelper.get("success.request.list.retrieved"),
                requestService.getAllRequests(
                        status,
                        PageRequest.of(page, size, sort))));
    }

    @GetMapping("/requests/{requestId}")
    public ResponseEntity<ApiResponse<RequestResponse>> getRequestById(
            @PathVariable Long requestId) {
        return ResponseEntity.ok(ApiResponse.success(
                MessageHelper.get("success.request.retrieved"),
                requestService.getRequestById(requestId)));
    }

    @PatchMapping("/requests/{requestId}/resolve")
    public ResponseEntity<ApiResponse<RequestResponse>> resolveRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long requestId,
            @Valid @RequestBody ResolveRequest dto) {
        return ResponseEntity.ok(ApiResponse.success(
                MessageHelper.get("success.request.resolved"),
                requestService.resolveRequest(
                        userDetails.getUsername(), requestId, dto)));
    }
}
