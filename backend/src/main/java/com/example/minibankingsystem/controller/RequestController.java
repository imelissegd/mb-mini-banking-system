package com.example.minibankingsystem.controller;

import com.example.minibankingsystem.component.MessageHelper;
import com.example.minibankingsystem.dto.request.CreateBankAccountRequest;
import com.example.minibankingsystem.dto.request.EditProfileRequest;
import com.example.minibankingsystem.dto.response.ApiResponse;
import com.example.minibankingsystem.dto.response.RequestResponse;
import com.example.minibankingsystem.service.RequestServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final RequestServiceImpl requestService;

    @GetMapping("/{requestId}")
    public ResponseEntity<ApiResponse<RequestResponse>> getMyRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long requestId) {
        return ResponseEntity.ok(ApiResponse.success(
                MessageHelper.get("success.request.retrieved"),
                requestService.getMyRequest(userDetails.getUsername(), requestId)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<RequestResponse>>> getMyRequests(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        return ResponseEntity.ok(ApiResponse.success(
                MessageHelper.get("success.request.list.retrieved"),
                requestService.getMyRequests(
                        userDetails.getUsername(),
                        PageRequest.of(page, size, sort))));
    }

    @PostMapping("/open-account")
    public ResponseEntity<ApiResponse<RequestResponse>> submitOpenAccountRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateBankAccountRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                MessageHelper.get("success.request.submitted"),
                requestService.submitOpenAccountRequest(userDetails.getUsername(), dto)));
    }

    @PostMapping("/edit-profile")
    public ResponseEntity<ApiResponse<RequestResponse>> submitEditProfileRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody EditProfileRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                MessageHelper.get("success.request.submitted"),
                requestService.submitEditProfileRequest(userDetails.getUsername(), dto)));
    }
}