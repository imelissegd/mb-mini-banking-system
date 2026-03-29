package com.example.minibankingsystem.controller;

import com.example.minibankingsystem.dto.request.TransferRequest;
import com.example.minibankingsystem.dto.response.ApiResponse;
import com.example.minibankingsystem.dto.response.TransactionResponse;
import com.example.minibankingsystem.repository.TransactionRepository;
import com.example.minibankingsystem.service.TransactionServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionServiceImpl transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<TransactionResponse>> transfer(
            @AuthenticationPrincipal UserDetails userDetails,
//            @RequestHeader("X-Transaction-Token") String transactionToken,
            @Valid @RequestBody TransferRequest request
    ) {

//        request.setTransactionToken(transactionToken);

        TransactionResponse response =
                transactionService.transfer(userDetails.getUsername(), request);

        return ResponseEntity.ok(ApiResponse.success("Transfer successful", response));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<TransactionResponse>> withdraw(
            @AuthenticationPrincipal UserDetails userDetails,
//            @RequestHeader("X-Transaction-Token") String transactionToken,
            @Valid @RequestBody TransferRequest request
    ) {

//        request.setTransactionToken(transactionToken);

        TransactionResponse response =
                transactionService.withdraw(userDetails.getUsername(), request);

        return ResponseEntity.ok(ApiResponse.success("Withdraw successful", response));
    }


    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<TransactionResponse>> deposit(
            @AuthenticationPrincipal UserDetails userDetails,
//            @RequestHeader("X-Transaction-Token") String transactionToken,
            @Valid @RequestBody TransferRequest request
    ) {

//        request.setTransactionToken(transactionToken);

        TransactionResponse response =
                transactionService.deposit(userDetails.getUsername(), request);

        return ResponseEntity.ok(ApiResponse.success("Deposit successful", response));
    }
}
