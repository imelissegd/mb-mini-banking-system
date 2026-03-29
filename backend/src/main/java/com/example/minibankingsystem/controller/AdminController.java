package com.example.minibankingsystem.controller;

import com.example.minibankingsystem.dto.admin.request.CreateUserAdmin;
import com.example.minibankingsystem.dto.request.CreateBankAccountRequest;
import com.example.minibankingsystem.dto.request.RegisterRequest;
import com.example.minibankingsystem.dto.request.TransferRequest;
import com.example.minibankingsystem.dto.response.ApiResponse;
import com.example.minibankingsystem.dto.response.BankAccountResponse;
import com.example.minibankingsystem.dto.response.TransactionResponse;
import com.example.minibankingsystem.dto.response.UserResponse;
import com.example.minibankingsystem.service.AuthServiceImpl;
import com.example.minibankingsystem.service.BankAccountServiceImpl;
import com.example.minibankingsystem.service.TransactionServiceImpl;
import com.example.minibankingsystem.service.UserServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
