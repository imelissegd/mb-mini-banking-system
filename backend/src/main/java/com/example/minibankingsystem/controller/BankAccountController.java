package com.example.minibankingsystem.controller;

import com.example.minibankingsystem.component.MessageHelper;
import com.example.minibankingsystem.dto.request.TransactionTokenRequest;
import com.example.minibankingsystem.dto.request.TransferRequest;
import com.example.minibankingsystem.dto.response.*;
import com.example.minibankingsystem.service.BankAccountServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class BankAccountController {

    @Autowired
    BankAccountServiceImpl bankAccountService;

    @GetMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<BankAccountResponse>> getAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String accountNumber) {
        BankAccountResponse account = bankAccountService
                .getBankAccountByAccountNumber(userDetails.getUsername(), accountNumber);
        return ResponseEntity.ok(ApiResponse.success(
                MessageHelper.get("success.bank.account.retrieved"), account));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<BankAccountResponse>>> getBankAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Page<BankAccountResponse> response = bankAccountService
                .getBankAccountsByUsername(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success(
                MessageHelper.get("success.bank.account.list.retrieved"), response));
    }

    @PostMapping("/transaction-token")
    public ResponseEntity<ApiResponse<TransactionTokenResponse>> issueTransactionToken(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TransactionTokenRequest request) {

        TransactionTokenResult result =
                bankAccountService.issueTransactionToken(userDetails.getUsername(), request);

        return ResponseEntity.ok()
                .header("X-Transaction-Token", result.getToken())
                .body(ApiResponse.success(
                        MessageHelper.get("success.transaction.token.issued"), result.getMeta()));
    }
}
