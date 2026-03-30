package com.example.minibankingsystem.controller;

import com.example.minibankingsystem.dto.admin.request.CreateUserAdmin;
import com.example.minibankingsystem.dto.request.CreateBankAccountRequest;
import com.example.minibankingsystem.dto.request.RegisterRequest;
import com.example.minibankingsystem.dto.request.TransferRequest;
import com.example.minibankingsystem.dto.response.ApiResponse;
import com.example.minibankingsystem.dto.response.BankAccountResponse;
import com.example.minibankingsystem.dto.response.TransactionResponse;
import com.example.minibankingsystem.dto.response.UserResponse;
import com.example.minibankingsystem.model.enums.AccountStatus;
import com.example.minibankingsystem.model.enums.AccountType;
import com.example.minibankingsystem.service.AuthServiceImpl;
import com.example.minibankingsystem.service.BankAccountServiceImpl;
import com.example.minibankingsystem.service.TransactionServiceImpl;
import com.example.minibankingsystem.service.UserServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
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

    // Users
    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody CreateUserAdmin createUserAdmin) {
        UserResponse response = authService.addUser(createUserAdmin);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("User added successfully", response));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(
            @Valid @PathVariable("userId") Long userId) {
        UserResponse response = userService.getUserDetails(userId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("User retrieved successfully", response));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
            Pageable pageable) {
        Page<UserResponse> response = userService.getUsers(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("User retrieved successfully", response));
    }

    @PatchMapping("/users/{userId}/toggle-active")
    public ResponseEntity<ApiResponse<UserResponse>> toggleActive(@Valid @PathVariable("userId") Long userId) {
        UserResponse response = userService.toggleUserActive(userId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("User toggle active successfully", response));
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

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("Bank accounts retrieved successfully", result));
    }

    @PostMapping("/accounts")
    public ResponseEntity<ApiResponse<BankAccountResponse>> addBankAccount(
            @Valid @RequestBody CreateBankAccountRequest createBankAccountRequest
    ) {
        BankAccountResponse response = bankAccountService.addBankAccount(createBankAccountRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Bank account added successfully", response));
    }

    // Transaction
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getTransactions(Pageable pageable) {
        Page<TransactionResponse> response = transactionService.getAllTransactions(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("Transactions retrieved successfully", response));
    }

    @GetMapping("/transactions/{transactionId}")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransactionById(@Valid @PathVariable Long transactionId, Pageable pageable) {
        TransactionResponse response = transactionService.getTransactionById(transactionId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success("Transaction retrieved successfully", response));
    }

    @PostMapping("/transactions/deposit")
    public ResponseEntity<ApiResponse<TransactionResponse>> deposit(@Valid @RequestBody TransferRequest request) {
        TransactionResponse response =
                transactionService.depositAdmin(request);

        return ResponseEntity.ok(ApiResponse.success("Deposit successful", response));
    }
}
