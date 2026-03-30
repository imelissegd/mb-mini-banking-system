package com.example.minibankingsystem.dto.admin.request;

import com.example.minibankingsystem.model.enums.RequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResolveRequest {
    @NotNull(message = "{request.status.notNull}")
    private RequestStatus status;  // APPROVED or REJECTED

    private String remarks;        // required if REJECTED
}
