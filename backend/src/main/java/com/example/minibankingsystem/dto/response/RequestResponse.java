package com.example.minibankingsystem.dto.response;

import com.example.minibankingsystem.model.enums.RequestStatus;
import com.example.minibankingsystem.model.enums.RequestType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestResponse {
    private Long id;
    private String requesterUsername;
    private RequestType type;
    private RequestStatus status;
    private String payload;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private String resolvedBy;
}