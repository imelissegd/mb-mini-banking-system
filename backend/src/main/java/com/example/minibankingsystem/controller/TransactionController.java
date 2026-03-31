package com.example.minibankingsystem.controller;

import com.example.minibankingsystem.component.MessageHelper;
import com.example.minibankingsystem.dto.request.TransferRequest;
import com.example.minibankingsystem.dto.response.ApiResponse;
import com.example.minibankingsystem.dto.response.TransactionResponse;
import com.example.minibankingsystem.model.enums.TransactionType;
import com.example.minibankingsystem.repository.TransactionRepository;
import com.example.minibankingsystem.service.TransactionServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionServiceImpl transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<TransactionResponse>> transfer(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestHeader("X-Transaction-Token") String transactionToken,
            @Valid @RequestBody TransferRequest request) {

//        request.setTransactionToken(transactionToken);
        TransactionResponse response =
                transactionService.transfer(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(
                MessageHelper.get("success.transaction.transfer"), response));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<TransactionResponse>> withdraw(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestHeader("X-Transaction-Token") String transactionToken,
            @Valid @RequestBody TransferRequest request) {

//        request.setTransactionToken(transactionToken);
        TransactionResponse response =
                transactionService.withdraw(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(
                MessageHelper.get("success.transaction.withdraw"), response));
    }

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<TransactionResponse>> deposit(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestHeader("X-Transaction-Token") String transactionToken,
            @Valid @RequestBody TransferRequest request) {

//        request.setTransactionToken(transactionToken);
        TransactionResponse response =
                transactionService.deposit(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(
                MessageHelper.get("success.transaction.deposit"), response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getMyTransactions(
            @AuthenticationPrincipal UserDetails userDetails,
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

        Page<TransactionResponse> response = transactionService.getMyAccountTransactions(
                userDetails.getUsername(), accountNumber, type, startDate, endDate, pageable
        );

        return ResponseEntity.ok(
                ApiResponse.success(MessageHelper.get("success.transaction.list.retrieved"), response)
        );
    }
}
