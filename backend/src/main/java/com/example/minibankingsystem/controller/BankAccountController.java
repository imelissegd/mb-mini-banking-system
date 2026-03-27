package com.example.minibankingsystem.controller;

import com.example.minibankingsystem.dto.response.ApiResponse;
import com.example.minibankingsystem.dto.response.BankAccountResponse;
import com.example.minibankingsystem.service.BankAccountServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
        BankAccountResponse account = bankAccountService.getBankAccountByAccountNumber(userDetails.getUsername(), accountNumber);
        return ResponseEntity.ok(ApiResponse.success(account));
    }

}
