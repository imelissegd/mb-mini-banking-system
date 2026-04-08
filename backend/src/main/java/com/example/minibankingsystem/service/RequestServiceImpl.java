package com.example.minibankingsystem.service;

import com.example.minibankingsystem.component.MessageHelper;
import com.example.minibankingsystem.component.RequestSpecification;
import com.example.minibankingsystem.dto.admin.request.ResolveRequest;
import com.example.minibankingsystem.dto.request.CreateBankAccountRequest;
import com.example.minibankingsystem.dto.request.EditProfileRequest;
import com.example.minibankingsystem.dto.response.RequestResponse;
import com.example.minibankingsystem.dto.response.UserResponse;
import com.example.minibankingsystem.exception.ResourceDuplicateException;
import com.example.minibankingsystem.exception.ResourceNotFoundException;
import com.example.minibankingsystem.model.Request;
import com.example.minibankingsystem.model.User;
import com.example.minibankingsystem.model.enums.RequestStatus;
import com.example.minibankingsystem.model.enums.RequestType;
import com.example.minibankingsystem.repository.RequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.time.LocalDateTime;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class RequestServiceImpl {

    private final RequestRepository requestRepository;
    private final UserServiceImpl userService;
    private final BankAccountServiceImpl bankAccountService;
    private final ObjectMapper objectMapper;

    // ── Customer ──────────────────────────────────────────────────────────────

    @Transactional
    public RequestResponse submitOpenAccountRequest(
            String username, CreateBankAccountRequest dto) {

        User user = userService.getUserByUsername(username);
        if (dto.getUserId() == null) {
            dto.setUserId(user.getId());
        }
        if (requestRepository.existsByUserIdAndTypeAndStatus(
                user.getId(), RequestType.OPEN_ACCOUNT, RequestStatus.PENDING)) {
            throw new IllegalStateException(
                    MessageHelper.get("error.request.duplicate.pending"));
        }

        Request request = Request.builder()
                .user(user)
                .type(RequestType.OPEN_ACCOUNT)
                .status(RequestStatus.PENDING)
                .payload(toJson(dto))
                .createdAt(LocalDateTime.now())
                .build();

        return mapToResponse(requestRepository.save(request));
    }

    @Transactional
    public RequestResponse submitEditProfileRequest(
            String username, EditProfileRequest dto) {

        User user = userService.getUserByUsername(username);

        if (requestRepository.existsByUserIdAndTypeAndStatus(
                user.getId(), RequestType.EDIT_PROFILE, RequestStatus.PENDING)) {
            throw new IllegalStateException(
                    MessageHelper.get("error.request.duplicate.pending"));
        }

        userService.usernameExists(user.getId(), dto.getUsername());
        userService.emailExists(user.getId(), dto.getEmail());
        userService.contactExists(user.getId(), dto.getContactNumber());

        Request request = Request.builder()
                .user(user)
                .type(RequestType.EDIT_PROFILE)
                .status(RequestStatus.PENDING)
                .payload(toJson(dto))
                .createdAt(LocalDateTime.now())
                .build();

        return mapToResponse(requestRepository.save(request));
    }

    public RequestResponse getMyRequest(String username, Long requestId) {
        User user = userService.getUserByUsername(username);

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        MessageHelper.get("error.request.not.found", requestId)));

        if (!request.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException(
                    MessageHelper.get("error.request.not.found", requestId));
        }
        return mapToResponse(request);
    }

    public Page<RequestResponse> getMyRequests(String username, Pageable pageable) {
        User user = userService.getUserByUsername(username);
        return requestRepository.findByUserId(user.getId(), pageable)
                .map(this::mapToResponse);
    }

    // ── Admin ─────────────────────────────────────────────────────────────────
    public RequestResponse getRequestById(Long requestId) {
        return mapToResponse(
                requestRepository.findById(requestId)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                MessageHelper.get("error.request.not.found", requestId))));
    }

    public Page<RequestResponse> getAllRequests(RequestStatus status, Pageable pageable) {
        // status is optional — if null returns all requests
        Specification<Request> spec = RequestSpecification.withFilters(status);
        return requestRepository.findAll(spec, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public RequestResponse resolveRequest(
            String adminUsername, Long requestId, ResolveRequest dto) {

        User admin = userService.getUserByUsername(adminUsername);

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        MessageHelper.get("error.request.not.found", requestId)));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException(
                    MessageHelper.get("error.request.already.resolved"));
        }

        if (dto.getStatus() == RequestStatus.REJECTED &&
                (dto.getRemarks() == null || dto.getRemarks().isBlank())) {
            throw new IllegalArgumentException(
                    MessageHelper.get("error.request.remarks.required"));
        }

        request.setStatus(dto.getStatus());
        request.setRemarks(dto.getRemarks());
        request.setResolvedAt(LocalDateTime.now());
        request.setResolvedBy(admin);

        if (dto.getStatus() == RequestStatus.APPROVED) {
            applyRequest(request);
        }

        return mapToResponse(requestRepository.save(request));
    }

    // ── Apply approved request ────────────────────────────────────────────────

    private void applyRequest(Request request) {
        switch (request.getType()) {
            case OPEN_ACCOUNT -> applyOpenAccount(request);
            case EDIT_PROFILE -> applyEditProfile(request);
        }
    }

    private void applyOpenAccount(Request request) {
        CreateBankAccountRequest dto = fromJson(
                request.getPayload(), CreateBankAccountRequest.class);

        bankAccountService.addBankAccount(dto);

        log.info("Account opened for user {} via approved request id {}",
                request.getUser().getUsername(), request.getId());
    }

    private void applyEditProfile(Request request) {
        EditProfileRequest dto = fromJson(
                request.getPayload(), EditProfileRequest.class);

        User user = request.getUser();

        userService.updateProfile(user.getId(), user.getUsername(), dto);

        log.info("Profile updated for user {} via approved request id {}",
                request.getUser().getUsername(), request.getId());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize payload.", e);
        }
    }

    private <T> T fromJson(String json, Class<T> clazz) {
        try {
            return objectMapper.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize payload.", e);
        }
    }

    private String formatOwnerName(User user) {
        return Stream.of(
                user.getFirstName(),
                user.getMiddleName(),
                user.getLastName(),
                user.getSuffix())
                .filter(part -> part != null && !part.isBlank())
                .collect(Collectors.joining(" "));
    }

    private RequestResponse mapToResponse(Request r) {
        return RequestResponse.builder()
                .id(r.getId())
                .requesterUsername(r.getUser().getUsername())
                .requesterName(formatOwnerName(r.getUser()))
                .type(r.getType())
                .status(r.getStatus())
                .payload(r.getPayload())
                .remarks(r.getRemarks())
                .createdAt(r.getCreatedAt())
                .resolvedAt(r.getResolvedAt())
                .resolvedBy(r.getResolvedBy() != null
                        ? r.getResolvedBy().getUsername()
                        : null)
                .build();
    }
}
